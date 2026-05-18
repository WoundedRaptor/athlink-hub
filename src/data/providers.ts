export type Need =
  | "skills"
  | "strength"
  | "recovery"
  | "gear"
  | "camps"
  | "facility";

export type AgeGroup = "U10" | "U12" | "U14" | "HS" | "All";
export type ProfileStatus = "claimed" | "unclaimed";
export type SourceStatus = "verified" | "ai-discovered" | "user-submitted";

export interface Provider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  sports: string[];
  ages: AgeGroup[];
  needs: Need[];
  services: string[];
  city: string;
  neighborhood: string;
  distanceMi: number;
  rating: number;
  reviews: number;
  priceRange: "$" | "$$" | "$$$";
  phone: string;
  email: string;
  website: string;
  profileStatus: ProfileStatus;
  sourceStatus: SourceStatus;
  imagePrompt: string;
  imageHue: string;
  detectedAt?: string;
  confidence?: number;
}

export const NEED_LABELS: Record<Need, { label: string; sub: string }> = {
  skills: { label: "Improve Skills", sub: "Coaching and skill work" },
  strength: { label: "Build Strength", sub: "Training and conditioning" },
  recovery: { label: "Recover", sub: "Therapy and return-to-play" },
  gear: { label: "Find Gear", sub: "Equipment and fitting" },
  camps: { label: "Join Camps", sub: "Clinics and intensives" },
  facility: { label: "Find Facilities", sub: "Courts, turf, and ice" },
};

export const SPORTS = [
  "Club Soccer",
  "Travel Baseball",
  "Lacrosse",
  "Basketball",
  "Swimming",
  "Volleyball",
  "Tennis",
  "Football",
] as const;

export const AGE_GROUPS: AgeGroup[] = ["U10", "U12", "U14", "HS", "All"];

export const PROVIDERS: Provider[] = [
  {
    id: "apex-soccer",
    name: "Avalon Soccer Coaching",
    tagline: "Technical Coaching for Young Players",
    description:
      "Small-group soccer coaching in St. John’s with technical sessions, goalkeeper work, and development plans built around your athlete.",
    sports: ["Club Soccer"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["skills", "strength"],
    services: ["1-on-1 coaching", "Small group sessions", "Speed & agility", "Goalkeeper training"],
    city: "St. John’s, NL",
    neighborhood: "East End",
    distanceMi: 1.2,
    rating: 4.9,
    reviews: 142,
    priceRange: "$$",
    phone: "(709) 555-0142",
    email: "hello@avalonsoccer.example",
    website: "avalonsoccer.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "elite youth soccer training facility interior, warm light",
    imageHue: "from-emerald-200 to-stone-300",
  },
  {
    id: "recoverright-pt",
    name: "Harbour Recovery & Performance",
    tagline: "Injury Rehab & Prevention",
    description:
      "Sports-focused recovery, mobility, and return-to-play support for youth athletes across Mount Pearl and nearby communities.",
    sports: ["Club Soccer", "Travel Baseball", "Lacrosse", "Basketball"],
    ages: ["All"],
    needs: ["recovery"],
    services: ["Injury rehab", "Movement screen", "Return-to-play", "Cupping & soft tissue"],
    city: "Mount Pearl, NL",
    neighborhood: "Commonwealth Avenue",
    distanceMi: 3.8,
    rating: 4.8,
    reviews: 87,
    priceRange: "$$",
    phone: "(709) 555-0193",
    email: "intake@harbourrecovery.example",
    website: "harbourrecovery.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "neighborhood physical therapy clinic exterior, calm and clean",
    imageHue: "from-amber-100 to-stone-300",
    detectedAt: "2026-05-16T09:14:00Z",
    confidence: 0.91,
  },
  {
    id: "stryker-gear",
    name: "Atlantic Sport Gear Co.",
    tagline: "Team Gear, Skates & Bat Fitting",
    description:
      "Independent gear shop with equipment fitting for hockey, baseball, soccer, and court sports, plus team-order support for families.",
    sports: ["Travel Baseball", "Club Soccer", "Basketball"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["gear"],
    services: ["Equipment fitting", "Team orders", "Cleat sizing", "Trade-in program"],
    city: "Paradise, NL",
    neighborhood: "Kenmount Road",
    distanceMi: 2.4,
    rating: 4.7,
    reviews: 56,
    priceRange: "$$",
    phone: "(709) 555-0117",
    email: "shop@atlanticsportgear.example",
    website: "atlanticsportgear.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "independent baseball gear shop interior with bats and gloves",
    imageHue: "from-amber-200 to-stone-300",
    detectedAt: "2026-05-18T14:02:00Z",
    confidence: 0.96,
  },
  {
    id: "ironkid-strength",
    name: "Coastal Strength Lab",
    tagline: "Strength & Conditioning for Young Athletes",
    description:
      "Age-appropriate strength and conditioning in Conception Bay South with small-group coaching and safe progressions for developing athletes.",
    sports: ["Club Soccer", "Basketball", "Football", "Volleyball"],
    ages: ["U12", "U14", "HS"],
    needs: ["strength", "skills"],
    services: ["Group strength class", "1-on-1 coaching", "Speed clinic", "Combine prep"],
    city: "Conception Bay South, NL",
    neighborhood: "Long Pond",
    distanceMi: 2.9,
    rating: 4.9,
    reviews: 211,
    priceRange: "$$$",
    phone: "(709) 555-0181",
    email: "train@coastalstrength.example",
    website: "coastalstrength.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "modern youth strength training gym with turf lane and racks",
    imageHue: "from-stone-300 to-stone-500",
  },
  {
    id: "elite-swim-hub",
    name: "Torbay Swim Skills",
    tagline: "Stroke Mechanics & Race Prep",
    description:
      "Technical swim coaching with video feedback, lane sessions, and open-water confidence work for young athletes on the northeast Avalon.",
    sports: ["Swimming"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["skills"],
    services: ["Stroke clinic", "Video analysis", "Race prep", "Open-water training"],
    city: "Torbay, NL",
    neighborhood: "Torbay Road",
    distanceMi: 5.1,
    rating: 4.6,
    reviews: 64,
    priceRange: "$$",
    phone: "(709) 555-0166",
    email: "team@torbayswim.example",
    website: "torbayswim.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "indoor swim center lanes with sun through windows",
    imageHue: "from-sky-200 to-stone-300",
  },
  {
    id: "summer-edge-camps",
    name: "Halifax Summer Edge Camps",
    tagline: "Multi-Sport Intensives, June–August",
    description:
      "Skill-focused day camps in Halifax for soccer, lacrosse, and basketball with coach-to-athlete ratios kept under 1:8.",
    sports: ["Club Soccer", "Lacrosse", "Basketball"],
    ages: ["U10", "U12", "U14"],
    needs: ["camps", "skills"],
    services: ["Day camps", "Overnight intensives", "Position clinics", "College ID showcases"],
    city: "Halifax, NS",
    neighborhood: "South End",
    distanceMi: 8.7,
    rating: 4.8,
    reviews: 309,
    priceRange: "$$$",
    phone: "(902) 555-0150",
    email: "register@halifaxsummeredge.example",
    website: "halifaxsummeredge.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "outdoor youth sports day camp on green field, summer light",
    imageHue: "from-lime-200 to-stone-300",
  },
  {
    id: "fieldhouse-rental",
    name: "Dartmouth Fieldhouse",
    tagline: "Hourly Court & Turf Rental",
    description:
      "Indoor courts and turf space in Dartmouth for team practices, private rentals, clinics, and weekend tournaments.",
    sports: ["Basketball", "Volleyball", "Club Soccer"],
    ages: ["All"],
    needs: ["facility"],
    services: ["Court rental", "Turf rental", "Tournament hosting", "Birthday parties"],
    city: "Dartmouth, NS",
    neighborhood: "Burnside",
    distanceMi: 11.2,
    rating: 4.5,
    reviews: 178,
    priceRange: "$$",
    phone: "(902) 555-0125",
    email: "book@dartmouthfieldhouse.example",
    website: "dartmouthfieldhouse.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "indoor multi-court fieldhouse with hardwood and overhead lighting",
    imageHue: "from-orange-200 to-stone-300",
    detectedAt: "2026-05-12T10:30:00Z",
    confidence: 0.84,
  },
  {
    id: "north-lax-club",
    name: "Bedford Lacrosse Club",
    tagline: "Boys & Girls Travel Lacrosse",
    description:
      "Community lacrosse coaching with seasonal clinics, travel-team prep, and camp options for Bedford-area athletes.",
    sports: ["Lacrosse"],
    ages: ["U12", "U14", "HS"],
    needs: ["skills", "camps"],
    services: ["Travel teams", "Skills clinics", "Tournament travel", "College ID nights"],
    city: "Bedford, NS",
    neighborhood: "Larry Uteck",
    distanceMi: 4.3,
    rating: 4.7,
    reviews: 96,
    priceRange: "$$$",
    phone: "(902) 555-0134",
    email: "info@bedfordlax.example",
    website: "bedfordlax.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "youth lacrosse practice on open field at golden hour",
    imageHue: "from-emerald-100 to-stone-300",
  },
];

export const ADMIN_LEADS: Provider[] = PROVIDERS.filter(
  (p) => p.sourceStatus === "ai-discovered",
).concat([
  {
    id: "lead-peakperformance",
    name: "Truro Performance Youth Gym",
    tagline: "Detected from Google Maps",
    description: "AI-sourced lead pending admin review.",
    sports: ["Basketball", "Volleyball"],
    ages: ["U12", "U14", "HS"],
    needs: ["strength"],
    services: ["Strength", "Conditioning"],
    city: "Truro, NS",
    neighborhood: "Robie Street",
    distanceMi: 6.4,
    rating: 0,
    reviews: 0,
    priceRange: "$$",
    phone: "(902) 555-0199",
    email: "n/a",
    website: "truroperformance.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "young athlete strength gym with racks",
    imageHue: "from-amber-100 to-stone-300",
    detectedAt: "2026-05-18T07:45:00Z",
    confidence: 0.78,
  },
  {
    id: "lead-rivertherapy",
    name: "Paradise Sports Therapy",
    tagline: "Detected from Yelp",
    description: "AI-sourced lead pending admin review.",
    sports: ["Swimming", "Tennis"],
    ages: ["All"],
    needs: ["recovery"],
    services: ["PT", "Massage"],
    city: "Paradise, NL",
    neighborhood: "Topsail Road",
    distanceMi: 4.9,
    rating: 0,
    reviews: 0,
    priceRange: "$$",
    phone: "(709) 555-0102",
    email: "n/a",
    website: "paradisetherapy.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "calm sports therapy clinic with treatment tables",
    imageHue: "from-sky-100 to-stone-300",
    detectedAt: "2026-05-17T16:21:00Z",
    confidence: 0.67,
  },
]);

export function getProvider(id: string): Provider | undefined {
  return [...PROVIDERS, ...ADMIN_LEADS].find((p) => p.id === id);
}
