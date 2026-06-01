import type { AIEngine, Platform } from "../store/useAppStore";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GenerationOptions {
  engine: AIEngine;
  titleLength: number;
  descriptionLength: number;
  tagCount: number;
  platform: Platform;
  imageFile?: File;
  existingTitle?: string;
  existingDescription?: string;
  existingTags?: string[];
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  subcategory: string;
  seoScore: number;
}

// ─── Platform Rules ──────────────────────────────────────────────────────────

const PLATFORM_RULES: Record<Platform, { maxTitle: number; maxDesc: number; maxTags: number; name: string }> = {
  shutterstock:  { maxTitle: 200, maxDesc: 400, maxTags: 50, name: "Shutterstock" },
  "adobe-stock": { maxTitle: 200, maxDesc: 500, maxTags: 49, name: "Adobe Stock" },
  freepik:       { maxTitle: 150, maxDesc: 300, maxTags: 30, name: "Freepik" },
  istock:        { maxTitle: 200, maxDesc: 500, maxTags: 50, name: "iStock" },
  dreamstime:    { maxTitle: 100, maxDesc: 400, maxTags: 50, name: "Dreamstime" },
  alamy:         { maxTitle: 200, maxDesc: 800, maxTags: 50, name: "Alamy" },
};

// ─── Simulated AI Content Libraries ─────────────────────────────────────────

const TITLE_TEMPLATES = [
  "Professional {adjective} {subject} {action} - Stock {platform} Image",
  "{adjective} {subject} Isolated on {background} Background - {platform} Photo",
  "High-Quality {subject} {action} in Modern {setting} Environment",
  "Creative {adjective} {subject} Design Element for Commercial Use",
  "Stunning {adjective} {subject} Photography - Perfect for {useCase}",
  "Abstract {adjective} {subject} Concept with {element} Details",
  "Minimalist {subject} {action} on Clean {background} - Premium Stock",
  "Vibrant {adjective} {subject} Composition for Digital Marketing",
  "Contemporary {subject} with {element} - Ideal for {useCase}",
  "Dynamic {adjective} {subject} Scene Captured in {setting}",
];

const SUBJECTS = ["business professional", "technology concept", "nature landscape", "urban architecture", "creative workspace", "digital innovation", "lifestyle photography", "abstract geometric", "corporate team", "modern design element", "environmental concept", "artistic composition"];
const ADJECTIVES = ["vibrant", "stunning", "professional", "modern", "elegant", "dynamic", "creative", "minimalist", "contemporary", "abstract", "premium", "high-quality"];
const ACTIONS = ["working", "collaborating", "innovating", "growing", "connecting", "creating", "building", "exploring", "presenting", "designing"];
const BACKGROUNDS = ["white", "dark", "gradient blue", "neutral gray", "clean studio", "bokeh soft"];
const SETTINGS = ["office", "studio", "outdoor", "urban", "natural", "industrial", "futuristic"];
const USE_CASES = ["websites", "presentations", "marketing campaigns", "social media", "branding projects", "print media", "digital advertising"];
const ELEMENTS = ["geometric patterns", "bokeh effects", "depth of field", "light rays", "texture details", "color gradients"];

const DESCRIPTION_TEMPLATES = [
  "High-resolution {subject} stock photo perfect for {useCase}. This professionally captured image features {element} with exceptional detail and clarity. Ideal for commercial projects including {useCaseList}. Shot in {setting} conditions with professional equipment. Compatible with {platform} licensing requirements.",
  "Stunning {adjective} {subject} photography with {element}. Perfect for use in digital marketing, web design, and print media. This versatile stock image delivers premium visual impact for your {useCase} needs. Available in high resolution format suitable for large-scale commercial applications.",
  "Professional stock photography featuring {subject} in a {setting} environment. This carefully composed image showcases {element} with masterful technical execution. Suitable for {useCaseList} and other commercial applications. Optimized for {platform} search discovery with comprehensive metadata.",
  "Creative {adjective} {subject} concept image designed for maximum visual impact. Features professional {element} composition with commercial-grade image quality. Perfect for advertising, marketing collateral, editorial content, and digital media projects. Fully licensed for commercial use.",
  "Eye-catching {subject} stock photo with {element}. This {adjective} image is perfect for brands looking to convey professionalism and modernity. Suitable for {useCaseList}. High-resolution download available with standard and extended licensing options for {platform}.",
];

const TAG_POOLS = {
  business: ["business", "professional", "corporate", "office", "team", "meeting", "success", "leadership", "management", "strategy", "growth", "entrepreneur", "finance", "marketing", "workplace"],
  technology: ["technology", "digital", "innovation", "AI", "software", "computer", "internet", "data", "network", "cyber", "tech", "programming", "algorithm", "cloud", "automation"],
  nature: ["nature", "landscape", "outdoor", "environment", "green", "organic", "natural", "ecology", "sustainability", "wildlife", "scenic", "botanical", "flora", "forest", "sky"],
  creative: ["creative", "design", "artistic", "modern", "abstract", "minimal", "elegant", "aesthetic", "visual", "graphic", "illustration", "color", "pattern", "texture", "composition"],
  lifestyle: ["lifestyle", "people", "person", "woman", "man", "young", "happy", "smile", "healthy", "active", "casual", "urban", "contemporary", "diverse", "authentic"],
  stock: ["stock photo", "royalty free", "commercial use", "high resolution", "isolated", "background", "clipart", "vector", "photography", "image", "concept", "symbol", "icon", "template"],
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSEOTitle(opts: GenerationOptions): string {
  const template = rand(TITLE_TEMPLATES);
  const platformName = PLATFORM_RULES[opts.platform].name;
  let title = template
    .replace("{adjective}", rand(ADJECTIVES))
    .replace("{subject}", rand(SUBJECTS))
    .replace("{action}", rand(ACTIONS))
    .replace("{background}", rand(BACKGROUNDS))
    .replace("{setting}", rand(SETTINGS))
    .replace("{useCase}", rand(USE_CASES))
    .replace("{element}", rand(ELEMENTS))
    .replace("{platform}", platformName);

  if (title.length > opts.titleLength) {
    title = title.substring(0, opts.titleLength - 3) + "...";
  }
  return title;
}

function generateSEODescription(opts: GenerationOptions): string {
  const template = rand(DESCRIPTION_TEMPLATES);
  const platformName = PLATFORM_RULES[opts.platform].name;
  const useCaseList = [rand(USE_CASES), rand(USE_CASES), rand(USE_CASES)].join(", ");

  let desc = template
    .replace(/{adjective}/g, rand(ADJECTIVES))
    .replace(/{subject}/g, rand(SUBJECTS))
    .replace(/{action}/g, rand(ACTIONS))
    .replace(/{setting}/g, rand(SETTINGS))
    .replace(/{useCase}/g, rand(USE_CASES))
    .replace(/{useCaseList}/g, useCaseList)
    .replace(/{element}/g, rand(ELEMENTS))
    .replace(/{platform}/g, platformName);

  if (desc.length > opts.descriptionLength) {
    desc = desc.substring(0, opts.descriptionLength - 3) + "...";
  }
  return desc;
}

function generateSEOTags(opts: GenerationOptions): string[] {
  const allTags = new Set<string>();

  // Pull from all pools
  Object.values(TAG_POOLS).forEach((pool) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    shuffled.slice(0, Math.ceil(opts.tagCount / Object.keys(TAG_POOLS).length) + 2).forEach((t) =>
      allTags.add(t)
    );
  });

  // Add platform-specific tags
  allTags.add(PLATFORM_RULES[opts.platform].name.toLowerCase());
  allTags.add("stock photography");
  allTags.add("royalty free images");
  allTags.add("commercial license");
  allTags.add("high quality");

  return Array.from(allTags).slice(0, opts.tagCount);
}

function detectCategory(_subject: string): { category: string; subcategory: string } {
  const cats = [
    { category: "Business & Finance", subcategory: "Corporate & Office" },
    { category: "Technology", subcategory: "Digital Innovation" },
    { category: "Nature & Environment", subcategory: "Landscapes & Scenery" },
    { category: "People & Lifestyle", subcategory: "Professional Life" },
    { category: "Abstract & Creative", subcategory: "Geometric Designs" },
    { category: "Architecture & Urban", subcategory: "Modern Buildings" },
  ];
  return rand(cats);
}

function calculateSEOScore(title: string, description: string, tags: string[]): number {
  let score = 0;

  // Title score (0-25)
  if (title.length >= 60) score += 15;
  else if (title.length >= 40) score += 10;
  else score += 5;
  if (title.split(" ").length >= 5) score += 10;

  // Description score (0-30)
  if (description.length >= 150) score += 20;
  else if (description.length >= 80) score += 12;
  else score += 5;
  if (description.toLowerCase().includes("stock")) score += 5;
  if (description.toLowerCase().includes("professional")) score += 5;

  // Tags score (0-30)
  if (tags.length >= 40) score += 30;
  else if (tags.length >= 25) score += 20;
  else if (tags.length >= 15) score += 12;
  else score += 5;

  // Keyword density bonus (0-15)
  score += Math.min(15, Math.floor(tags.length / 3));

  return Math.min(100, score);
}

// ─── Main Generation Function ─────────────────────────────────────────────────

export async function generateMetadata(opts: GenerationOptions): Promise<GeneratedMetadata> {
  // Simulate API latency based on engine
  const delays: Record<AIEngine, number> = {
    "gemini-2.5-pro": 2800,
    "gemini-2.5-flash": 1200,
    "gpt-4o": 2400,
    "gpt-5": 3200,
    "grok-4": 2600,
    "grok-fast": 1000,
  };

  await new Promise((resolve) => setTimeout(resolve, delays[opts.engine]));

  const title = generateSEOTitle(opts);
  const description = generateSEODescription(opts);
  const tags = generateSEOTags(opts);
  const { category, subcategory } = detectCategory(rand(SUBJECTS));
  const seoScore = calculateSEOScore(title, description, tags);

  return { title, description, tags, category, subcategory, seoScore };
}

export async function regenerateField(
  field: "title" | "description" | "tags",
  opts: GenerationOptions
): Promise<{ title?: string; description?: string; tags?: string[] }> {
  const shortDelays: Record<AIEngine, number> = {
    "gemini-2.5-pro": 1400,
    "gemini-2.5-flash": 600,
    "gpt-4o": 1200,
    "gpt-5": 1600,
    "grok-4": 1300,
    "grok-fast": 500,
  };

  await new Promise((resolve) => setTimeout(resolve, shortDelays[opts.engine]));

  if (field === "title") return { title: generateSEOTitle(opts) };
  if (field === "description") return { description: generateSEODescription(opts) };
  if (field === "tags") return { tags: generateSEOTags(opts) };

  return {};
}

export { PLATFORM_RULES };
