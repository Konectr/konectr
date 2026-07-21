// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// FAQ data shared between FAQContent (client) and page.tsx (server JSON-LD)
// v3 — 58 questions across 9 categories (updated 2026-03-01)

export type FAQ = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  title: string;
  icon: string;
  faqs: FAQ[];
};

// ============================================
// EMOJI REFERENCE (synced with mobile: lib/constants/category_reference.dart)
// ============================================
// VENUE: ☕ Cafe | 🍽️ Restaurant | 🍻 Bar | 💪 Fitness | ⛰️ Outdoors | 🎭 Entertainment
// ACTIVITY: ☕ Chill | 💪 Active | 🎯 Focus | 🎨 Creative | ⛰️ Adventure | 🎉 Social | 📌 Default

export const faqCategories: FAQCategory[] = [
  {
    title: "About Konectr",
    icon: "📱",
    faqs: [
      {
        question: "What is Konectr?",
        answer: "Konectr is a free social app that helps adults make real friends through shared activities in Kuala Lumpur. Instead of endless swiping, you pick an activity, get matched with 2-5 nearby people who want to do the same thing, and meet at a vetted public venue. It's activity-first, not profile-first."
      },
      {
        question: "How much does Konectr cost?",
        answer: "Konectr is completely free. Creating activities, matching with others, messaging, and meeting up cost nothing. We may add optional premium features in the future, but the core experience of meeting people will always be free."
      },
      {
        question: "Is Konectr available in my city?",
        answer: "Konectr is currently available in Kuala Lumpur, Malaysia only. We're starting with one city to build a strong, active community before expanding. Next cities planned: more Malaysian cities, then Southeast Asia. Join the waitlist at konectr.app for expansion updates."
      },
      {
        question: "How is Konectr different from Meetup or Bumble BFF?",
        answer: "Meetup hosts large anonymous groups (20-100+) where you can easily get lost. Bumble BFF is one-on-one swiping that often leads to chats that go nowhere. Konectr sits in the sweet spot: small groups (2-8), activity-based matching at vetted venues. More intimate than Meetup, more social than Bumble BFF, and every match leads to a real meetup — not just another chat."
      },
      {
        question: "How do I meet people in KL if I'm an expat?",
        answer: "Konectr was built for exactly this. Pick any activity — coffee at a cafe, a fitness class, outdoor hiking — and Konectr matches you with locals and other expats who want to do the same thing. Small groups (2-5) at public venues make it easy and safe to meet new people."
      },
      {
        question: "What kind of activities can I do on Konectr?",
        answer: "Six categories: Chill (coffee, brunch), Active (fitness, hiking, running), Creative (art, photography, cooking), Social (happy hours, board games), Focus (language exchange, networking), and Adventure (day trips, exploring). You can also create custom activities."
      },
      {
        question: "Can I use Konectr for dating?",
        answer: "No. Konectr is for friendship only. Our community guidelines explicitly prohibit using the app for dating or romantic approaches. This is what makes Konectr a safe space — everyone knows the intention is genuine friendship through shared activities."
      }
    ]
  },
  {
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Download from the App Store (Android coming Q2 2026), sign up with phone or email, add your interests and a photo. Takes about 2 minutes."
      },
      {
        question: "Do I need to verify my identity?",
        answer: "Phone verification is required. Optional photo verification (coming soon) will earn you a trust badge, and hosts often prefer verified members for their activities."
      },
      {
        question: "What makes Konectr different from other social apps?",
        answer: "No chat that goes nowhere. On Konectr, every connection leads to a real meetup. You pick an activity, get matched with people planning the same thing, and meet IRL at a vetted venue. No endless swiping, no ghosting — just real people doing real things."
      },
      {
        question: "I'm new in KL. Can Konectr help me make friends?",
        answer: "This is exactly what we built Konectr for. Create an activity you'd enjoy—hiking at outdoor spots, brunch at a restaurant, or coffee at a cafe. Meet people who share your interests."
      },
      {
        question: "How complete does my profile need to be?",
        answer: "The more complete your profile, the better your matches. To use Pulse (AI matching), you need 100% profile completeness — that means a photo, bio, interests, and availability. Even without Pulse, a complete profile helps hosts and other members decide to join your activities."
      }
    ]
  },
  {
    title: "How Konectr Works",
    icon: "💡",
    faqs: [
      {
        question: "What if I'm shy or introverted?",
        answer: "Small groups (3-6 typical), activity-focused conversation topics, and everyone's there for the same reason. Many of our most active users are introverts who prefer this structured approach over traditional social settings."
      },
      {
        question: "Can I create my own activities (become a host)?",
        answer: "Yes! Anyone can create activities and become a host. Choose from vetted venues, set your group size, pick a time slot, and publish. Earn special Captain badges as you host more activities."
      },
      {
        question: "How does the matching work?",
        answer: "Pick your vibe, time slot, and venue. Konectr finds people planning the same activity, same time, within 50km. You can also use Pulse — our AI matching feature — which automatically finds your best match based on interests, availability, and profile compatibility. Either way, every match leads to a real meetup."
      },
      {
        question: "What is Pulse and how does AI matching work?",
        answer: "Pulse is Konectr's AI-powered matching feature. Instead of browsing activities manually, Pulse finds your best match automatically based on your interests, availability, location, and profile. It uses a commit-then-reveal flow: you opt in, Pulse finds a match, and both of you get a celebration reveal with activity details. Requires 100% profile completeness to activate."
      },
      {
        question: "How do referral links work?",
        answer: "Every Konectr user gets a unique referral link (konectr.app/r/yourcode). Share it with friends — when they sign up through your link, both of you earn XP and progress toward referral badges. Find your link in your profile or share it directly from the app."
      },
      {
        question: "What if no one matches my activity?",
        answer: "Share it with your Konectr Circle, or keep it open for up to 7 days. Others might plan the same thing later. Some of our best Captains started as the only person—then others joined."
      },
      {
        question: "What are time slots and how do they work?",
        answer: "Instead of exact times, pick a window: Morning (9AM-12PM), Afternoon (12PM-3PM), Late Afternoon (3PM-6PM), Evening (6PM-9PM), or Night (9PM-12AM). Coordinate specifics through chat. Plan up to 7 days ahead."
      },
      {
        question: "What's a 'Konectr Circle'?",
        answer: "Your friend network within the app — people you've connected with. Anyone can add anyone to their Circle (no mutual activity required). Circle perks: permanent 1:1 chat, see when they create activities, broadcast your plans to them."
      },
      {
        question: "What happens after an activity ends?",
        answer: "Activity auto-completes 2 hours after end time. You'll earn XP and progress toward badges, rate the experience, leave kudos, and choose who to add to your Circle. Group chat archives become read-only."
      },
      {
        question: "Can I host private activities?",
        answer: "Yes. Choose 'Public' (visible to matching users) or 'Circle Only' (visible only to your friends). Circle-only is great for reunions or testing new activity ideas."
      }
    ]
  },
  {
    title: "Safety & Trust",
    icon: "🛡️",
    faqs: [
      {
        question: "How do I know the people I meet are safe?",
        answer: "Phone verification required, optional photo verification (coming soon) with trust badges. All meetups at public vetted venues only. Badge system tracks positive participation. Three-strike system for violations: 3 reports = warning, 6 = suspension, 9 = six-month ban. Zero tolerance for harassment with 24-hour report review."
      },
      {
        question: "What are vetted venues?",
        answer: "Every venue is personally visited and approved. We check for safety (well-lit, accessible, easy exits), conversation-friendly atmosphere, and consistent quality. Categories include Cafe, Restaurant, Bar, Fitness, Outdoors, and Entertainment."
      },
      {
        question: "What if someone makes me uncomfortable?",
        answer: "Report in-app anytime—during or after an activity. Block instantly. Your safety comes first; leave if needed. We review urgent reports within hours, all reports within 24 hours. Serious violations = permanent bans."
      },
      {
        question: "Can I remain anonymous?",
        answer: "Your full name, phone, email, and exact location are never shared. You control your display name, photos, and bio. First names only shown after you both join the same activity. Chat stays in-app."
      },
      {
        question: "Is my data safe?",
        answer: "All data is encrypted in transit and at rest. We never sell your data. Download or delete your data anytime. PDPA (Malaysia/Singapore) and GDPR compliant."
      },
      {
        question: "What happens if I report someone?",
        answer: "Reports go to our safety team immediately. Review within 24 hours, faster for urgent issues. Outcomes range from warnings to permanent bans. Reports are confidential—they won't know who reported."
      },
      {
        question: "What are the community guidelines?",
        answer: "Do: Show up when committed, be inclusive, communicate if plans change. Don't: Ghost, harass, share others' contact info, discriminate, use for dating. Violations = warnings, suspension, or bans."
      },
      {
        question: "Where can I read the Terms of Service and Privacy Policy?",
        answer: "You can read our full Terms of Service at konectr.app/terms and our Privacy Policy at konectr.app/privacy. Both are accessible from the app settings and from the footer of our website. We believe in transparency — no hidden clauses."
      }
    ]
  },
  {
    title: "Activities & Meetups",
    icon: "🎯",
    faqs: [
      {
        question: "How many people are typically at an activity?",
        answer: "3-8 people. Hosts set their preferred size. Activities need minimum signups (usually 2-3) to run—no awkward empty venues."
      },
      {
        question: "What if I need to cancel?",
        answer: "You can withdraw anytime — your spot opens up for someone else and the plan carries on without you. Within 3 hours of start time, the group is notified right away and the late withdrawal counts toward your reliability record. Repeated no-shows without notice can lead to restrictions. If emergencies happen, just message the group—people understand."
      },
      {
        question: "Can I bring a friend?",
        answer: "Some activities allow +1s (look for the tag). Most don't because small group dynamics work best with solo joiners. Better option: have your friend download Konectr and join activities themselves."
      },
      {
        question: "What if no one talks to me?",
        answer: "Hosts are encouraged to include everyone. Small groups (3-6) mean you can't get lost. Many activities have icebreakers built in. If it still happens, let us know—we'll follow up."
      },
      {
        question: "How do I know what to expect at an activity?",
        answer: "Every listing shows: venue with photos, group size, duration, vibe tags (Chill, Active, Social, Creative, Focus, Adventure), what's included, what to bring, and host notes. Plus reviews from past participants."
      },
      {
        question: "What's the etiquette for a first activity?",
        answer: "Arrive on time, introduce yourself to the host first, put your phone away, ask questions and listen. After: rate honestly, add people you vibed with to your Circle."
      },
      {
        question: "Can I suggest new venue types?",
        answer: "Yes! Email hello@konectr.app with the venue name, location, and why it's good for socializing. Many of our best venues came from community suggestions."
      },
      {
        question: "What if the activity is cancelled?",
        answer: "Host cancels: you get notified immediately, no impact on your reliability. Not enough signups: you're notified before the scheduled time. Consider hosting your own version."
      },
      {
        question: "Can I join an activity that's already in progress?",
        answer: "No — once an activity's time slot has started, it's no longer open for new joiners. This protects the experience for everyone already there. Keep an eye on upcoming activities and join before they start. You can also create your own activity for a time that works for you."
      }
    ]
  },
  {
    title: "Badges & Gamification",
    icon: "🏆",
    faqs: [
      {
        question: "Why badges instead of ratings?",
        answer: "We don't rate humans. Star ratings create anxiety and can be weaponized. Badges only go up, never down. They celebrate consistency and positive participation, not perfection."
      },
      {
        question: "What badges can I earn?",
        answer: "Participation (activities attended), Hosting (activities hosted), Community (connections made), Consistency (streaks), Vibe Explorer (trying different activity types). Try all vibes to earn Renaissance Soul!"
      },
      {
        question: "How do badges help me?",
        answer: "Trust signals for hosts and attendees. Personal milestones to track your journey. Conversation starters. Some hosts set badge requirements for their activities."
      },
      {
        question: "What are XP points and how do I earn them?",
        answer: "XP (experience points) measure your overall engagement on Konectr. You earn XP by attending activities, hosting, adding people to your Circle, maintaining streaks, completing your profile, and referring friends. XP determines your tier level and unlocks perks as you progress."
      },
      {
        question: "What are the tier levels?",
        answer: "Konectr has 6 tiers: Basic (starting), Explorer, Connector, Captain, Ambassador, and Legendary. Each tier requires more XP and unlocks new perks like priority matching, exclusive badges, and recognition in the community. Check your progress on your profile page."
      }
    ]
  },
  {
    title: "Account & Settings",
    icon: "⚙️",
    faqs: [
      {
        question: "How do I edit my profile?",
        answer: "Profile tab, then Edit Profile. Update photos, display name, bio, interests, and availability. Tip: 3+ photos and detailed interests = better matches."
      },
      {
        question: "Can I pause my account?",
        answer: "Yes. Settings, Account, Pause Account. Your profile hides, you won't get notifications, but all data is preserved. Unpause anytime."
      },
      {
        question: "How do I delete my account?",
        answer: "Settings, Account, Delete Account. Permanently removes all data, photos, history, connections, and badges. Cannot be undone. Having issues? Reach out to hello@konectr.app first."
      },
      {
        question: "Why am I not seeing many activities?",
        answer: "Try: expanding search radius (up to 50km), adding more availability slots, broadening vibe filters. Still quiet? You might be in a new area—create an activity yourself and others will join."
      },
      {
        question: "How do I change my notification settings?",
        answer: "Settings, Notifications. Toggle match alerts, activity suggestions, messages, reminders, and Circle updates. Keep match and message notifications on to avoid missing connections."
      },
      {
        question: "How do I share my Konectr profile or referral link?",
        answer: "Go to your profile and tap the share icon. You can share your unique referral link (konectr.app/r/yourcode) via WhatsApp, Instagram, or any messaging app. When friends sign up through your link, both of you earn XP."
      }
    ]
  },
  {
    title: "Premium & Future Features",
    icon: "✨",
    faqs: [
      {
        question: "Are there any paid features?",
        answer: "Currently everything is free. We may add optional premium features later (priority matching, advanced filters), but core functionality—meeting people—stays free."
      },
      {
        question: "When is Android coming?",
        answer: "Q2 2026. We're starting iOS-first to nail the experience. Join waitlist at konectr.app for early access."
      },
      {
        question: "What new features are coming?",
        answer: "Near-term: Android, more Malaysian cities, venue partnerships. Future: AI recommendations, weather-aware suggestions, group planning tools. What stays: activity-first matching, small groups, badges (not ratings)."
      }
    ]
  },
  {
    title: "Troubleshooting & Support",
    icon: "🔧",
    faqs: [
      {
        question: "The app is crashing/slow. What do I do?",
        answer: "Force close and restart. Check for App Store updates. Restart your phone. Check your internet. Still broken? Email hello@konectr.app with device model, iOS version, and screenshots."
      },
      {
        question: "I'm not receiving notifications. Help!",
        answer: "Check: Settings, Notifications (toggles on). iOS Settings, Konectr, Notifications (allowed). Do Not Disturb (off for Konectr). Still nothing? Reinstall the app."
      },
      {
        question: "How do I contact support?",
        answer: "Email hello@konectr.app. Response times: general questions within 24 hours, safety issues within hours, technical bugs same business day. Include screenshots and details."
      },
      {
        question: "I have an idea/feedback for Konectr!",
        answer: "Visit konectr.app/feedback to see community feature requests and suggestions. You can also email hello@konectr.app with 'Feature Idea' in the subject. Tell us the problem you want solved. We read everything and add good ideas to our roadmap."
      },
      {
        question: "What is the feedback board?",
        answer: "The feedback board at konectr.app/feedback is where you can see feature requests, bug reports, and suggestions from the Konectr community. It's fully transparent — you can see what others have asked for and how many votes each idea has. Voting is available in the mobile app, and viewing is available on the web."
      }
    ]
  }
];

export const helpfulResources = [
  {
    title: "How It Works",
    description: "See Konectr in action",
    href: "/how-it-works",
    icon: "📱",
  },
  {
    title: "Safety",
    description: "Our commitment to you",
    href: "/safety",
    icon: "🛡️",
  },
  {
    title: "About Us",
    description: "Our story and mission",
    href: "/about",
    icon: "💜",
  },
  {
    title: "Blog",
    description: "Tips and stories",
    href: "/blog",
    icon: "📖",
  },
  {
    title: "Terms of Service",
    description: "Our terms and conditions",
    href: "/terms",
    icon: "📜",
  },
  {
    title: "Privacy Policy",
    description: "How we protect your data",
    href: "/privacy",
    icon: "🔒",
  },
];
