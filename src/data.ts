/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, BlogArticle, BeautyTip, Review } from "./types";

export const BRAND_PARTNERS = [
  { name: "Dior", logo: "DIOR" },
  { name: "Chanel", logo: "CHANEL" },
  { name: "Guerlain", logo: "GUERLAIN" },
  { name: "YSL Beauty", logo: "YSL" },
  { name: "Estée Lauder", logo: "ESTÉE LAUDER" },
  { name: "Charlotte Tilbury", logo: "Charlotte Tilbury" }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    name: "La Rose Céleste Revitalizing Elixir Serum",
    brand: "AURA LUXE",
    category: "Skincare",
    subcategory: "Serum",
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 148,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600",
    description: "An extraordinary regenerative face serum enriched with botanical white rose cells and micro-infused multi-peptides to deliver deep hydration, immediate radiance, and long-term lifting properties.",
    ingredients: ["Rosa Damascena Flower Water", "Niacinamide (Vitamin B3)", "Sodium Hyaluronate (Hyaluronic Acid)", "Palmitoyl Tripeptide-5", "Squalane", "Glycerin", "Centella Asiatica Extract"],
    howToUse: "Apply 3-4 drops morning and evening onto cleansed face and neck. Massage gently in upward circular motions before applying your custom Aura moisturizing cream.",
    benefits: [
      "Visibly reduces fine lines and smooths skin texture",
      "Restores cellular moisture barrier for 48-hour hydration",
      "Illuminates lackluster skin with an immediate celestial satin glow",
      "Boosts collagen production and enhances facial contours"
    ],
    sizes: ["30ml", "50ml"],
    skinType: ["All", "Dry", "Sensitive", "Combination"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: true,
    isBestSeller: true,
    isNewArrival: false,
    stock: 45
  },
  {
    id: "prod-02",
    name: "Satin Velvet Radiant Matte Lipstick",
    brand: "DIOR BEAUTY",
    category: "Makeup",
    subcategory: "Lipstick",
    price: 48,
    rating: 4.8,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    description: "An iconic rich matte couture lipstick that hydrates like a balm while delivering hyper-pigmented, transfer-proof luxury red and nude shades for up to 16 hours of comfort.",
    ingredients: ["Macadamia Ternifolia Seed Oil", "Candelilla Cera", "Titanium Dioxide", "Shea Butter Extract", "Tocopherol (Vitamin E)", "Damask Rose Flower Wax"],
    howToUse: "Define lips with Aura precision lip pencil, then glide Satin Velvet lipstick starting from the cupid's bow outwards to achieve maximum editorial definition.",
    benefits: [
      "Ultra-pigmented formula with a modern featherlight soft-focus matte finish",
      "Enriched with nourishing pomegranate flower extract for deep hydration",
      "No feathering, bleeding, or drying out of delicate lips",
      "Includes an embossed luxury rose gold casing with magnetic closure"
    ],
    colors: [
      { name: "Couture Red 999", hex: "#b5111b" },
      { name: "Velvet Rose", hex: "#d17d87" },
      { name: "Sienna Nude", hex: "#aa6c5b" },
      { name: "Bordeaux Nights", hex: "#630e1f" }
    ],
    skinType: ["All"],
    isCrueltyFree: true,
    isVegan: false,
    isOrganic: false,
    isBestSeller: true,
    isNewArrival: false,
    stock: 90
  },
  {
    id: "prod-03",
    name: "Or Blanc Absolute Skin-Defense Cream",
    brand: "AURA LUXE",
    category: "Skincare",
    subcategory: "Moisturizer",
    price: 240,
    originalPrice: 285,
    rating: 5.0,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    description: "The crown jewel of moisturizers. Infused with 24k colloidal gold particles and rare botanical extracts, it stimulates cell respiration, reduces signs of skin fatigue, and shields against micro-pollutants.",
    ingredients: ["Colloidal Gold", "Camellia Japonica Seed Oil", "Ceramide NP", "Resveratrol", "Adenosine", "Shea Butter", "Algae Extract"],
    howToUse: "Warm a pea-sized amount between clean fingertips to activate the gold micro-infusions, then sweep over face, jawline, and collarbone in smooth upward motions.",
    benefits: [
      "Infuses genuine 24k gold for unprecedented light refraction and tone evening",
      "Accelerates natural cellular repair and skin barrier fortification",
      "Firms skin sag with instant tightening action on the jaw and cheeks",
      "Breathtaking organic botanical scent for an elevated sensory experience"
    ],
    sizes: ["50ml"],
    skinType: ["Dry", "Sensitive", "Combination"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: true,
    isBestSeller: false,
    isNewArrival: true,
    stock: 22
  },
  {
    id: "prod-04",
    name: "L'Ambre Impérial Eau De Parfum",
    brand: "CHANEL BEAUTY",
    category: "Fragrance",
    subcategory: "Eau de Parfum",
    price: 210,
    rating: 4.9,
    reviewsCount: 196,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600",
    description: "An sensual, mysterious scent weaving Warm Amber, Velvet Jasmine, and Smoked Madagascan Vanilla. A truly intoxicating editorial scent designed for the modern sovereign woman.",
    ingredients: ["Alcohol Denat", "Parfum (Fragrance)", "Aqua (Water)", "Limonene", "Linalool", "Benzyl Salicylate", "Coumarin"],
    howToUse: "Spray on pulse points including wrists, behind the ears, base of the neck, and inner elbows to let the fragrance evolve warmly with your natural chemistry.",
    benefits: [
      "Extremely long-lasting Eau de Parfum concentration (18% essential oils)",
      "Layered olfactory architecture: Fresh Mandarin top, Floral Jasmine heart, Amber-Vanilla base",
      "Individually numbered minimalist heavy crystal bottle",
      "Hypoallergenic synthetic stabilizers used to avoid skin sensitivities"
    ],
    sizes: ["50ml", "100ml"],
    skinType: ["All"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: false,
    isBestSeller: true,
    isNewArrival: false,
    stock: 30
  },
  {
    id: "prod-05",
    name: "Silk-Thread Illuminating Skin Tint SPF 30",
    brand: "AURA LUXE",
    category: "Makeup",
    subcategory: "Foundation",
    price: 64,
    rating: 4.7,
    reviewsCount: 224,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    description: "A breathable, skin-blurring liquid silk tint infused with mineral SPF 30, Hyaluronic Acid, and light-reflecting pigments that mimics your real skin with a dewier, unified finish.",
    ingredients: ["Zinc Oxide (12%)", "Titanium Dioxide (4%)", "Hydrolyzed Silk Protein", "Sodium Hyaluronate", "White Tea Leaf Extract", "Jojoba Esters"],
    howToUse: "Shake well. Blend 2-3 drops directly with fingertips or a damp Aura beauty sponge into clean skin for an effortlessly flawless, natural glow.",
    benefits: [
      "Physical broad-spectrum sun defense without any chalky white cast",
      "Ultra-lightweight formula that does not settle into fine lines or pores",
      "Adapts organically to undertones with customizable light coverage",
      "Infused with antioxidant tea extracts to combat blue-light stress"
    ],
    colors: [
      { name: "Alabaster Aura (Fair Cool)", hex: "#f8e1d2" },
      { name: "Satin Sand (Light Neutral)", hex: "#ecc9b2" },
      { name: "Golden Honey (Medium Warm)", hex: "#dbaf8f" },
      { name: "Sienna Bronze (Deep Neutral)", hex: "#9d6f4f" }
    ],
    spf: "SPF 30",
    skinType: ["All", "Sensitive", "Oily", "Dry", "Combination"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: false,
    isBestSeller: false,
    isNewArrival: true,
    stock: 55
  },
  {
    id: "prod-06",
    name: "Sacred Hibiscus Deep Hydration Hair Mask",
    brand: "AURA LUXE",
    category: "Haircare",
    subcategory: "Shampoo", // Stored for subcategory matching
    price: 78,
    originalPrice: 95,
    rating: 4.8,
    reviewsCount: 104,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600",
    description: "A luxury botanical butter mask infused with sacred hibiscus nectar and cold-pressed marula oil. Deeply reconstructs damaged hair fibers, tames frizz, and leaves hair with high-gloss mirror shine.",
    ingredients: ["Hibiscus Rosa-Sinensis Flower Extract", "Sclerocarya Birrea (Marula) Seed Oil", "Hydrolyzed Keratin", "Panthenol (Vitamin B5)", "Argan Kernel Oil"],
    howToUse: "After shampooing, scoop a generous amount and coat damp hair from mid-lengths to ends. Leave on for 5-10 minutes, then rinse thoroughly with cool water to lock in gloss.",
    benefits: [
      "Repairs split ends and heat damage from the very first application",
      "Infuses hair cuticle with essential lipids, weightlessly restoring bounce",
      "Prevents color fading with integrated botanical UV protective barriers",
      "Leaves hair with an addictive scent of wild rose and tropical nectar"
    ],
    sizes: ["200ml", "500ml"],
    skinType: ["All"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: true,
    isBestSeller: false,
    isNewArrival: false,
    isFlashSale: true,
    flashSalePrice: 59,
    stock: 18
  },
  {
    id: "prod-07",
    name: "Jade Gua Sha Sculpting Facial Tool",
    brand: "AURA LUXE",
    category: "Beauty Tools",
    subcategory: "Wellness",
    price: 35,
    rating: 4.9,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    description: "Hand-carved from genuine grade-A nephrite jade, this holistic tool aids lymphatic drainage, sculpts jawline and cheekbone contours, and promotes local circulation to amplify skincare absorption.",
    ingredients: ["100% Nephrite Jade Stone"],
    howToUse: "Prep face with Aura Elixir face oil. Holding the Gua Sha tool flat against skin, glide in an upward and outward motion from the chin to earlobe, eyebrow to hairline.",
    benefits: [
      "Naturally cool surface instantly de-puffs under-eyes and reduces facial tension",
      "Helps stimulate drainage of metabolic fluid build-up for sculpted contours",
      "Fosters an organic collagen-producing environment via mild micro-massage",
      "Handcrafted with unique crystal veins so no two Gua Shas are identical"
    ],
    skinType: ["All"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: true,
    isBestSeller: true,
    isNewArrival: false,
    stock: 150
  },
  {
    id: "prod-08",
    name: "Rose de Mai Hydrating Body Balm",
    brand: "GUESLAIN BEAUTY", // Custom premium brand
    category: "Bodycare",
    subcategory: "Lotion",
    price: 110,
    rating: 4.6,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600",
    description: "A rich, whipped moisturizing butter crafted from May Roses harvested by hand in Grasse. It liquefies on touch, delivering intense vitamins to dry skin, leaving behind a shimmering velvet trace.",
    ingredients: ["Rosa Centifolia (Grasse Rose) Extract", "Mango Seed Butter", "Sweet Almond Oil", "Vitamin E Acetate", "Grape Seed Extract"],
    howToUse: "Massage thoroughly onto warm, slightly damp skin right after your shower or bath. Pay extra attention to elbows, knees, and décolletage.",
    benefits: [
      "Provides deep, nourishing moisture with a non-greasy, satin-sheen finish",
      "Enriched with high concentrations of organic essential fatty acids",
      "Helps soothe razor irritation and calms dry, sensitive skin patches",
      "Surrounds you with an exquisite, pure Grasse rose editorial scent"
    ],
    sizes: ["150ml"],
    skinType: ["All", "Dry", "Sensitive"],
    isCrueltyFree: true,
    isVegan: false,
    isOrganic: true,
    isBestSeller: false,
    isNewArrival: false,
    stock: 40
  },
  {
    id: "prod-09",
    name: "Silk-Thread Seamless Eye Concealer",
    brand: "AURA LUXE",
    category: "Makeup",
    subcategory: "Concealer",
    price: 54,
    rating: 4.8,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    description: "An ultra-creamy, serum-infused seamless concealer that completely blurs dark circles and redness while feeding the delicate eye contour with white rose extracts and hyaluronic acid.",
    ingredients: ["Rosa Centifolia Extract", "Hydrolyzed Silk Protein", "Sodium Hyaluronate", "Squalane", "Tocopherol", "Glycerin"],
    howToUse: "Dot 2-3 drops under the eyes or over skin imperfections, then gently tap and melt into skin using a damp Aura sponge or warm ring finger.",
    benefits: [
      "Crease-proof formula that stays pristine and radiant for 12 hours",
      "Infused with caffeine to instantly de-puff under-eye shadows",
      "Self-setting velvet finish requires no drying powders",
      "Features a soft-cushion cooling applicator for premium comfort"
    ],
    colors: [
      { name: "Alabaster Conceal (Fair Cool)", hex: "#faf0e6" },
      { name: "Sand Conceal (Light Neutral)", hex: "#ebd0ba" },
      { name: "Honey Conceal (Medium Warm)", hex: "#dcae8a" },
      { name: "Bronze Conceal (Deep Neutral)", hex: "#ad805e" }
    ],
    skinType: ["All", "Sensitive", "Dry", "Oily", "Combination"],
    isCrueltyFree: true,
    isVegan: true,
    isOrganic: false,
    isBestSeller: true,
    isNewArrival: true,
    stock: 65
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-01",
    productId: "prod-01",
    userName: "Charlotte D. (Paris, France)",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "This elixir is absolute magic! I was skeptical given the price, but within three days, my persistent forehead fine lines looked noticeably softer, and my dry patches completely disappeared. It feels like silk and leaves my face looking so luminous and editorial. I've completely abandoned my previous serum. Dior-level craft!",
    date: "2026-06-12",
    verifiedPurchase: true,
    helpfulVotes: 34,
    images: ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=300"]
  },
  {
    id: "rev-02",
    productId: "prod-01",
    userName: "Audrey T. (New York, USA)",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "An absolute essential in my morning beauty routine. My skin has never glowed like this before. The fragrance is incredibly subtle and feels ultra-luxurious. Worth every dollar.",
    date: "2026-07-01",
    verifiedPurchase: true,
    helpfulVotes: 18
  },
  {
    id: "rev-03",
    productId: "prod-02",
    userName: "Sophia K. (London, UK)",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "The pigments of Couture Red 999 are outstanding! Usually matte lipsticks flake on my lips, but this one remains completely hydrated all day long. The gold casing is a beautiful piece of art. Highly recommend to everyone who loves luxury makeup.",
    date: "2026-05-24",
    verifiedPurchase: true,
    helpfulVotes: 42,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300"]
  },
  {
    id: "rev-04",
    productId: "prod-03",
    userName: "Eliza M. (Milan, Italy)",
    rating: 5,
    comment: "The gold infusion in this cream is unbelievable. It creates a subtle, beautiful reflection that makes my makeup sit perfectly. My dry skin drinks it up. Luxury skincare at its peak.",
    date: "2026-06-28",
    verifiedPurchase: true,
    helpfulVotes: 25
  }
];

export const MOCK_BLOGS: BlogArticle[] = [
  {
    id: "blog-01",
    title: "The Celestial Glow: How White Rose Elixir Reinvents Skin Longevity",
    excerpt: "Explore the molecular science of organic botanical white rose stem cells and their powerful regenerative impact on the facial moisture barrier.",
    content: "When it comes to luxury skincare, ingredients aren't simply chosen—they are curated through rigorous laboratory extraction. At Aura Beauty, our white roses are harvested by hand in Grasse at early sunrise, the exact hour their essential lipid concentrations peak. These cells contain key micro-peptides that trigger natural collagen synthesis, effectively smoothing out fine lines and sealing moisture deep inside cellular layers. Pairing this with niacinamide creates a pristine, editorial glow that remains dewy for 48 hours...",
    category: "Skincare Science",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    author: "Dr. Genevieve Moreau",
    date: "July 12, 2026",
    readTime: "5 min read"
  },
  {
    id: "blog-02",
    title: "Mastering the Velvet Lip: Behind the Couture Shades of the Season",
    excerpt: "An inside look at our hyper-pigmented transfer-proof liquid silk lipsticks, formulated with Macadamia seed oils for effortless editorial volume.",
    content: "Nothing radiates confidence quite like a perfectly defined bold lip. This season, our aesthetic focuses on soft-focus mattes that do not settle or feather. Standard matte lipsticks strip moisture from delicate lip tissues; our formulation incorporates organic Shea butter extract and Damask rose wax to form a luxurious protective breathable film. Learn how to map your lips with our double-bevel application technique for an instant volumetric uplift...",
    category: "Makeup Artistry",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
    author: "Elena Rostov (Lead MUA)",
    date: "June 28, 2026",
    readTime: "4 min read"
  }
];

export const BEAUTY_ROUTINES: BeautyTip[] = [
  {
    id: "tip-01",
    title: "The Ultimate 4-Step Dewy Skincare Ritual",
    stepByStep: [
      "Double cleanse face using Aura Botanical Cleansing Balm followed by lukewarm water.",
      "Sweep a few drops of Rose Céleste Hydrating Toner to prep and expand skin pores.",
      "Gently pat 4 drops of La Rose Céleste Revitalizing Elixir Serum over forehead and cheeks.",
      "Warm Or Blanc Absolute Cream between fingers and massage in upward circular movements to lock in 24k gold moisture."
    ],
    skinType: "Dry & Sensitive",
    difficulty: "Beginner",
    productsUsed: ["La Rose Céleste Revitalizing Elixir Serum", "Or Blanc Absolute Skin-Defense Cream"]
  },
  {
    id: "tip-02",
    title: "The Red Carpet Sculpting gua Sha Massage",
    stepByStep: [
      "Thoroughly coat clean face and collarbone with a premium face oil.",
      "Hold Jade Gua Sha tool flat against chin and glide firmly outward to the earlobe.",
      "Use the heart-shaped end of the Gua Sha to gently stroke from the nose bridge to the temple.",
      "Glide the tool downwards from behind the ear to the collarbone to stimulate lymphatic drainage."
    ],
    skinType: "All",
    difficulty: "Intermediate",
    productsUsed: ["Jade Gua Sha Sculpting Facial Tool", "La Rose Céleste Revitalizing Elixir Serum"]
  }
];

export const FAQS = [
  {
    q: "Are Aura Luxury Cosmetics products cruelty-free and vegan?",
    a: "Absolutely. Aura Beauty is 100% cruelty-free. The majority of our skincare, tools, and fragrance ranges are entirely vegan. For items containing luxurious organic components like honey or rose-wax, we clearly list them in the ingredients tab."
  },
  {
    q: "How does the AI Beauty Assistant determine my skin routine?",
    a: "Our AI assistant uses the modern Gemini 3.5 model. By inputting your personal parameters (skin type, undertone, age, and concerns), it runs real-time analysis against cosmetic ingredients and clinical routines to map out a bespoke, Dior-level regime just for you."
  },
  {
    q: "What is your return policy on luxury beauty cosmetics?",
    a: "We offer complimentary returns and exchanges within 30 days of purchase. Products must be returned in their original luxurious packaging. Sample testers included with your order can be kept."
  },
  {
    q: "Do you ship internationally and is shipping trackable?",
    a: "Yes. All Aura orders are shipped in hand-crafted satin-lined presentation boxes and feature priority trackable shipping via DHL Express or FedEx, complete with an interactive delivery timeline on your customer dashboard."
  }
];
