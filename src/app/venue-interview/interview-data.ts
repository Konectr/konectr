// © Konectr 2026. All rights reserved.
// Venue Discovery Interview — field definitions matching Notion DB schema

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multi_select"
  | "phone"
  | "email"
  | "url";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
}

export interface Step {
  title: string;
  description: string;
  icon: string;
  fields: Field[];
}

export type FormData = Record<string, string | string[]>;

export const INITIAL_DATA: FormData = {
  interviewDate: new Date().toISOString().split("T")[0],
  venueName: "",
  venueType: "",
  neighborhood: "",
  googleRating: "",
  seatingCapacity: "",
  instagram: "",
  personInterviewed: "",
  role: "",
  contact: "",
  yearsOperating: "",
  dailyFootTraffic: "",
  repeatPercent: "",
  demographic: "",
  topChallenges: [],
  marketingChannels: [],
  monthlyMarketingSpend: "",
  hostedEventsBefore: "",
  openToMeetups: "",
  perkWillingness: "",
  topValueProps: [],
  dashboardInterest: "",
  partnerInterest: "",
  wifiGroupSeating: "",
  followUpEmail: "",
  followUpPhone: "",
  vibeCheck: "",
  partnerTier: "",
  ambianceScore: "",
  enthusiasm: "",
  keyQuote: "",
  slowPeriods: "",
  notes: "",
};

export const STEPS: Step[] = [
  // -----------------------------------------------------------------------
  // STEP 1 — Fill BEFORE the conversation (research + observe)
  // -----------------------------------------------------------------------
  {
    title: "Before You Walk In",
    description: "Research & observe — fill this before the conversation starts",
    icon: "📍",
    fields: [
      { key: "interviewDate", label: "Date", type: "date", required: true },
      {
        key: "venueName",
        label: "Venue Name",
        type: "text",
        required: true,
        placeholder: "e.g. Feeka Coffee Roasters",
      },
      {
        key: "venueType",
        label: "Venue Type",
        type: "select",
        required: true,
        options: [
          "☕ Cafe",
          "🍽️ Restaurant",
          "💪 Gym / Studio",
          "🍻 Bar / Pub",
          "🌳 Outdoor",
          "🎭 Entertainment",
          "🏢 Co-working",
          "Other",
        ],
      },
      {
        key: "neighborhood",
        label: "Neighborhood / Area",
        type: "select",
        required: true,
        options: [
          "TTDI",
          "Bangsar",
          "Bangsar South",
          "Mont Kiara",
          "Damansara Heights",
          "Desa ParkCity",
          "Sri Petaling",
          "Bukit Bintang",
          "KLCC",
          "Cheras",
          "Publika / Solaris",
          "Mid Valley / KL Eco City",
          "Petaling Jaya",
          "Subang Jaya",
          "Shah Alam",
          "Puchong",
          "KL Sentral",
          "Hartamas",
          "Ampang",
          "Other",
        ],
      },
      {
        key: "googleRating",
        label: "Google Maps Rating",
        type: "select",
        hint: "Look it up before going in",
        options: [
          "⭐ 4.5+",
          "⭐ 4.0–4.4",
          "⭐ 3.5–3.9",
          "⭐ Below 3.5",
          "Not listed",
        ],
      },
      {
        key: "seatingCapacity",
        label: "Seating Capacity",
        type: "number",
        placeholder: "Estimate when you walk in",
        min: 0,
      },
      {
        key: "instagram",
        label: "Instagram",
        type: "url",
        placeholder: "https://instagram.com/...",
        hint: "Check their page before — note follower count & vibe",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // STEP 2 — Introductions (first 1–2 minutes)
  // -----------------------------------------------------------------------
  {
    title: "Who You're Meeting",
    description: "Introductions — get their name and warm up",
    icon: "🤝",
    fields: [
      {
        key: "personInterviewed",
        label: "Who are you speaking with?",
        type: "text",
        required: true,
        placeholder: "Their name",
      },
      {
        key: "role",
        label: "Their Role",
        type: "select",
        required: true,
        options: ["Owner", "Manager", "Marketing Lead", "Staff", "Other"],
      },
      {
        key: "contact",
        label: "Phone Number",
        type: "phone",
        placeholder: "+60...",
        hint: "Direct number for follow-ups",
      },
      {
        key: "yearsOperating",
        label: "How long has this place been open?",
        type: "select",
        options: ["Under 1 year", "1–3 years", "3–5 years", "5+ years"],
        hint: "Great ice-breaker — shows genuine interest in their story",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // STEP 3 — Understand the business (4–5 minutes, mostly taps)
  // -----------------------------------------------------------------------
  {
    title: "How's Business?",
    description: "Understand their reality — listen more than you talk here",
    icon: "📊",
    fields: [
      {
        key: "dailyFootTraffic",
        label: "How busy is a typical day?",
        type: "select",
        options: ["Under 50", "50–100", "100–200", "200–500", "500+"],
        hint: "\"On a normal day, roughly how many customers come through?\"",
      },
      {
        key: "repeatPercent",
        label: "Roughly what % are regulars?",
        type: "number",
        placeholder: "e.g. 40",
        hint: "\"Do you see a lot of the same faces?\" — just estimate",
        min: 0,
        max: 100,
      },
      {
        key: "demographic",
        label: "Who's the main crowd?",
        type: "select",
        options: [
          "Students (18–24)",
          "Young professionals (25–35)",
          "Families with kids",
          "Mixed crowd",
        ],
        hint: "\"What kind of people do you mainly attract?\"",
      },
      {
        key: "topChallenges",
        label: "Biggest challenges right now?",
        type: "multi_select",
        hint: "\"What's the hardest part about running this place?\" — pick 2–3",
        options: [
          "Attracting new customers",
          "Keeping regulars coming back",
          "Standing out from competition",
          "Filling quiet hours",
          "Rising costs",
          "Getting noticed online",
          "Building a community",
        ],
      },
      {
        key: "marketingChannels",
        label: "How do people find this place?",
        type: "multi_select",
        hint: "\"What's been bringing people in?\"",
        options: [
          "Social Media",
          "Google Maps",
          "Delivery Apps",
          "Walk-ins",
          "Word of Mouth",
          "Influencer Collabs",
          "Loyalty Program",
          "Events",
          "Paid Ads",
          "None",
        ],
      },
      {
        key: "monthlyMarketingSpend",
        label: "Monthly marketing spend?",
        type: "select",
        hint: "\"Roughly what do you put into marketing each month?\"",
        options: [
          "RM 0",
          "Under RM 500",
          "RM 500–2k",
          "RM 2k–5k",
          "RM 5k+",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // STEP 4 — The Konectr pitch (4–5 minutes)
  // -----------------------------------------------------------------------
  {
    title: "Community & Konectr",
    description: "Introduce the Konectr concept — paint the picture for them",
    icon: "🎯",
    fields: [
      {
        key: "hostedEventsBefore",
        label: "Have they hosted events or group activities?",
        type: "select",
        options: [
          "Yes, regularly",
          "A few times",
          "No, but open to it",
          "No, not their thing",
        ],
        hint: "\"Have you ever done events, workshops, group bookings here?\"",
      },
      {
        key: "openToMeetups",
        label: "Open to Konectr-style meetups here?",
        type: "select",
        options: [
          "Love it — bring them in",
          "Sounds interesting",
          "Maybe, need to think",
          "Not really for us",
        ],
        hint: "\"Imagine 3–6 young professionals showing up on a quiet Tuesday for board games or a creative workshop — how would that feel?\"",
      },
      {
        key: "perkWillingness",
        label: "Open to offering a small perk to attract groups?",
        type: "select",
        options: [
          "Yes, happy to",
          "Depends on the deal",
          "Probably not",
          "No",
        ],
        hint: "\"Like 10% off or a welcome drink for Konectr meetups?\"",
      },
      {
        key: "topValueProps",
        label: "Which of these would matter most to them?",
        type: "multi_select",
        hint: "Let them pick 2–3 that resonate",
        options: [
          "Foot traffic during quiet hours",
          "Reaching 21–35 year olds",
          "Free analytics dashboard",
          "Konectr Hub badge",
          "Promos to nearby users",
          "Events with zero effort",
        ],
      },
      {
        key: "dashboardInterest",
        label: "Interest in a free analytics dashboard?",
        type: "select",
        hint: "\"What if you could see foot traffic data, busy hours, customer insights — all free?\"",
        options: ["Very interested", "Somewhat interested", "Not interested"],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // STEP 5 — Close the conversation (1–2 minutes)
  // -----------------------------------------------------------------------
  {
    title: "Wrapping Up",
    description: "Close the conversation — get their answer and contact info",
    icon: "✅",
    fields: [
      {
        key: "partnerInterest",
        label: "Overall, how interested are they?",
        type: "select",
        options: [
          "✅ Sign me up",
          "🤔 Interested — let's follow up",
          "⏳ Need to think about it",
          "❌ Not for us",
        ],
        hint: "\"Would you be interested in being one of our launch partners?\"",
      },
      {
        key: "followUpEmail",
        label: "Best email for follow-up",
        type: "email",
        placeholder: "email@venue.com",
      },
      {
        key: "followUpPhone",
        label: "Best phone for follow-up",
        type: "phone",
        placeholder: "+60...",
        hint: "May be different from the direct contact above",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // STEP 6 — Your debrief (fill within 5 min of leaving)
  // -----------------------------------------------------------------------
  {
    title: "After You Leave",
    description: "Your honest debrief — fill this while it's fresh (within 5 min)",
    icon: "📝",
    fields: [
      {
        key: "vibeCheck",
        label: "Vibe Check — gut feeling",
        type: "select",
        options: ["🟢 Great Fit", "🟡 Potential", "🔴 Not a Fit"],
      },
      {
        key: "partnerTier",
        label: "Where do they sit in our pipeline?",
        type: "select",
        options: [
          "🥇 Founding Partner",
          "🥈 Early Adopter",
          "🥉 Waitlist",
          "🚫 Pass",
        ],
      },
      {
        key: "ambianceScore",
        label: "Would Konectr users love this place?",
        type: "number",
        placeholder: "1–5",
        hint: "1 = not really, 5 = absolutely — think vibe, space, energy",
        min: 1,
        max: 5,
      },
      {
        key: "wifiGroupSeating",
        label: "WiFi + group seating available?",
        type: "select",
        options: ["Yes, both", "WiFi only", "Seating only", "Neither"],
        hint: "Could a group of 4–6 actually sit and hang out here?",
      },
      {
        key: "enthusiasm",
        label: "How excited were THEY?",
        type: "select",
        options: [
          "🔥 Couldn't wait to start",
          "😊 Open and positive",
          "😐 Polite but lukewarm",
          "❄️ Not interested",
        ],
      },
      {
        key: "keyQuote",
        label: "Key quote from the conversation",
        type: "textarea",
        placeholder: "The one thing they said that stuck with you...",
        hint: "Their exact words — this is gold for our pitch deck",
      },
      {
        key: "slowPeriods",
        label: "When are their slow times?",
        type: "textarea",
        placeholder: "e.g. \"Tuesdays and Wednesdays after lunch are dead\"",
        hint: "This tells us exactly when to send Konectr users their way",
      },
      {
        key: "notes",
        label: "Notes — the full picture",
        type: "textarea",
        placeholder: "What makes this place special, red flags, next steps...",
        hint: "Your future self will thank you — capture everything that matters",
      },
    ],
  },
];
