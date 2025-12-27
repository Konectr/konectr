import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for activity from get_activity_by_share_code RPC
export interface SharedActivity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  venue_type: string | null;
  venue_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: string;
  share_code: string;
  creator_name: string;
  creator_photo_url: string | null;
}

// Fetch activity by share code
export async function getActivityByShareCode(shareCode: string): Promise<SharedActivity | null> {
  try {
    const { data, error } = await supabase.rpc('get_activity_by_share_code', {
      p_share_code: shareCode.toUpperCase(),
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return null;
    }

    // RPC returns an array, get the first result
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log('No activity found for share code:', shareCode);
      return null;
    }

    // Return first result if array, otherwise return as-is
    const activity = Array.isArray(data) ? data[0] : data;
    return activity as SharedActivity;
  } catch (err) {
    console.error('Error fetching activity:', err);
    return null;
  }
}
