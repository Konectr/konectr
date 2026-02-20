// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

export const tiers = [
  {
    name: "Basic",
    emoji: "🌱",
    color: "#9CA3AF",
    activitiesRequired: 0,
    description: "Your journey begins here. Create your first activity to start climbing.",
    perks: ["Create activities", "Join meetups", "Basic profile"],
  },
  {
    name: "Explorer",
    emoji: "🧭",
    color: "#3B82F6",
    activitiesRequired: 3,
    description: "You've taken the first step. Keep exploring new vibes and venues.",
    perks: ["Explorer badge", "Activity history", "Streak tracking"],
  },
  {
    name: "Connector",
    emoji: "🤝",
    color: "#8B5CF6",
    activitiesRequired: 10,
    description: "You're building real connections. People notice your vibe.",
    perks: ["Priority matching", "Custom reactions", "Profile flair"],
  },
  {
    name: "Trailblazer",
    emoji: "🔥",
    color: "#F59E0B",
    activitiesRequired: 25,
    description: "A true community leader. You set the pace for others to follow.",
    perks: ["Trailblazer badge", "Extended group size", "Activity insights"],
  },
  {
    name: "Platinum",
    emoji: "💎",
    color: "#06B6D4",
    activitiesRequired: 50,
    description: "Elite status. Your commitment to real connections is unmatched.",
    perks: ["Platinum frame", "Priority support", "Exclusive events"],
  },
  {
    name: "Legendary",
    emoji: "👑",
    color: "#EAB308",
    activitiesRequired: 100,
    description: "The highest honor. You're a pillar of the Konectr community.",
    perks: ["Legendary crown", "Beta features", "Community council"],
  },
];

export const badgeCategories = [
  {
    emoji: "🤝",
    name: "Social Butterfly",
    description: "Meet new people across different activities",
    example: "Met 10 unique people",
  },
  {
    emoji: "📍",
    name: "Venue Explorer",
    description: "Discover and visit diverse venues around the city",
    example: "Visited 15 venues",
  },
  {
    emoji: "🔥",
    name: "Streak Master",
    description: "Maintain weekly activity streaks without breaking",
    example: "4-week streak",
  },
  {
    emoji: "🎯",
    name: "Activity Creator",
    description: "Host activities and bring people together",
    example: "Created 10 activities",
  },
  {
    emoji: "⭐",
    name: "Top Rated",
    description: "Receive great feedback from activity partners",
    example: "5-star average",
  },
  {
    emoji: "🌍",
    name: "Category Explorer",
    description: "Try activities across all six vibe categories",
    example: "All 6 categories",
  },
  {
    emoji: "🌙",
    name: "Night Owl",
    description: "Join evening and late-night activities",
    example: "10 evening meetups",
  },
  {
    emoji: "☀️",
    name: "Early Bird",
    description: "Start your day with morning activities",
    example: "10 morning meetups",
  },
  {
    emoji: "🏆",
    name: "Champion",
    description: "Achieve milestones across multiple badge categories",
    example: "15 total badges",
  },
];

export const badgeRarities = [
  { name: "Common", color: "#9CA3AF", distribution: "60%" },
  { name: "Uncommon", color: "#3B82F6", distribution: "25%" },
  { name: "Rare", color: "#8B5CF6", distribution: "10%" },
  { name: "Epic", color: "#F59E0B", distribution: "4%" },
  { name: "Legendary", color: "#EF4444", distribution: "1%" },
];

export const streakMilestones = [
  { days: 7, label: "1 Week", color: "#F59E0B", description: "First flame lit" },
  { days: 14, label: "2 Weeks", color: "#F97316", description: "Building momentum" },
  { days: 21, label: "3 Weeks", color: "#EF4444", description: "On fire" },
  { days: 30, label: "1 Month", color: "#DC2626", description: "Unstoppable" },
  { days: 60, label: "2 Months", color: "#B91C1C", description: "Legendary flame" },
  { days: 90, label: "3 Months", color: "#991B1B", description: "Eternal flame" },
];

export const flamePhases = [
  { range: "1-7 days", color: "#F59E0B", label: "Spark" },
  { range: "8-21 days", color: "#F97316", label: "Blaze" },
  { range: "22-60 days", color: "#EF4444", label: "Inferno" },
  { range: "60+ days", color: "#DC2626", label: "Eternal" },
];

export const dailyRewardsHighlights = [
  { day: 1, xp: 10, emoji: "🎁", label: "Welcome Bonus" },
  { day: 3, xp: 15, emoji: "⚡", label: "Getting Started" },
  { day: 7, xp: 50, emoji: "🔥", label: "Week One", special: true },
  { day: 14, xp: 75, emoji: "💎", label: "Two Weeks", special: true },
  { day: 21, xp: 100, emoji: "🏆", label: "Three Weeks", special: true },
  { day: 30, xp: 200, emoji: "👑", label: "Full Cycle", special: true },
];

export const xpSources = [
  { icon: "🎯", label: "Create an Activity", range: "20-50 XP" },
  { icon: "🤝", label: "Join an Activity", range: "15-30 XP" },
  { icon: "✅", label: "Complete a Meetup", range: "30-100 XP" },
  { icon: "⭐", label: "Leave a Review", range: "10-20 XP" },
  { icon: "📅", label: "Daily Check-in", range: "5-15 XP" },
  { icon: "🔥", label: "Streak Bonus", range: "1.0x-2.0x multiplier" },
];
