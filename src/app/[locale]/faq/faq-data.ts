// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// FAQ data shared between FAQContent (client) and page.tsx (server JSON-LD)

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
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "Is Konectr free to use?",
        answer: "Yes, completely free. Create activities, match with others, and meet up—no cost. We may add optional premium features later, but core functionality stays free forever."
      },
      {
        question: "How do I create an account?",
        answer: "Download from the App Store (Android coming Q2 2026), sign up with phone or email, add your interests and a photo. Takes about 2 minutes."
      },
      {
        question: "What cities is Konectr available in?",
        answer: "Launching in Kuala Lumpur, Malaysia. We're starting with one city to build a strong community before expanding to more Malaysian cities and Southeast Asia. Join our waitlist for updates."
      },
      {
        question: "Do I need to verify my identity?",
        answer: "Phone verification is required. Optional photo verification earns you a trust badge, and hosts often prefer verified members for their activities."
      },
      {
        question: "What makes Konectr different from other social apps?",
        answer: "Activity-first, not profile-first. You create an activity, we match you with people planning the same thing, you meet IRL. No endless swiping or chats that go nowhere."
      },
      {
        question: "I'm new in KL. Can Konectr help me make friends?",
        answer: "This is exactly what we built Konectr for. Create an activity you'd enjoy—hiking at outdoor spots, brunch at a restaurant, or coffee at a cafe. Meet people who share your interests."
      }
    ]
  },
  {
    title: "How Konectr Works",
    icon: "💡",
    faqs: [
      {
        question: "How is Konectr different from Meetup or Bumble BFF?",
        answer: "Meetup = large anonymous groups (20-100+). Bumble BFF = one-on-one swiping that often fizzles. Konectr = small groups (2-8), activity-based matching, vetted venues. More intimate than Meetup, more social than Bumble BFF."
      },
      {
        question: "What if I'm shy or introverted?",
        answer: "Small groups (3-6 typical), activity-focused conversation topics, and everyone's there for the same reason. Many of our most active users are introverts who prefer this structured approach over traditional social settings."
      },
      {
        question: "Can I create my own activities (become a host)?",
        answer: "Yes! After attending a few activities, you can become a Konectr Captain. Create activities, choose from vetted venues, set group size limits, and earn special badges."
      },
      {
        question: "How does the matching work?",
        answer: "Pick your vibe, time slot, and venue. We find people planning the same activity, same time, within 50km. Browse matches, connect and meet. Simple, intentional matching."
      },
      {
        question: "What types of activities are available?",
        answer: "Chill — coffee, brunch, book clubs. Active — runs, hikes, fitness. Creative — photography, art, cooking. Social — happy hours, board games, karaoke. Focus — language exchange, networking. Adventure — day trips, exploring."
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
        answer: "Your friend network within the app—people you've met and both chose to add. Circle perks: permanent 1:1 chat, see when they create activities, broadcast your plans to them."
      },
      {
        question: "What happens after an activity ends?",
        answer: "Activity auto-completes 2 hours after end time. You'll rate the experience, leave kudos, and choose who to add to your Circle. Group chat archives become read-only."
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
        answer: "Phone verification required, optional photo verification with trust badges. All meetups at public vetted venues only. Badge system tracks positive participation, 3-strike policy for violations, zero tolerance for harassment with 24-hour report review."
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
        answer: "All data encrypted, end-to-end encryption for messages. We never sell your data. Download or delete your data anytime. PDPA (Malaysia/Singapore) and GDPR compliant."
      },
      {
        question: "What happens if I report someone?",
        answer: "Reports go to our safety team immediately. Review within 24 hours, faster for urgent issues. Outcomes range from warnings to permanent bans. Reports are confidential—they won't know who reported."
      },
      {
        question: "What are the community guidelines?",
        answer: "Do: Show up when committed, be inclusive, communicate if plans change. Don't: Ghost, harass, share others' contact info, discriminate, use for dating. Violations = warnings, suspension, or bans."
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
        answer: "24+ hours before: cancel freely. Within 24 hours: small reliability score impact. Repeated no-shows without notice can lead to restrictions. If emergencies happen, just message the group—people understand."
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
        answer: "Email hello@konectr.app with 'Feature Idea' in the subject. Tell us the problem you want solved. We read everything and add good ideas to our roadmap."
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
];
