// Illustrative personas for the Tata Neu case. Fictional people; real colleges used only for context.
// To use a photo instead of the drawn portrait, add `photo: importedImage` to a member.
// Everything the app shows (squad, expenses, quest, jar, week script) is read from here.

export const CATS = {
  food: { label: "Food", color: "#F5B700", icon: "cart" },
  travel: { label: "Travel", color: "#00A99D", icon: "plane" },
  study: { label: "Study", color: "#9B5DE5", icon: "receipt" },
  fun: { label: "Fun", color: "#E4007C", icon: "spark" },
};

export const UNIVERSAL = {
  coinsStart: 248,
  splitCoinCap: 20,
  nudgeCap: 3,
};

/* ------------------------------------------------------------------ */
/* Persona 1 · Rohan Verma · hosteller in a tier-2 campus              */
/* ------------------------------------------------------------------ */

const rohan = {
  id: "rohan",
  me: "rohan",
  label: "Persona 1 · Hosteller",
  members: {
    rohan: {
      id: "rohan", name: "Rohan", full: "Rohan Verma", color: "#5B1FA8", vpa: "rohan.verma@neuupi",
      line: "B.Tech ECE · from Kanpur",
      look: { skin: "#B97A50", hair: "#1c1410", style: "short", top: "#3b2a78", collar: "hoodie", bg: "#E9DDFB" },
    },
    kabir: {
      id: "kabir", name: "Kabir", full: "Kabir Sethi", color: "#00A99D", vpa: "kabir.sethi@neuupi",
      line: "B.Tech ECE · from Ludhiana",
      look: { skin: "#D29B6E", hair: "#20140c", style: "side", top: "#0f766e", collar: "tee", beard: true, bg: "#D7F3EF" },
    },
    aditi: {
      id: "aditi", name: "Aditi", full: "Aditi Rao", color: "#E4007C", vpa: "aditi.rao@neuupi",
      line: "B.Tech ECE · from Hyderabad",
      look: { skin: "#9A6440", hair: "#120c08", style: "long", top: "#be185d", collar: "kurta", earrings: true, glasses: true, bg: "#FCE1EF" },
    },
    sneha: {
      id: "sneha", name: "Sneha", full: "Sneha Patil", color: "#F5B700", vpa: "sneha.patil@neuupi",
      line: "B.Tech Civil · from Pune",
      look: { skin: "#C98B5E", hair: "#2a1a10", style: "braid", top: "#b45309", collar: "kurta", bindi: true, bg: "#FFF1C7" },
    },
  },
  squad: {
    name: "Canteen Committee",
    college: "NIT Hamirpur",
    campusLine: "Boys Hostel 4, Room 214 · NIT Hamirpur",
    squadsOnCampus: 18,
    whatsapp: "Canteen Committee",
    inviteBy: "aditi",
    chat: [
      { by: "kabir", text: "Who paid for last night's Maggi? Not me this time", time: "20:12" },
      { by: "aditi", text: "Okay I'm done with the notes-app hisaab. Joining this", time: "20:14" },
    ],
    myReply: "haha fine, joining",
  },
  quest: {
    title: "Food cap: ₹1,500 per person",
    label: "Food cap",
    cats: ["food"],
    cap: 1500,
    soloTracked: 480,
    reward: 20,
    basis: "The squad averaged ₹1,640 per person on food (mess extras, canteen, tapri, late-night orders) over the last 4 weeks. The quest sets the cap at about 90% of that.",
    others: { kabir: 1410, aditi: 1320, sneha: 980 },
    next: "Settle every split within 24 hours",
    nextBasis: "Built from this week: 5 of 6 splits settled on time",
  },
  leaderboard: [
    { name: "BH-2 Night Owls", xp: 2140 },
    { name: "Canteen Committee", xp: 1980, me: true },
    { name: "Robotics Club Crew", xp: 1755 },
    { name: "Mech Batch '27", xp: 1610 },
  ],
  scorecard: { rank: 2, date: "Sunday, 11 October" },
  jar: {
    name: "Goa after end-sems",
    short: "Goa",
    target: 24000,
    before: { rohan: 3960, kabir: 3360, aditi: 3660, sneha: 2940 },
    after: { rohan: 4200, kabir: 3600, aditi: 3900, sneha: 3180 },
    coinsBefore: 300,
    coinsAfter: 312,
    autosave: 240,
    personal: { name: "Diwali flight home to Kanpur", pct: 38 },
  },
  unlocks: [
    { brand: "Air India Express", what: "Chandigarh to Goa, 4 seats", note: "Fare alert on", icon: "plane" },
    { brand: "IHCL Ginger", what: "2 nights, Panaji", note: "Squad room rate", icon: "bed" },
    { brand: "Croma", what: "Speaker for Room 214", note: "If the trip slips", icon: "speaker" },
  ],
  poll: {
    by: "sneha",
    q: "Fest night look under ₹1,500?",
    options: [
      { id: "a", label: "Kurta set + white sneakers", src: "Tata CLiQ", votes: 1 },
      { id: "b", label: "Denim jacket look", src: "Westside", votes: 1 },
      { id: "c", label: "Printed co-ord set", src: "Tata CLiQ", votes: 0 },
    ],
    vote: "b",
  },
  badgesStart: ["Fast Settlers"],
  badgesAfter: ["Fast Settlers", "Early Birds"],
  defaultClock: { day: "Fri", time: "18:42" },
  // Expenses logged before the week's first beat
  expensesStart: [
    { id: "NSQ-4811", title: "Xerox of DSP notes", amount: 40, paidBy: "rohan", among: ["rohan", "sneha"], cat: "study", day: "Mon", time: "15:20" },
    { id: "NSQ-4812", title: "Chai & Maggi at the tapri", amount: 260, paidBy: "rohan", among: ["rohan", "kabir"], cat: "food", day: "Mon", time: "17:05" },
  ],
  exp: {
    mon: { id: "NSQ-4815", title: "Canteen dinner", amount: 960, paidBy: "aditi", among: ["rohan", "kabir", "aditi", "sneha"], cat: "food" },
    wed: { id: "NSQ-4818", title: "Late-night food order", amount: 1240, paidBy: "kabir", among: ["rohan", "kabir", "aditi", "sneha"], cat: "food" },
    fri: { id: "NSQ-4821", title: "Cab to Una station", amount: 600, paidBy: "rohan", among: ["rohan", "aditi", "sneha"], cat: "travel" },
  },
  steps: [
    { key: "mon", day: "Mon", time: "21:40", moment: "Canteen dinner, ₹960", trigger: "Aditi splits the bill", action: "1-tap settle via Neu UPI", reward: "+2 NeuCoins", tata: "Neu UPI", layer: "S" },
    { key: "wed", day: "Wed", time: "23:10", moment: "Late-night food order", trigger: "Quest nudge: ₹340 left", action: "Check the food cap", reward: "Quest progress", tata: "BigBasket essentials, only if relevant", layer: "Q" },
    { key: "fri", day: "Fri", time: "18:30", moment: "Cab to Una station", trigger: "Rohan logs the cab", action: "Split ₹600 three ways", reward: "Goa jar reaches 62%", tata: "Air India Express fare alert", layer: "U" },
    { key: "sat", day: "Sat", time: "15:00", moment: "Fest shopping", trigger: "Sneha starts a poll", action: "Vote on the look", reward: "Style Squad badge", tata: "Tata CLiQ and Westside picks", layer: "D" },
    { key: "sun", day: "Sun", time: "09:00", moment: "Weekly reset", trigger: "Sunday Scorecard", action: "See rank, start next quest", reward: "+20 NeuCoins, streak 7", tata: "Next week preview", layer: "A" },
  ],
  profile: {
    archetype: "The hostel hisaab-keeper",
    age: 20,
    course: "B.Tech ECE, 3rd year",
    college: "NIT Hamirpur, Himachal Pradesh",
    lives: "Boys Hostel 4, Room 214 · from Kanpur, UP",
    money: "₹7,500 / month",
    moneySplit: "₹6,000 from parents over UPI + ₹1,500 from online tutoring",
    spend: [
      { k: "Mess extras & food", v: 45, c: "#F5B700" },
      { k: "Outings", v: 20, c: "#E4007C" },
      { k: "Travel", v: 15, c: "#00A99D" },
      { k: "Recharge & OTT", v: 10, c: "#9B5DE5" },
      { k: "Savings", v: 10, c: "#5B1FA8" },
    ],
    apps: ["Instagram", "WhatsApp", "PhonePe", "YouTube", "Zomato"],
    neuToday: "2 opens in 6 months: Croma earbuds in a sale, an Air India Express flight home for Diwali",
    pains: [
      "Tracks dues in a WhatsApp chat and a notes app. About ₹1,100 is stuck with friends right now.",
      "NeuCoins on a ₹300 order feel like nothing, so they never pull him back.",
      "Runs short of money by the 20th of every month.",
    ],
    goals: [
      "Goa trip with the squad after end-sems",
      "Fly home for Diwali without asking his parents",
    ],
    quote: "Bhai, ₹240 ka hisaab rakhna DSA se zyada mushkil hai.",
    quoteEn: "Keeping track of ₹240 is harder than DSA.",
    fit: ["Split", "Goal Jar"],
    week: "Mon, Wed, Fri, Sat, Sun",
  },
};

/* ------------------------------------------------------------------ */
/* Persona 2 · Ananya Iyer · day scholar in a metro                    */
/* ------------------------------------------------------------------ */

const ananya = {
  id: "ananya",
  me: "ananya",
  label: "Persona 2 · Day scholar",
  members: {
    ananya: {
      id: "ananya", name: "Ananya", full: "Ananya Iyer", color: "#7C3AED", vpa: "ananya.iyer@neuupi",
      line: "B.Com (Hons) · Mayur Vihar",
      look: { skin: "#A8704A", hair: "#100a07", style: "bun", top: "#6d28d9", collar: "kurta", bindi: true, earrings: true, bg: "#EDE3FF" },
    },
    ishaan: {
      id: "ishaan", name: "Ishaan", full: "Ishaan Mehta", color: "#0EA5E9", vpa: "ishaan.mehta@neuupi",
      line: "B.Com (Hons) · from Gurugram",
      look: { skin: "#D9A57A", hair: "#2b1d14", style: "curly", top: "#0369a1", collar: "shirt", glasses: true, bg: "#DDF1FB" },
    },
    meher: {
      id: "meher", name: "Meher", full: "Meher Kaur", color: "#E4007C", vpa: "meher.kaur@neuupi",
      line: "Eco (Hons) · PG in Hudson Lane",
      look: { skin: "#C88E62", hair: "#1a110b", style: "long", top: "#db2777", collar: "tee", earrings: true, bg: "#FCE1EF" },
    },
    zoya: {
      id: "zoya", name: "Zoya", full: "Zoya Khan", color: "#00A99D", vpa: "zoya.khan@neuupi",
      line: "B.Com (Hons) · from Old Delhi",
      look: { skin: "#B47A52", hair: "#1a110b", style: "hijab", scarf: "#0f766e", top: "#115e59", collar: "kurta", bg: "#D7F3EF" },
    },
  },
  squad: {
    name: "Kamla Nagar Café Club",
    college: "SRCC, Delhi University",
    campusLine: "Mayur Vihar, Delhi · SRCC, North Campus",
    squadsOnCampus: 24,
    whatsapp: "Café Club",
    inviteBy: "meher",
    chat: [
      { by: "zoya", text: "Jaipur plan is dying in this chat again", time: "19:02" },
      { by: "meher", text: "Putting it on NeuSquad. Jar, splits, everything in one place", time: "19:05" },
    ],
    myReply: "okay okay, I'm in",
  },
  quest: {
    title: "Café cap: ₹1,200 per person",
    label: "Café cap",
    cats: ["food"],
    cap: 1200,
    soloTracked: 420,
    reward: 20,
    basis: "The squad averaged ₹1,330 per person on cafés and street food around North Campus over the last 4 weeks. The quest sets the cap at about 90% of that.",
    others: { ishaan: 1080, meher: 1150, zoya: 760 },
    next: "Two no-café days this week",
    nextBasis: "Built from this week: 3 café visits ran over ₹300",
  },
  leaderboard: [
    { name: "Eco Hons Back Benchers", xp: 2410 },
    { name: "Enactus Night Shift", xp: 2290 },
    { name: "Kamla Nagar Café Club", xp: 2120, me: true },
    { name: "Placement Cell Crew", xp: 1940 },
  ],
  scorecard: { rank: 3, date: "Sunday, 11 October" },
  jar: {
    name: "Jaipur in winter break",
    short: "Jaipur",
    target: 16000,
    before: { ananya: 2300, ishaan: 2100, meher: 1900, zoya: 1700 },
    after: { ananya: 2500, ishaan: 2300, meher: 2100, zoya: 1900 },
    coinsBefore: 196,
    coinsAfter: 210,
    autosave: 200,
    personal: { name: "Earbuds for the Metro commute", pct: 46 },
  },
  unlocks: [
    { brand: "IHCL Ginger", what: "2 nights, Jaipur", note: "Squad room rate", icon: "bed" },
    { brand: "Air India Express", what: "Delhi to Jaipur, 4 seats", note: "Fare alert on", icon: "plane" },
    { brand: "Tata CLiQ", what: "Trip outfits under ₹1,500", note: "Squad picks", icon: "shirt" },
  ],
  poll: {
    by: "zoya",
    q: "Ethnic day look under ₹1,500?",
    options: [
      { id: "a", label: "Chikankari kurta set", src: "Tata CLiQ", votes: 1 },
      { id: "b", label: "Block-print co-ord", src: "Westside", votes: 1 },
      { id: "c", label: "Saree drape + jhumkas", src: "Tata CLiQ", votes: 0 },
    ],
    vote: "a",
  },
  badgesStart: ["Plan Makers"],
  badgesAfter: ["Plan Makers", "Fast Settlers"],
  defaultClock: { day: "Fri", time: "17:58" },
  expensesStart: [
    { id: "NSQ-5101", title: "Momos near Arts Faculty", amount: 320, paidBy: "ananya", among: ["ananya", "ishaan", "meher", "zoya"], cat: "food", day: "Mon", time: "14:10" },
  ],
  exp: {
    mon: { id: "NSQ-5104", title: "Café in Kamla Nagar", amount: 1180, paidBy: "meher", among: ["ananya", "ishaan", "meher", "zoya"], cat: "food" },
    wed: { id: "NSQ-5107", title: "Cold coffee after society meet", amount: 720, paidBy: "ishaan", among: ["ananya", "ishaan", "meher", "zoya"], cat: "food" },
    fri: { id: "NSQ-5110", title: "Fest stall supplies", amount: 600, paidBy: "ananya", among: ["ananya", "meher", "zoya"], cat: "fun" },
  },
  steps: [
    { key: "mon", day: "Mon", time: "20:30", moment: "Café in Kamla Nagar, ₹1,180", trigger: "Meher splits the bill", action: "Settle ₹215 after netting", reward: "+2 NeuCoins", tata: "Neu UPI", layer: "S" },
    { key: "wed", day: "Wed", time: "18:20", moment: "Cold coffee after society meet", trigger: "Quest nudge: ₹225 left", action: "Check the café cap", reward: "Quest progress", tata: "BigBasket snacks for the stall, only if relevant", layer: "Q" },
    { key: "fri", day: "Fri", time: "17:45", moment: "Fest stall supplies", trigger: "Ananya logs ₹600", action: "Split three ways", reward: "Jaipur jar reaches 55%", tata: "IHCL Ginger Jaipur rate alert", layer: "U" },
    { key: "sat", day: "Sat", time: "13:00", moment: "Ethnic day shopping", trigger: "Zoya starts a poll", action: "Vote on the look", reward: "Style Squad badge", tata: "Tata CLiQ and Westside picks", layer: "D" },
    { key: "sun", day: "Sun", time: "10:00", moment: "Weekly reset", trigger: "Sunday Scorecard", action: "See rank, start next quest", reward: "+20 NeuCoins, streak 5", tata: "Next week preview", layer: "A" },
  ],
  profile: {
    archetype: "The plan-maker day scholar",
    age: 19,
    course: "B.Com (Hons), 2nd year",
    college: "Shri Ram College of Commerce, University of Delhi",
    lives: "With family in Mayur Vihar, East Delhi · 50-min Metro commute",
    money: "₹6,500 / month",
    moneySplit: "₹4,000 pocket money + ₹2,500 from social-media freelancing",
    spend: [
      { k: "Cafés & street food", v: 40, c: "#F5B700" },
      { k: "Shopping", v: 25, c: "#E4007C" },
      { k: "Metro & autos", v: 15, c: "#00A99D" },
      { k: "Phone & subscriptions", v: 10, c: "#9B5DE5" },
      { k: "Savings", v: 10, c: "#5B1FA8" },
    ],
    apps: ["Instagram", "Pinterest", "Blinkit", "Myntra", "Google Pay"],
    neuToday: "1 open in 4 months: a BigBasket order her mother asked for",
    pains: [
      "Group plans die in the WhatsApp chat. Jaipur has been 'next month' since July.",
      "Kamla Nagar cafés use up her pocket money by the 15th.",
      "Myntra and Blinkit feel faster, so she has no reason to open Neu.",
    ],
    goals: [
      "Jaipur trip with her college friends in winter break",
      "Earbuds for the Metro commute from her own savings",
    ],
    quote: "Kamla Nagar ke cafés 15 tareekh tak pocket money khatam kar dete hain.",
    quoteEn: "Kamla Nagar's cafés finish my pocket money by the 15th.",
    fit: ["Quest", "Discover"],
    week: "Mon, Wed, Fri, Sat, Sun",
  },
};

export const PERSONAS = { rohan, ananya };
export const PERSONA_ORDER = ["rohan", "ananya"];

export const LAYERS = [
  { k: "S", name: "Split", line: "Shared squad wallet, settle in one tap", color: "var(--teal)" },
  { k: "Q", name: "Quest", line: "Weekly challenge built from squad spending", color: "var(--gold)" },
  { k: "U", name: "Unlock", line: "Squad goal jar for a trip or a buy", color: "var(--violet)" },
  { k: "A", name: "Accumulate", line: "Capped NeuCoins for settling and quests", color: "var(--violet)" },
  { k: "D", name: "Discover", line: "Tata brands at the moment of need", color: "var(--magenta)" },
];

export const HOOK = [
  { k: "trigger", label: "Trigger", sub: "A friend logs a split" },
  { k: "action", label: "Action", sub: "Settle in under 10 sec" },
  { k: "reward", label: "Reward", sub: "Quest result, squad rank" },
  { k: "investment", label: "Investment", sub: "Coins in the jar" },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
