// Onboarding information taken from the supplied onboarding material
// (previously only available to the AI assistant in server/knowledge.ts).

export const support = [
  {
    name: "Prabhu",
    contact: "+91 9884307031",
    role: "HR",
    note: "Onboarding, joining and HR-related questions.",
  },
  {
    name: "Admin Helpdesk",
    role: "Admin",
    note: "Official email account, initial credentials and workplace help.",
  },
];

export const contacts = [
  {
    name: 'Anneyappa',
    phone: '90350 28788',
    email: 'anneyappa.p@esyasoft.com',
  },
  {
    name: 'Chiranth',
    phone: '95357 27038',
    email: 'chiranth.hegde@esyasoft.com',
  },
  { name: 'Storyfy', phone: '+91 83101 79557' },
  { name: 'Pooja Shetty', phone: '+91 90088 62839' },
];

export const travel = [
  { place: "Mangalore Airport", km: 10 },
  { place: "KSRTC Bus Stand", km: 17 },
  { place: "Mangalore Central Railway Station", km: 20 },
];

export const weekendPlaces = [
  'Pilikula',
  'Surathkal',
  'Tannirbhavi',
  'Kadri',
  'Sri Krishna Temple',
  "St Mary's Island",
  'Kaup',
  'Malpe',
  'Gommateshwara',
  'Chaturmukha Basadi',
  'Anekere',
  'Attur Church',
];

export const facilities = [
  'Air conditioning',
  'Television',
  'Refrigerator',
  'Microwave / oven',
  'Kettle',
  'Induction',
  'Toaster',
  'Washing machine',
  'Geyser',
  'Ironing',
  'Kitchen utensils',
];

export const recreation = [
  'Gymnasium',
  'Table tennis',
  'Foosball',
  'Library',
];

export const packing = [
  'Toiletries',
  'Towels',
  'Personal medicines',
  'Hygiene items',
  'Mosquito repellent',
  'Umbrella',
];

export const arc = [
  { label: 'Weeks 1-2', name: 'Domain', key: 'domain' },
  { label: 'Week 3', name: 'Soft skills', key: 'soft' },
  { label: 'Weeks 4-8', name: 'Technical', key: 'tech' },
  { label: 'Weeks 9-13', name: 'Role-specific', key: 'role' },
];

export function areaKey(area: string) {
  const a = area.toLowerCase();
  if (a.startsWith('domain')) return 'domain';
  if (a.startsWith('soft')) return 'soft';
  if (a.startsWith('technical')) return 'tech';
  return 'role';
}

/* ------------------------------------------------------------------ */
/* What Esyasoft does — the four business heads                        */
/* ------------------------------------------------------------------ */

export const businessHeads = [
  {
    key: 'metering',
    icon: '⚡',
    name: 'Smart Metering',
    tagline: 'Meters that talk back.',
    plain:
      'A normal meter only shows a number that someone walks up and reads once a month. A smart meter reads itself every few minutes and sends the data to the utility automatically.',
    analogy: 'Think of it as a fitness watch for a building\u2019s electricity.',
    flow: ['Meter', 'Network', 'Head-end / MDM', 'Utility & billing'],
    youWillSee: 'Meter data, communication, billing accuracy, dashboards.',
  },
  {
    key: 'ev',
    icon: '🚗',
    name: 'EV Charging',
    tagline: 'Fuel stations for electric cars.',
    plain:
      'Chargers plug electric vehicles into the grid. Software decides who is charging, how fast, how much it costs and whether the charger is healthy.',
    analogy: 'Think of it as a petrol pump that is also a smart, connected computer.',
    flow: ['Driver / App', 'Charger', 'Charge-point software', 'Payment & grid'],
    youWillSee: 'Charger status, sessions, tariffs, remote monitoring.',
  },
  {
    key: 'bess',
    icon: '🔋',
    name: 'Battery / EV (BESS)',
    tagline: 'A big power bank for the grid.',
    plain:
      'BESS means Battery Energy Storage System. It stores extra electricity (for example from solar) and releases it when demand is high or the grid is weak.',
    analogy: 'Think of it as a giant power bank that keeps the lights on at the right time.',
    flow: ['Solar / Grid', 'Battery + inverter', 'Energy management', 'Homes / industry'],
    youWillSee: 'State of charge, charge/discharge cycles, battery health.',
  },
  {
    key: 'gas',
    icon: '🔥',
    name: 'Gas / Utility Solutions',
    tagline: 'Same smart idea, for gas and more.',
    plain:
      'The smart-metering idea also applies to gas (and other utilities). Meters measure usage, send it securely, and the utility can bill accurately and spot leaks or losses sooner.',
    analogy: 'Think of it as a smart meter for the kitchen gas line, not just the power line.',
    flow: ['Gas meter', 'Communication', 'Utility platform', 'Billing & alerts'],
    youWillSee: 'Consumption data, remote reading, alerts, reports.',
  },
];

export const videos = [
  { id: '3JTM2o-1r5E', title: 'Video 1' },
  { id: 'Gdd2IZvesjk', title: 'Video 2' },
];

/* ------------------------------------------------------------------ */
/* Weekend places — rich details                                       */
/* ------------------------------------------------------------------ */

export type Place = {
  name: string;
  // Exact Wikipedia article titles, tried in order. The first one that has a
  // lead photo not already used by another place wins.
  photoTitles: string[];
  // Optional: pin an exact Wikimedia Commons file (name without "File:").
  // Tried first, ahead of photoTitles. Use it when a Wikipedia article title
  // is ambiguous or points at a different place.
  photoFile?: string;
  // Last-resort Wikimedia Commons file search (photos only).
  commonsQuery: string;
  emoji: string;
  zone: 'Mangaluru' | 'Udupi side' | 'Karkala side';
  kind: string;
  why: string;
  tip: string;
};

export const places: Place[] = [
  {
    name: 'Pilikula',
    photoTitles: ['Pilikula Nisargadhama', 'Pilikula'],
    commonsQuery: 'Pilikula Nisargadhama Mangalore',
    emoji: '🦁',
    zone: 'Mangaluru',
    kind: 'Nature park · zoo · science centre',
    why: 'Biological park, lake, botanical garden and a science centre with planetarium. Easy half-day for first-timers.',
    tip: 'Go in the morning; wear comfortable shoes. Check ticket prices and timings before you leave.',
  },
  {
    name: 'Surathkal',
    photoTitles: ['Surathkal Beach', 'Surathkal'],
    commonsQuery: 'Surathkal Beach Mangalore',
    emoji: '🏖️',
    zone: 'Mangaluru',
    kind: 'Beach · lighthouse',
    why: 'A wide beach with a lighthouse, right next to NITK. Calm evening walks and sunsets.',
    tip: 'Swim only where the lifeguards allow. Currents can be strong, especially in monsoon.',
  },
  {
    name: 'Tannirbhavi',
    photoTitles: ['Tannirbhavi Beach', 'Tannirbhavi'],
    commonsQuery: 'Tannirbhavi Beach Mangalore',
    emoji: '🌅',
    zone: 'Mangaluru',
    kind: 'Beach · tree park',
    why: 'A quieter beach with a tree park and a popular sunset spot; boating is often available nearby.',
    tip: 'Best around sunset. Keep valuables safe and follow local safety boards.',
  },
  {
    name: 'Kadri',
    photoTitles: ['Kadri Manjunath Temple', 'Kadri, Mangalore'],
    commonsQuery: 'Kadri Manjunath Temple Mangalore',
    emoji: '🛕',
    zone: 'Mangaluru',
    kind: 'Temple · heritage',
    why: 'Kadri Manjunath Temple is an old temple on a hillside in the city, known for its ancient bronze idols.',
    tip: 'Dress modestly and remove footwear. Check darshan timings, as they vary by day and festival.',
  },
  {
    name: 'Sri Krishna Temple',
    photoTitles: ['Udupi Sri Krishna Matha', 'Krishna Matha'],
    commonsQuery: 'Udupi Sri Krishna Matha',
    emoji: '🙏',
    zone: 'Udupi side',
    kind: 'Temple · food',
    why: 'The Sri Krishna Matha in Udupi is famous for its unique window darshan and Udupi temple meals.',
    tip: 'Assumed to be the Udupi temple. Expect queues on weekends and festivals; dress modestly.',
  },
  {
    name: "St Mary's Island",
    photoTitles: ["St. Mary's Islands", "St. Mary's Island"],
    commonsQuery: "St Mary's Island Malpe",
    emoji: '🏝️',
    zone: 'Udupi side',
    kind: 'Island · rock formations',
    why: 'A small island with striking hexagonal basalt rock columns, reached by ferry from Malpe.',
    tip: 'Ferries usually stop during the monsoon and in rough sea. Confirm before travelling. Carry water and sun protection.',
  },
  {
    name: 'Kaup',
    photoTitles: ['Kaup Beach', 'Kaup Lighthouse', 'Kaup'],
    commonsQuery: 'Kaup lighthouse beach',
    emoji: '🗼',
    zone: 'Udupi side',
    kind: 'Beach · lighthouse',
    why: 'A scenic beach with a historic lighthouse and rocky shore, good for photos at sunset.',
    tip: 'Lighthouse visiting hours are limited. Check timings and be careful on the rocks.',
  },
  {
    name: 'Malpe',
    photoTitles: ['Malpe Beach', 'Malpe'],
    commonsQuery: 'Malpe Beach Udupi',
    emoji: '⛵',
    zone: 'Udupi side',
    kind: 'Beach · harbour · water sports',
    why: 'A busy fishing harbour and beach with water sports; also the departure point for St Mary\u2019s Island.',
    tip: 'Combine with St Mary\u2019s Island and Udupi for one full-day trip.',
  },
  {
    name: 'Gommateshwara',
    photoTitles: ['Gommateshwara statue, Karkala', 'Karkala Gommateshwara', 'Bahubali statue, Karkala'],
    commonsQuery: 'Karkala Gomateshwara statue',
    emoji: '🗿',
    zone: 'Karkala side',
    kind: 'Monolithic statue · Jain heritage',
    why: 'A tall monolithic Bahubali statue on a hill in Karkala, carved in the 15th century.',
    tip: 'Involves climbing steps; go early to avoid the heat and remove footwear at the top.',
  },
  {
    name: 'Chaturmukha Basadi',
    photoTitles: ['Chaturmukha Basadi', 'Chaturmukha Basadi, Karkala'],
    commonsQuery: 'Chaturmukha Basadi Karkala',
    emoji: '🏛️',
    zone: 'Karkala side',
    kind: 'Jain temple · architecture',
    why: 'A symmetrical stone temple with four identical entrances, one of Karkala\u2019s best-known heritage sites.',
    tip: 'Pair it with Gommateshwara and Anekere in the same trip.',
  },
  {
    name: 'Anekere',
    // NOTE: the Wikipedia article "Anekere" is a village in Hassan district,
    // not this lake, so the lake's own Commons photo is pinned instead.
    photoTitles: [],
    photoFile: 'Anekere Lake, Karkala.jpg',
    commonsQuery: 'Anekere Lake Karkala',
    emoji: '🪷',
    zone: 'Karkala side',
    kind: 'Lake · Jain heritage',
    why: 'A calm lake in the Karkala area with old Jain heritage nearby. Peaceful stop between temples.',
    tip: 'Details are limited in the supplied material; confirm location and access on a map before going.',
  },
  {
    name: 'Attur Church',
    photoTitles: ['St. Lawrence Minor Basilica, Attur', 'Attur Church', 'Attur, Karkala'],
    commonsQuery: 'Attur St Lawrence church Karkala',
    emoji: '⛪',
    zone: 'Karkala side',
    kind: 'Church · pilgrimage',
    why: 'St Lawrence Shrine at Attur is a well-known pilgrimage church near Karkala.',
    tip: 'Dress modestly and be quiet during services. Expect big crowds around the annual feast.',
  },
];

export const tripTips = [
  'Group your trips by area: Mangaluru city (Pilikula, Surathkal, Tannirbhavi, Kadri), Udupi side (Sri Krishna Temple, Malpe, St Mary\u2019s, Kaup) and Karkala side (Gommateshwara, Chaturmukha Basadi, Anekere, Attur).',
  'Monsoon (roughly June to September) brings heavy rain and rough seas. Beaches and ferries may be restricted, so carry an umbrella and check first.',
  'Temples and churches expect modest dress. Carry a light shawl or scarf, and keep small change for footwear stands.',
  'Timings, ticket prices and ferry schedules change. Confirm on Google Maps or with the place before you go.',
  'Travel in a group, keep your phone charged and tell a colleague where you are going.',
];

/* ------------------------------------------------------------------ */
/* Senior\u2019s advice                                                      */
/* ------------------------------------------------------------------ */

export const seniorDos = [
  "3/4 BHK accommodation with 2 people per room. Teamwork starts here!",
  "Login time is 9:30 AM. No “5 more minutes” stories.",
  "Breakfast: 7:30–9:30 AM",
  "Lunch: 1:00–2:30 PM",
  "Dinner: 8:00–9:30 PM",
  "Respect everyone: watchmen, housekeeping, staff and roommates.",
  "Keep your space clean. A clean space is a happy space.",
  "Use the gym and recreation facilities and have fun, but use them wisely.",
  "Forgot something? Shops for daily essentials are under 500 mtr away.",
  "Be back by 10 PM. Home sweet home!",
];

export const seniorDonts = [
  "This is a residential area. Please don't disturb the neighbours.",
  "Smoke only in the designated zone.",
  "No drinking inside the accommodation.",
  "Keep the noise down. Not everyone is attending your concert!",
  "Don't waste water, electricity or facilities.",
  "No unauthorized guests.",
];

/* ------------------------------------------------------------------ */
/* EGP vs Normal Trainee (from the Esyasoft Welcome & Onboarding Guide) */
/* ------------------------------------------------------------------ */

export const egpIntro =
  'EGP stands for Engineer Graduate Program, the program you are joining Esyasoft through.';

export const egpComparison = [
  {
    aspect: 'Format',
    normal: 'Short induction, then learning on the job',
    egp: 'About 13-week residential program with your batch',
  },
  {
    aspect: 'Business knowledge',
    normal: 'Usually picked up over time in the team',
    egp: "Two weeks of domain training on Esyasoft's business",
  },
  {
    aspect: 'Training',
    normal: "Often focused on the assigned team's tools",
    egp: 'Domain, soft skills, and technical foundations before your role',
  },
  {
    aspect: 'Role & assessment',
    normal: 'Role aligned to a team from the start',
    egp: 'Role-specific training, a final project, then transition to your team',
  },
];

/* Lateral entry hires (shown below the EGP vs Normal comparison) */
export const lateralTraining = {
  title: 'Training for Lateral Entry Hires',
  text: 'The training plan and schedule for lateral hires will be determined based on business requirements and the specific role/skill requirements.',
};

/* Esyasoft global presence (shown before the four business heads) */
export const globalPresence = {
  title: 'Esyasoft across the globe',
  text: 'Esyasoft is headquartered in the UAE and works with power, gas and water utilities worldwide. It has offices in more than 10 countries, including the UAE, India, the UK, the Netherlands, Romania, Azerbaijan, Indonesia and the USA.',
};

/* Core values (shown below the four business heads) */
export const coreValues = ['People First', 'Delivery Excellence', 'Technology Excellence'];
