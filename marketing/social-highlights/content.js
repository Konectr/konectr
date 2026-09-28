// Slide copy for both profiles. *word* = highlighted word.
const A = 'activities/', H = 'homepage/', E = 'email/';

const APP = {
  name: 'Konectr App', folder: 'Konectr App (@konectr.app)', theme: 'dark', handle: '@konectr.app',
  sections: [
    { key: 'HELLO', emoji: '⚡', slides: [
      { t: 'title', sub: 'What even is Konectr? Tap through, 60 seconds.' },
      { t: 'photo', img: H + 'before.jpg', big: 'Making friends after 25 is *weirdly hard.*', small: "It's not you. It's the group chat that died in 2021." },
      { t: 'logo', big: 'Meet *Konectr.*', small: 'Turns "we should hang out sometime" into an actual time.' },
      { t: 'steps', steps: ['Pick a vibe.', "See who's free.", 'Show up.'], small: "That's the whole app. We tried making it longer. Couldn't." },
      { t: 'photo', img: H + 'after.jpg', big: 'No swiping. *No bio anxiety.*', small: 'Just plans, real people, real places.' },
      { t: 'cta', big: 'Free. In KL. *Right now.*', small: 'Your weekend called.', button: 'Get the iPhone beta', note: 'Link in bio' },
    ]},
    { key: 'SAFE', emoji: '🛡️', slides: [
      { t: 'title', sub: 'Is it safe? Short answer: yes. Long answer, tap.' },
      { t: 'icon', icon: '📍', big: 'Public places *only.*', small: 'Cafés, gyms, parks. Never "my place."' },
      { t: 'icon', icon: '✉️', big: 'No mystery *accounts.*', small: 'Every account is tied to a verified email.' },
      { t: 'icon', icon: '🔒', big: 'Your details? *Locked.*', small: 'Number, email and exact location are never shared. Chat stays in-app.' },
      { t: 'icon', icon: '🚨', big: 'Two taps to *report.*', small: 'Every report reviewed within 24h. Urgent ones, faster.' },
      { t: 'strikes', big: 'Three strikes. *No drama.*' },
      { t: 'icon', icon: '🤝', big: 'Friends only. *Seriously.*', small: 'Want a date? Wrong app. Want brunch? Right app.' },
    ]},
    { key: 'FAQ', emoji: '❓', slides: [
      { t: 'title', sub: 'You asked. We answered, with minimal sass.' },
      { t: 'qa', q: 'Is it free?', a: 'Not "free trial" free. *Actually free.*' },
      { t: 'qa', q: 'Where?', a: 'KL for now. Rest of Malaysia next. *Patience, Penang.*' },
      { t: 'qa', q: "Isn't this just Meetup?", a: 'Meetup: 80 strangers, one name tag. Konectr: one plan, a few people, *real conversation.*' },
      { t: 'qa', q: 'So... Bumble BFF?', a: 'No swiping. No "hey" that goes nowhere. *Every match ends in a meetup.*' },
      { t: 'qa', q: "What's Pulse?", a: 'Our AI matchmaker. Tell it you\'re free, *it finds your people.*' },
      { t: 'qa', q: 'Need to cancel?', a: 'Withdraw anytime. Just don\'t ghost, *the crew notices.*' },
      { t: 'qa', q: 'Android when?', a: 'Closed testing now. Email *hello@konectr.app* to skip the line.' },
    ]},
    { key: 'GET IT', emoji: '📲', slides: [
      { t: 'title', sub: 'How do I get in? Easier than finding parking in Bangsar.' },
      { t: 'icon', icon: '🍎', chip: 'iOS · Beta', big: 'iPhone? *You\'re in.*', small: "Beta's live. Link in bio." },
      { t: 'icon', icon: '🤖', chip: 'Android · Closed testing', big: 'Android? *Almost.*', small: 'Email hello@konectr.app and we\'ll add you.' },
      { t: 'code', big: 'Got an invite *code?*', small: 'Paste it at sign-up. You both get XP. Friendship perks unlocked.' },
      { t: 'cta', big: 'Want to see plans *first?*', small: 'We encourage it.', button: 'Stalk @konectrcircle', note: 'Plans. People. Places.' },
    ]},
  ],
};

const CIRCLE = {
  name: 'Konectr Circle', folder: 'Konectr Circle', theme: 'light', handle: '@konectrcircle',
  sections: [
    { key: 'JOM', emoji: '👋', slides: [
      { t: 'title', img: E + 'asian-friends-park.jpg', sub: 'How to join a plan. Five steps. Zero awkward.' },
      { t: 'photo', step: 1, img: H + 'step-1.jpg', big: 'Saw a plan. *Felt a vibe.*', small: "Good. That's step one." },
      { t: 'rsvp', step: 2, big: 'Tap the link. *Drop your name.*', small: 'No app. No 12-page form. 30 seconds, tops.' },
      { t: 'chat', step: 3, big: "Boom. *You're in the chat.*", small: 'Say hi before you meet. Break the ice before it forms.' },
      { t: 'withdraw', step: 4, big: 'Plans *changed?*', small: 'Withdraw early, free the seat. Ghosting is so 2019.' },
      { t: 'photo', step: 5, img: E + 'cafe-friends.jpg', big: 'Now the *hard part.*', small: 'Actually show up. 🧡' },
    ]},
    { key: 'VIBES', emoji: '🎉', slides: [
      { t: 'title', img: H + 'hero.jpg', sub: 'Six flavours of fun. Pick yours.' },
      { t: 'vibegrid', big: 'Pick your *flavour.*', small: 'Six vibes. Zero small talk about the weather.' },
      { t: 'vibe', img: A + 'cafe.jpg', emoji: '☕', name: 'CHILL', small: 'Kopi, deep talk, no rush.' },
      { t: 'vibe', img: E + 'fitness-class.jpg', emoji: '💪', name: 'ACTIVE', small: 'Sweat first. Friends after.' },
      { t: 'vibe', img: A + 'cowork.jpg', emoji: '🎯', name: 'FOCUS', small: 'Laptops open. Loneliness closed.' },
      { t: 'vibe', img: A + 'arts.jpg', emoji: '🎨', name: 'CREATIVE', small: 'Make stuff. Make friends. Make a mess.' },
      { t: 'vibe', img: A + 'nature.jpg', emoji: '⛰️', name: 'ADVENTURE', small: 'Touch grass. Literally.' },
      { t: 'vibe', img: H + 'step-3.jpg', emoji: '🎉', name: 'SOCIAL', small: 'Board games, karaoke, questionable dance moves.' },
    ]},
    { key: 'RULES', emoji: '🤝', slides: [
      { t: 'title', img: A + 'rooftop.jpg', sub: 'The fine print, but make it short.' },
      { t: 'rule', n: '01', big: "Said you'd come? *Come.*", small: 'Your word is the whole deal here.' },
      { t: 'rule', n: '02', big: 'Running late? *Text the crew.*', small: 'KL jam is real. Silence is not.' },
      { t: 'rule', n: '03', big: 'Nobody eats *alone.*', small: 'Pull up a chair for the new face.' },
      { t: 'rule', n: '04', big: 'This is not a *dating app.*', small: 'Slide into the conversation, not the DMs.' },
      { t: 'rule', n: '05', big: 'Something feels *off?*', small: 'Two taps to report. We take it from there.', foot: 'Full safety rundown → @konectr.app' },
    ]},
    { key: 'ASK', emoji: '❓', slides: [
      { t: 'title', img: H + 'step-2.jpg', sub: 'Questions? Good. We\'ve got answers.' },
      { t: 'qa', q: 'Do I need the app?', a: 'Nope. *Tap, RSVP, done.* (The app has perks though. Just saying.)' },
      { t: 'qa', q: 'Is it free?', a: '*Free free.* Your kopi is on you though.' },
      { t: 'qa', q: "I don't know anyone.", a: 'Perfect. Neither did everyone else. *That\'s the point.*' },
      { t: 'qa', q: "I'm an introvert.", a: 'Same. *Small groups* plus an activity to hide behind.' },
      { t: 'qa', q: 'Can I bring a friend?', a: 'Some plans allow +1s. Better idea: *they join too.*' },
      { t: 'qa', q: 'Can I start my own plan?', a: 'Yes! That lives in the app. *Find us at @konectr.app*' },
    ]},
  ],
  threads: [
    { t: 'title', img: E + 'friends-group.jpg', kicker: 'New in KL?', sub: 'Bored of your four walls? Here\'s how to escape this week.', word: 'JOM' },
    { t: 'photo', step: 1, img: H + 'step-1.jpg', big: 'Saw a plan. *Felt a vibe.*', small: "Good. That's step one." },
    { t: 'rsvp', step: 2, big: 'Tap the link. *Drop your name.*', small: 'No app. No 12-page form. 30 seconds, tops.' },
    { t: 'chat', step: 3, big: "Boom. *You're in the chat.*", small: 'Say hi before you meet.' },
    { t: 'withdraw', step: 4, big: 'Plans *changed?*', small: 'Free the seat early. Ghosting is so 2019.' },
    { t: 'photo', step: 5, img: E + 'cafe-friends.jpg', big: 'Now the *hard part.*', small: 'Actually show up. 🧡' },
    { t: 'cta', big: 'New plans land *here.*', small: "Follow so you don't miss the next one.", button: 'Follow @konectrcircle', note: 'Future you says thanks.' },
  ],
};

module.exports = { APP, CIRCLE };
