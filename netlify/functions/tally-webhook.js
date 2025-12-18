// Netlify Function to handle Tally webhook and insert into Supabase
// This function receives Tally form submissions and stores them in your waitlist_users table

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    // Prefer service role key if provided (server-side only), fallback to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the incoming webhook data from Tally
    const data = JSON.parse(event.body);
    
    // Conditional debug logging to avoid noisy logs + PII in production
    const isDebug = (process.env.LOG_LEVEL || '').toLowerCase() === 'debug';
    if (isDebug) {
      console.log('Received webhook data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Webhook received (redacted).');
    }

    // Extract form fields from Tally webhook
    // Tally sends data in format: { eventId, eventType, createdAt, data: { fields: [...] } }
    const fields = data.data?.fields || [];
    
    // Map Tally fields to our database structure
    const formData = {};
    
    fields.forEach(field => {
      console.log(`Processing field: ${field.key} = ${JSON.stringify(field.value)} | Label: "${field.label}" | Type: ${field.type}`);
      
      // Map based primarily on robust signals (field.type), with label as fallback
      const label = field.label?.toLowerCase() || '';
      const fieldType = field.type;

      // EMAIL: Use INPUT_EMAIL type only, and never overwrite once set
      if (!formData.email) {
        if (fieldType === 'INPUT_EMAIL' && typeof field.value === 'string') {
          formData.email = String(field.value).trim().toLowerCase();
        } else if (label.includes('email') && typeof field.value === 'string' && field.value.includes('@')) {
          // Fallback if type not provided by Tally for some reason
          formData.email = String(field.value).trim().toLowerCase();
        }
      }

      // FIRST NAME
      if (label.includes('first name') || (label.includes('name') && !label.includes('form'))) {
        formData.first_name = field.value;
      } else if (label.includes('phone')) {
        formData.phone = field.value;
      } else if (label.includes('gender')) {
        if (field.value && field.value.length > 0 && field.options) {
          const selectedOption = field.options.find(opt => opt.id === field.value[0]);
          formData.gender = selectedOption ? selectedOption.text : null;
        }
      } else if (label.includes('area')) {
        if (field.value && field.value.length > 0 && field.options) {
          const selectedOption = field.options.find(opt => opt.id === field.value[0]);
          formData.area = selectedOption ? selectedOption.text : null;
        }
      } else if (label.includes('age')) {
        if (field.value && field.value.length > 0 && field.options) {
          const selectedOption = field.options.find(opt => opt.id === field.value[0]);
          formData.age_range = selectedOption ? selectedOption.text : null;
        }
      } else if (label.includes('privacy') || label.includes('data processing')) {
        formData.data_processing_consent = field.value === true;
      } else if (label.includes('women') || label.includes('marketing')) {
        formData.women_only_features_consent = field.value === true;
      }
      
      // Also handle checkboxes with multiple options
      if (field.type === 'CHECKBOXES' && field.value && Array.isArray(field.value)) {
        field.value.forEach(selectedId => {
          const selectedOption = field.options?.find(opt => opt.id === selectedId);
          if (selectedOption) {
            const optionText = selectedOption.text.toLowerCase();
            if (optionText.includes('privacy') || optionText.includes('data processing')) {
              formData.data_processing_consent = true;
            } else if (optionText.includes('women') || optionText.includes('marketing')) {
              formData.women_only_features_consent = true;
            }
          }
        });
      }
    });

    // Redacted mapping log in production
    if (isDebug) {
      console.log('Mapped form data:', JSON.stringify(formData, null, 2));
    } else {
      const redacted = { ...formData, email: !!formData.email, phone: !!formData.phone, ip_address: undefined, user_agent: undefined };
      console.log('Mapped form data (redacted):', JSON.stringify(redacted));
    }

    // Validate required fields
    if (!formData.email) {
      console.error('Missing email field in form data');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Add metadata
    formData.referral_source = 'tally_form';
    
    // Handle IP address - extract first IP if multiple are present
    const rawIpAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'];
    if (rawIpAddress) {
      // Split by comma and take the first IP address
      formData.ip_address = rawIpAddress.split(',')[0].trim();
    } else {
      formData.ip_address = null;
    }
    
    formData.user_agent = event.headers['user-agent'];

    if (isDebug) {
      console.log('Final form data before Supabase insert:', JSON.stringify(formData, null, 2));
    } else {
      console.log('Final form data ready (redacted).');
    }

    // Insert into Supabase
    const { data: insertedData, error } = await supabase
      .from('waitlist_users')
      .insert([formData])
      .select();

    if (error) {
      console.error('Supabase insertion error:', error);
      
      // Handle duplicate email error gracefully
      if (error.code === '23505' && error.message.includes('email')) {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Email already registered',
            status: 'duplicate'
          })
        };
      }
      
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database insertion failed', details: error.message })
      };
    }

    console.log('Successfully inserted user:', insertedData[0]?.id);

    // Optional: Send welcome email here
    // await sendWelcomeEmail(formData.email, formData.first_name);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Waitlist signup successful!',
        userId: insertedData[0]?.id,
        status: 'success'
      })
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
