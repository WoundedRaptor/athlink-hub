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
  skills: { label: "Skills", sub: "Technical growth" },
  strength: { label: "Strength", sub: "Power & speed" },
  recovery: { label: "Recovery", sub: "Physical therapy" },
  gear: { label: "Gear", sub: "Pro fitting" },
  camps: { label: "Camps", sub: "Intensives" },
  facility: { label: "Venues", sub: "Court rental" },
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
    name: "Apex Soccer Academy",
    tagline: "Specialized Speed & Agility",
    description:
      "Small-group technical training led by former collegiate and pro coaches. Player-development plans built around your athlete.",
    sports: ["Club Soccer"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["skills", "strength"],
    services: ["1-on-1 coaching", "Small group sessions", "Speed & agility", "Goalkeeper training"],
    city: "Austin, TX",
    neighborhood: "Barton Creek",
    distanceMi: 1.2,
    rating: 4.9,
    reviews: 142,
    priceRange: "$$",
    phone: "(512) 555-0142",
    email: "hello@apexsoccer.example",
    website: "apexsoccer.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "elite youth soccer training facility interior, warm light",
    imageHue: "from-emerald-200 to-stone-300",
  },
  {
    id: "recoverright-pt",
    name: "RecoverRight Sports PT",
    tagline: "Injury Rehab & Prevention",
    description:
      "Sports-specialized physical therapy and return-to-play programming for youth athletes. In-network with most major insurers.",
    sports: ["Club Soccer", "Travel Baseball", "Lacrosse", "Basketball"],
    ages: ["All"],
    needs: ["recovery"],
    services: ["Injury rehab", "Movement screen", "Return-to-play", "Cupping & soft tissue"],
    city: "Austin, TX",
    neighborhood: "North Loop",
    distanceMi: 3.8,
    rating: 4.8,
    reviews: 87,
    priceRange: "$$",
    phone: "(512) 555-0193",
    email: "intake@recoverright.example",
    website: "recoverright.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "neighborhood physical therapy clinic exterior, calm and clean",
    imageHue: "from-amber-100 to-stone-300",
    detectedAt: "2026-05-16T09:14:00Z",
    confidence: 0.91,
  },
  {
    id: "stryker-gear",
    name: "Stryker Bats & Gear",
    tagline: "Pro Bat Fitting for Travel Ball",
    description:
      "Independent gear shop with certified bat fitters. Stocks club-team approved bats, gloves, cleats, and catcher's gear.",
    sports: ["Travel Baseball"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["gear"],
    services: ["Bat fitting", "Glove relacing", "Cleat sizing", "Trade-in program"],
    city: "Austin, TX",
    neighborhood: "Mueller",
    distanceMi: 2.4,
    rating: 4.7,
    reviews: 56,
    priceRange: "$$",
    phone: "(512) 555-0117",
    email: "shop@strykergear.example",
    website: "strykergear.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "independent baseball gear shop interior with bats and gloves",
    imageHue: "from-amber-200 to-stone-300",
    detectedAt: "2026-05-18T14:02:00Z",
    confidence: 0.96,
  },
  {
    id: "ironkid-strength",
    name: "IronKid Strength Lab",
    tagline: "Strength & Conditioning for Young Athletes",
    description:
      "Age-appropriate strength programming supervised by CSCS-certified coaches. Small ratios, no max-effort lifts before HS.",
    sports: ["Club Soccer", "Basketball", "Football", "Volleyball"],
    ages: ["U12", "U14", "HS"],
    needs: ["strength", "skills"],
    services: ["Group strength class", "1-on-1 coaching", "Speed clinic", "Combine prep"],
    city: "Austin, TX",
    neighborhood: "South Lamar",
    distanceMi: 2.9,
    rating: 4.9,
    reviews: 211,
    priceRange: "$$$",
    phone: "(512) 555-0181",
    email: "train@ironkid.example",
    website: "ironkid.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "modern youth strength training gym with turf lane and racks",
    imageHue: "from-stone-300 to-stone-500",
  },
  {
    id: "elite-swim-hub",
    name: "Elite Swim Hub",
    tagline: "Stroke Mechanics & Race Prep",
    description:
      "USA Swimming–aligned technical coaching with underwater video analysis. Lane time included with every session block.",
    sports: ["Swimming"],
    ages: ["U10", "U12", "U14", "HS"],
    needs: ["skills"],
    services: ["Stroke clinic", "Video analysis", "Race prep", "Open-water training"],
    city: "Austin, TX",
    neighborhood: "Westlake",
    distanceMi: 5.1,
    rating: 4.6,
    reviews: 64,
    priceRange: "$$",
    phone: "(512) 555-0166",
    email: "team@eliteswim.example",
    website: "eliteswim.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "indoor swim center lanes with sun through windows",
    imageHue: "from-sky-200 to-stone-300",
  },
  {
    id: "summer-edge-camps",
    name: "Summer Edge Camps",
    tagline: "Multi-Sport Intensives, June–August",
    description:
      "Two-week skill-focused day camps for soccer, lacrosse, and basketball. Coach-to-athlete ratios kept under 1:8.",
    sports: ["Club Soccer", "Lacrosse", "Basketball"],
    ages: ["U10", "U12", "U14"],
    needs: ["camps", "skills"],
    services: ["Day camps", "Overnight intensives", "Position clinics", "College ID showcases"],
    city: "Austin, TX",
    neighborhood: "Cedar Park",
    distanceMi: 8.7,
    rating: 4.8,
    reviews: 309,
    priceRange: "$$$",
    phone: "(512) 555-0150",
    email: "register@summeredge.example",
    website: "summeredge.example",
    profileStatus: "claimed",
    sourceStatus: "verified",
    imagePrompt: "outdoor youth sports day camp on green field, summer light",
    imageHue: "from-lime-200 to-stone-300",
  },
  {
    id: "fieldhouse-rental",
    name: "Fieldhouse Indoor Courts",
    tagline: "Hourly Court & Turf Rental",
    description:
      "Six full-size hardwood courts and an indoor turf rink. Online booking up to 60 days out, hourly or block pricing.",
    sports: ["Basketball", "Volleyball", "Club Soccer"],
    ages: ["All"],
    needs: ["facility"],
    services: ["Court rental", "Turf rental", "Tournament hosting", "Birthday parties"],
    city: "Austin, TX",
    neighborhood: "Round Rock",
    distanceMi: 11.2,
    rating: 4.5,
    reviews: 178,
    priceRange: "$$",
    phone: "(512) 555-0125",
    email: "book@fieldhouse.example",
    website: "fieldhouse.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "indoor multi-court fieldhouse with hardwood and overhead lighting",
    imageHue: "from-orange-200 to-stone-300",
    detectedAt: "2026-05-12T10:30:00Z",
    confidence: 0.84,
  },
  {
    id: "north-lax-club",
    name: "North Lacrosse Club",
    tagline: "Boys & Girls Travel Lacrosse",
    description:
      "Year-round club program with fall, winter, and summer seasons. College placement support for HS-aged athletes.",
    sports: ["Lacrosse"],
    ages: ["U12", "U14", "HS"],
    needs: ["skills", "camps"],
    services: ["Travel teams", "Skills clinics", "Tournament travel", "College ID nights"],
    city: "Austin, TX",
    neighborhood: "Northwest Hills",
    distanceMi: 4.3,
    rating: 4.7,
    reviews: 96,
    priceRange: "$$$",
    phone: "(512) 555-0134",
    email: "info@northlax.example",
    website: "northlax.example",
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
    name: "Peak Performance Youth Gym",
    tagline: "Detected from Google Maps",
    description: "AI-sourced lead pending admin review.",
    sports: ["Basketball", "Volleyball"],
    ages: ["U12", "U14", "HS"],
    needs: ["strength"],
    services: ["Strength", "Conditioning"],
    city: "Austin, TX",
    neighborhood: "Domain",
    distanceMi: 6.4,
    rating: 0,
    reviews: 0,
    priceRange: "$$",
    phone: "(512) 555-0199",
    email: "n/a",
    website: "peakperformance.example",
    profileStatus: "unclaimed",
    sourceStatus: "ai-discovered",
    imagePrompt: "young athlete strength gym with racks",
    imageHue: "from-amber-100 to-stone-300",
    detectedAt: "2026-05-18T07:45:00Z",
    confidence: 0.78,
  },
  {
    id: "lead-rivertherapy",
    name: "Riverside Sports Therapy",
    tagline: "Detected from Yelp",
    description: "AI-sourced lead pending admin review.",
    sports: ["Swimming", "Tennis"],
    ages: ["All"],
    needs: ["recovery"],
    services: ["PT", "Massage"],
    city: "Austin, TX",
    neighborhood: "Tarrytown",
    distanceMi: 4.9,
    rating: 0,
    reviews: 0,
    priceRange: "$$",
    phone: "(512) 555-0102",
    email: "n/a",
    website: "riversidetherapy.example",
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
