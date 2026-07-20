/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_BLOGS, BEAUTY_ROUTINES } from "./src/data";
import { Product, Order, User, Review, BeautyProfile } from "./src/types";

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database
let DB_PRODUCTS: Product[] = [...MOCK_PRODUCTS];
let DB_REVIEWS: Review[] = [...MOCK_REVIEWS];
let DB_ORDERS: Order[] = [];

// Default Mock Users
let DB_USERS: User[] = [
  {
    id: "user-cust",
    email: "customer@aura.com",
    name: "Charlotte Despres",
    role: "customer",
    rewardsPoints: 320,
    savedAddresses: [
      {
        id: "addr-1",
        label: "Primary Residence",
        fullName: "Charlotte Despres",
        phone: "+33 6 1234 5678",
        addressLine1: "15 Avenue des Champs-Élysées",
        city: "Paris",
        state: "Île-de-France",
        postalCode: "75008",
        country: "France",
        isDefault: true
      }
    ],
    beautyProfile: {
      skinType: "Dry",
      skinConcerns: ["Dryness", "Fine Lines", "Sensitivity"],
      skinUndertone: "Cool",
      hairType: "Wavy",
      makeupPreference: "Natural"
    }
  },
  {
    id: "user-admin",
    email: "admin@aura.com",
    name: "Eleonora Vance",
    role: "admin",
    rewardsPoints: 0,
    savedAddresses: []
  }
];

// Initialize Google GenAI
const aiApiKey = process.env.GEMINI_API_KEY || "MOCK_KEY";
const ai = new GoogleGenAI({
  apiKey: aiApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});

// ==========================================
// API ROUTES
// ==========================================

// 1. PRODUCTS API
app.get("/api/products", (req: Request, res: Response) => {
  res.json(DB_PRODUCTS);
});

app.get("/api/products/:id", (req: Request, res: Response) => {
  const product = DB_PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

// 2. REVIEWS API
app.get("/api/reviews/:productId", (req: Request, res: Response) => {
  const reviews = DB_REVIEWS.filter(r => r.productId === req.params.productId);
  res.json(reviews);
});

app.post("/api/reviews", (req: Request, res: Response) => {
  const { productId, userName, rating, comment, verifiedPurchase, images } = req.body;
  
  if (!productId || !userName || !rating || !comment) {
    res.status(400).json({ error: "Missing required review fields" });
    return;
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split("T")[0],
    verifiedPurchase: !!verifiedPurchase,
    helpfulVotes: 0,
    images: images || []
  };

  DB_REVIEWS.unshift(newReview);
  
  // Recalculate average rating
  const prodReviews = DB_REVIEWS.filter(r => r.productId === productId);
  const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
  
  const prodIdx = DB_PRODUCTS.findIndex(p => p.id === productId);
  if (prodIdx !== -1) {
    DB_PRODUCTS[prodIdx].rating = Number(avgRating.toFixed(1));
    DB_PRODUCTS[prodIdx].reviewsCount = prodReviews.length;
  }

  res.status(201).json(newReview);
});

// 3. AUTHENTICATION & PROFILE API
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body; // In simulated environment, accept any password
  
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  let user = DB_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Auto-create customer user if not exists to facilitate smooth client testing
    user = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      role: "customer",
      rewardsPoints: 100,
      savedAddresses: []
    };
    DB_USERS.push(user);
  }

  res.json({ success: true, user });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    res.status(400).json({ error: "Email and name are required" });
    return;
  }

  const existing = DB_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.json({ success: true, user: existing });
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: "customer",
    rewardsPoints: 100,
    savedAddresses: []
  };
  DB_USERS.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.put("/api/auth/profile", (req: Request, res: Response) => {
  const { userId, name, beautyProfile, savedAddresses } = req.body;
  const userIdx = DB_USERS.findIndex(u => u.id === userId);
  
  if (userIdx === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (name) DB_USERS[userIdx].name = name;
  if (beautyProfile) DB_USERS[userIdx].beautyProfile = beautyProfile;
  if (savedAddresses) DB_USERS[userIdx].savedAddresses = savedAddresses;

  res.json({ success: true, user: DB_USERS[userIdx] });
});

// 4. ORDERS & CHECKOUT API
app.post("/api/orders", (req: Request, res: Response) => {
  const { userId, items, subtotal, discount, tax, shipping, total, shippingAddress, paymentMethod } = req.body;
  
  if (!userId || !items || !items.length || !shippingAddress) {
    res.status(400).json({ error: "Invalid order payload" });
    return;
  }

  const orderId = `order-luxe-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newOrder: Order = {
    id: orderId,
    userId,
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    shippingAddress,
    paymentMethod,
    status: "processing",
    createdAt: new Date().toISOString(),
    trackingTimeline: [
      { status: "Order Placed", date: new Date().toLocaleDateString(), description: "Your order was successfully validated on Aura secure servers.", done: true },
      { status: "Quality Selection", date: new Date().toLocaleDateString(), description: "Products selected in Grasse, checking seals and custom presentation boxes.", done: true },
      { status: "Shipped", date: "Pending", description: "DHL Express courier courier pickup has been requested.", done: false },
      { status: "Out for Delivery", date: "Pending", description: "En route to premium carrier regional sorting facility.", done: false },
      { status: "Delivered", date: "Pending", description: "Bespoke presentation box delivered to recipient's threshold.", done: false }
    ],
    invoiceUrl: `/api/orders/${orderId}/invoice`
  };

  DB_ORDERS.unshift(newOrder);

  // Update user loyalty points (10% of total)
  const userIdx = DB_USERS.findIndex(u => u.id === userId);
  if (userIdx !== -1) {
    const earned = Math.floor(total * 0.1);
    DB_USERS[userIdx].rewardsPoints += earned;
  }

  // Deduct stocks
  items.forEach((item: any) => {
    const prodIdx = DB_PRODUCTS.findIndex(p => p.id === item.productId);
    if (prodIdx !== -1) {
      DB_PRODUCTS[prodIdx].stock = Math.max(0, DB_PRODUCTS[prodIdx].stock - item.quantity);
    }
  });

  res.status(201).json(newOrder);
});

app.get("/api/orders/user/:userId", (req: Request, res: Response) => {
  const orders = DB_ORDERS.filter(o => o.userId === req.params.userId);
  res.json(orders);
});

app.get("/api/orders/:id", (req: Request, res: Response) => {
  const order = DB_ORDERS.find(o => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // Simulate timeline progression over time
  const timePassedSec = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  if (timePassedSec > 15 && order.status === "processing") {
    order.status = "shipped";
    order.trackingTimeline[2].done = true;
    order.trackingTimeline[2].date = new Date(Date.now()).toLocaleDateString();
  }
  if (timePassedSec > 40 && order.status === "shipped") {
    order.status = "delivered";
    order.trackingTimeline[3].done = true;
    order.trackingTimeline[3].date = new Date(Date.now()).toLocaleDateString();
    order.trackingTimeline[4].done = true;
    order.trackingTimeline[4].date = new Date(Date.now()).toLocaleDateString();
  }

  res.json(order);
});

// 5. ADMIN ANALYTICS & CRUD API
app.get("/api/admin/analytics", (req: Request, res: Response) => {
  // Compute analytics
  const totalOrders = DB_ORDERS.length;
  const totalRevenue = DB_ORDERS.reduce((sum, o) => sum + o.total, 0);
  
  // Group categories
  const salesByCategory: Record<string, number> = {};
  DB_PRODUCTS.forEach(p => {
    salesByCategory[p.category] = (salesByCategory[p.category] || 0) + (p.stock > 0 ? 100 - p.stock : 10);
  });

  const categoriesChart = Object.keys(salesByCategory).map(name => ({
    name,
    value: salesByCategory[name]
  }));

  // Daily Sales simulation
  const dailySales = [
    { day: "Mon", sales: 1200, orders: 8 },
    { day: "Tue", sales: 1850, orders: 12 },
    { day: "Wed", sales: 2200, orders: 14 },
    { day: "Thu", sales: 1500, orders: 10 },
    { day: "Fri", sales: 3100, orders: 19 },
    { day: "Sat", sales: 4200, orders: 25 },
    { day: "Sun", sales: totalOrders > 0 ? totalRevenue : 3500, orders: totalOrders > 0 ? totalOrders : 21 }
  ];

  res.json({
    totalOrders: totalOrders || 109,
    totalRevenue: totalRevenue || 17640,
    customersCount: DB_USERS.filter(u => u.role === "customer").length + 42,
    activeProductsCount: DB_PRODUCTS.length,
    categoriesChart,
    dailySales
  });
});

app.post("/api/admin/products", (req: Request, res: Response) => {
  const productData = req.body;
  if (!productData.name || !productData.price || !productData.category) {
    res.status(400).json({ error: "Missing required product fields" });
    return;
  }

  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    rating: 5.0,
    reviewsCount: 0,
    image: productData.image || "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
    hoverImage: productData.hoverImage || "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600",
    ingredients: Array.isArray(productData.ingredients) ? productData.ingredients : ["Water", "Glycerin", "Organic Extracts"],
    benefits: Array.isArray(productData.benefits) ? productData.benefits : ["Moisturizes", "Glowing skin"],
    stock: Number(productData.stock || 20)
  };

  DB_PRODUCTS.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/admin/products/:id", (req: Request, res: Response) => {
  const prodId = req.params.id;
  const prodIdx = DB_PRODUCTS.findIndex(p => p.id === prodId);

  if (prodIdx === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const existing = DB_PRODUCTS[prodIdx];
  const updatedData = req.body;

  DB_PRODUCTS[prodIdx] = {
    ...existing,
    ...updatedData,
    price: updatedData.price ? Number(updatedData.price) : existing.price,
    originalPrice: updatedData.originalPrice ? Number(updatedData.originalPrice) : existing.originalPrice,
    stock: updatedData.stock !== undefined ? Number(updatedData.stock) : existing.stock
  };

  res.json(DB_PRODUCTS[prodIdx]);
});

app.delete("/api/admin/products/:id", (req: Request, res: Response) => {
  const prodId = req.params.id;
  const originalLen = DB_PRODUCTS.length;
  DB_PRODUCTS = DB_PRODUCTS.filter(p => p.id !== prodId);

  if (DB_PRODUCTS.length === originalLen) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ success: true, message: "Product deleted" });
});

// 6. AI BEAUTY ASSISTANT PROXY API
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { messages, userProfile } = req.body;

  if (!messages || !messages.length) {
    res.status(400).json({ error: "Messages array is required" });
    return;
  }

  // Prep system instructions
  const profileDetails = userProfile
    ? `The active client is: Name ${userProfile.name}, Skin Type: ${userProfile.beautyProfile?.skinType || "Dry"}, Skin Concerns: ${userProfile.beautyProfile?.skinConcerns?.join(", ") || "Dryness, aging"}, Makeup Preference: ${userProfile.beautyProfile?.makeupPreference || "Natural"}, Undertone: ${userProfile.beautyProfile?.skinUndertone || "Neutral"}.`
    : `The client is visiting anonymously.`;

  const availableProductsSummary = DB_PRODUCTS.map(p => 
    `- [${p.id}] "${p.name}" by ${p.brand}, Category: ${p.category} -> Sub: ${p.subcategory}, Price: $${p.price}, Rating: ${p.rating}, Highlights: ${p.isVegan ? "Vegan" : ""}, ${p.isCrueltyFree ? "Cruelty-Free" : ""}, ${p.spf || ""}`
  ).join("\n");

  const systemInstruction = `You are the iconic Aura Beauty Consultant—a highly polished, sophisticated, and empathetic luxury beauty advisor modeled after couture experts at Dior, Chanel, and Estée Lauder. 
Your goal is to guide clients to their perfect skincare rituals, makeup shades, fragrances, and tools.
Always write in an elegant, professional, feminine, and warm tone. Refer to Aura's skincare expertise.

YOUR PARAMETERS & REAL PRODUCTS DICTIONARY:
${profileDetails}

AVAILABLE PRODUCT INVENTORY:
${availableProductsSummary}

IMPORTANT RULES:
1. When recommending, prioritize the exact Aura Beauty products listed above. Always provide their names and prices precisely.
2. If asked about a beauty routine, provide structured steps (1, 2, 3...) using luxury terms like 'Ritual', 'Celestial', 'Elixir'.
3. If asked about a skin shade or undertone, offer recommendations based on the 'Silk-Thread Skin Tint' shades.
4. Keep the responses beautifully formatted with markdown, spacing, and luxurious typography. Be concise and deeply helpful. Limit responses to 3 paragraphs or elegant bullet points.
5. If the user mentions order issues or refund requests, respond politely with "Let me put you in touch with Aura VIP concierge immediately" and provide helpful guidance.`;

  try {
    const modelInput = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    if (aiApiKey === "MOCK_KEY") {
      // Return a beautiful mocked luxurious reply if key is missing or placeholder
      const mockReplies = [
        "Chère cliente, based on your beautiful profile, I highly recommend introducing our **La Rose Céleste Revitalizing Elixir Serum ($185)**. Enriched with white rose cells, it will seal deep cellular hydration and leave your face with a celestial satin glow. Pair this morning and night with the Jade Gua Sha sculpting tool to stimulate lymphatic drainage.",
        "An elegant choice. For a sophisticated editorial look, select our **Silk-Thread Illuminating Skin Tint ($64)** in Satin Sand (Light Neutral) or Golden Honey (Medium Warm) depending on your seasonal warmth. Apply with an activated beauty sponge for an exquisite light-blurring finish.",
        "To elevate your nighttime beauty ritual, begin with a warm water cleanse followed by our botanical white rose toner. Apply the **Or Blanc Absolute Cream ($240)**. Its real 24k colloidal gold particles will actively stimulate cell respiration while you sleep."
      ];
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      res.json({ text: randomReply });
      return;
    }

    const lastMsgText = messages[messages.length - 1].text;
    
    // We pass systemInstruction inside config
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: lastMsgText,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const resultText = response.text || "Pardon, chérie, my digital atelier is currently evolving. Please try asking again.";
    res.json({ text: resultText });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: "Failed to query Gemini assistant", details: error.message });
  }
});

// 7. AI SHADE MATCH FINDER API
app.post("/api/ai/shade-match", async (req: Request, res: Response) => {
  const { skinTone, undertone, finish, selfieBase64 } = req.body;

  // Rule-based fallback system (ensures 100% reliability and matches perfectly)
  let matchedFoundation = "Satin Sand (Light Neutral)";
  let matchedConcealer = "Sand Conceal (Light Neutral)";
  let matchedLipstick = "Velvet Rose";
  let explanation = "This selection balances your light complexion with natural neutral tones, creating a velvet editorial look.";

  const toneLower = (skinTone || "").toLowerCase();
  const underLower = (undertone || "").toLowerCase();
  const finishLower = (finish || "").toLowerCase();

  if (toneLower.includes("fair")) {
    matchedFoundation = "Alabaster Aura (Fair Cool)";
    matchedConcealer = "Alabaster Conceal (Fair Cool)";
    matchedLipstick = underLower.includes("warm") ? "Sienna Nude" : "Velvet Rose";
    explanation = "Your porcelain skin benefits from cool Alabaster highlights, which de-puff the under-eye area and unify your complexion with a high-end satin glow.";
  } else if (toneLower.includes("light")) {
    matchedFoundation = "Satin Sand (Light Neutral)";
    matchedConcealer = "Sand Conceal (Light Neutral)";
    matchedLipstick = underLower.includes("cool") ? "Velvet Rose" : "Sienna Nude";
    explanation = "A perfect light neutral balance. Satin Sand keeps your skin breathing while the Sand concealer smoothly lifts dark under-eye contours.";
  } else if (toneLower.includes("medium")) {
    matchedFoundation = "Golden Honey (Medium Warm)";
    matchedConcealer = "Honey Conceal (Medium Warm)";
    matchedLipstick = underLower.includes("cool") ? "Bordeaux Nights" : "Couture Red 999";
    explanation = "Warm golden hues bring out the rich golden pigment in your complexion, paired with our iconic lipstick to maximize volumetric definition.";
  } else if (toneLower.includes("deep") || toneLower.includes("tan") || toneLower.includes("dark")) {
    matchedFoundation = "Sienna Bronze (Deep Neutral)";
    matchedConcealer = "Bronze Conceal (Deep Neutral)";
    matchedLipstick = underLower.includes("warm") ? "Sienna Nude" : "Bordeaux Nights";
    explanation = "Deep, rich skin tones deserve absolute high-contrast warmth. Sienna Bronze blends organically without any chalky cast, paired with Bordeaux Nights for ultimate luxury.";
  }

  // If the API key is valid and we have Gemini, we can ask Gemini to enrich the analysis!
  if (aiApiKey !== "MOCK_KEY") {
    try {
      const parts: any[] = [];
      let promptText = `You are the Aura Makeup Artistry Expert. Analyze this makeup shade request:
- User-specified Skin Tone: ${skinTone}
- User-specified Undertone: ${undertone}
- User-specified Preferred Finish: ${finish}

Recommend the exact matching shade names from these lists:
1. Foundations (Silk-Thread Illuminating Skin Tint SPF 30): "Alabaster Aura (Fair Cool)", "Satin Sand (Light Neutral)", "Golden Honey (Medium Warm)", "Sienna Bronze (Deep Neutral)".
2. Concealers (Silk-Thread Seamless Eye Concealer): "Alabaster Conceal (Fair Cool)", "Sand Conceal (Light Neutral)", "Honey Conceal (Medium Warm)", "Bronze Conceal (Deep Neutral)".
3. Lipsticks (Satin Velvet Radiant Matte Lipstick): "Couture Red 999", "Velvet Rose", "Sienna Nude", "Bordeaux Nights".

Return a JSON object matching this strict schema:
{
  "analysis": "Provide a luxury, 2-sentence aesthetic skin analysis. Use terms like 'pristine', 'celestial', 'luminous'.",
  "foundationShade": "Exact selected shade name",
  "concealerShade": "Exact selected shade name",
  "lipstickShade": "Exact selected shade name",
  "explanation": "A short, elegant 1-sentence explanation of why these shades suit them.",
  "confidence": 98
}`;

      if (selfieBase64) {
        // Remove data header if present
        const cleanedBase64 = selfieBase64.includes(",") ? selfieBase64.split(",")[1] : selfieBase64;
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanedBase64
          }
        });
        promptText += "\nAlso analyze the provided selfie image to verify and refine this shade matching recommendation.";
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });

      const resText = response.text || "";
      const data = JSON.parse(resText.trim());
      if (data && data.foundationShade && data.concealerShade && data.lipstickShade) {
        res.json({
          success: true,
          analysis: data.analysis || `A bespoke diagnostic of your ${skinTone} skin with a ${finish} finish.`,
          foundationShade: data.foundationShade,
          concealerShade: data.concealerShade,
          lipstickShade: data.lipstickShade,
          explanation: data.explanation || explanation,
          confidence: data.confidence || 95,
          isAI: true
        });
        return;
      }
    } catch (err: any) {
      console.warn("Gemini shade matching failed, utilizing local luxury rules engine:", err.message);
    }
  }

  // Fallback response (also used if Gemini is mocked)
  res.json({
    success: true,
    analysis: `A bespoke luxury cosmetic diagnostic. Based on your beautiful ${skinTone || "light"} complexion with ${undertone || "neutral"} undertones, we have curated a synchronized, editorial shade combination with a pristine ${finish || "satin"} finish.`,
    foundationShade: matchedFoundation,
    concealerShade: matchedConcealer,
    lipstickShade: matchedLipstick,
    explanation: explanation,
    confidence: 94,
    isAI: false
  });
});

// ==========================================
// VITE DEV SERVER OR STATIC SERVING
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting full-stack dev server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error("Critical server boot failure:", err);
});
