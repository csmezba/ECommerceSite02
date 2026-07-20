/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ShieldCheck, Compass, ArrowRight, Instagram, 
  MapPin, Clock, Star, HelpCircle, FileText, ChevronRight, HelpCircle as HelpIcon 
} from "lucide-react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import BeforeAfterShowcase from "./components/BeforeAfterShowcase";
import ProductCard from "./components/ProductCard";
import ProductFilters from "./components/ProductFilters";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/Checkout";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminPanel from "./components/AdminPanel";
import AIAssistant from "./components/AIAssistant";
import ShadeFinder from "./components/ShadeFinder";
import RoutineBuilder from "./components/RoutineBuilder";
import IngredientLibrary from "./components/IngredientLibrary";
import DiagnosticQuickTrigger from "./components/DiagnosticQuickTrigger";

import { MOCK_PRODUCTS } from "./data";
import { Product, CartItem, User } from "./types";

const DEFAULT_VIP_USER: User = {
  id: "user-aurora-77",
  name: "Genevieve Despres",
  email: "g.despres@versailles.com",
  role: "customer",
  rewardsPoints: 1250,
  savedAddresses: [
    {
      id: "addr-main",
      label: "Paris Flat Residence",
      fullName: "Genevieve Despres",
      phone: "+33 6 15 24 33 99",
      addressLine1: "18 Rue de l'Université",
      city: "Paris",
      postalCode: "75007",
      country: "France",
      state: "Île-de-France",
      isDefault: true
    }
  ],
  beautyProfile: {
    skinType: "Dry",
    skinUndertone: "Cool",
    hairType: "Wavy",
    makeupPreference: "Editorial",
    skinConcerns: ["Dryness", "Aging / Fine Lines"]
  }
};

export default function App() {
  // Navigation & View Routing State
  const [view, setView] = useState<string>("home"); // "home" | "shop" | "details" | "checkout" | "dashboard" | "admin"
  const [targetProductId, setTargetProductId] = useState<string>("");

  // Global Cart / Wishlist / Products State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_VIP_USER);

  // Chatbot Open/Close State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Shop Catalog Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [priceBucket, setPriceBucket] = useState("all");
  const [ethicalFilters, setEthicalFilters] = useState({
    vegan: false,
    crueltyFree: false,
    organic: false
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Preset states for RoutineBuilder
  const [presetSkinType, setPresetSkinType] = useState<string>("");
  const [presetConcerns, setPresetConcerns] = useState<string[]>([]);

  // Load products catalog from server if available (fallbacks gracefully to mock)
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.warn("Gracefully using mock products. Server starting...", err));
  }, []);

  // Sync scroll positioning on navigation triggers
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, targetProductId]);

  const handleSetView = (newView: string, targetId?: string) => {
    setView(newView);
    if (targetId) {
      setTargetProductId(targetId);
    }
    // Reset preset filters if not actively navigating to routine builder
    if (newView !== "routine-builder") {
      setPresetSkinType("");
      setPresetConcerns([]);
    }
  };

  const handleStartCustomQuiz = (skinType: string, concerns: string[]) => {
    setPresetSkinType(skinType);
    setPresetConcerns(concerns);
    setView("routine-builder");
  };

  // Add item to shopping cart state
  const handleAddToCart = (product: Product, quantity: number, color?: { name: string; hex: string }, size?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor?.name === color?.name && 
        item.selectedSize === size
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });
  };

  const handleRemoveFromCart = (productId: string, color?: string, size?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedColor?.name === color && 
        item.selectedSize === size)
    ));
  };

  const handleUpdateCartQuantity = (productId: string, targetQty: number, color?: string, size?: string) => {
    setCart(prev => {
      if (targetQty <= 0) {
        return prev.filter(item => 
          !(item.product.id === productId && 
            item.selectedColor?.name === color && 
            item.selectedSize === size)
        );
      }
      return prev.map(item => {
        if (item.product.id === productId && 
            item.selectedColor?.name === color && 
            item.selectedSize === size) {
          return { ...item, quantity: targetQty };
        }
        return item;
      });
    });
  };

  const handleClearCart = () => setCart([]);

  // Wishlist state helpers
  const handleAddToWishlist = (prod: Product) => {
    if (!wishlist.some(w => w.id === prod.id)) {
      setWishlist(prev => [...prev, prod]);
    }
  };

  const handleRemoveFromWishlist = (prod: Product) => {
    setWishlist(prev => prev.filter(w => w.id !== prod.id));
  };

  const handleToggleLogin = () => {
    if (currentUser) {
      setCurrentUser(null);
    } else {
      setCurrentUser(DEFAULT_VIP_USER);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLogin = (email: string) => {
    setCurrentUser({
      ...DEFAULT_VIP_USER,
      email: email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
    });
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product, 1);
    handleRemoveFromWishlist(product);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Filter Catalog Products Logic
  const filteredProducts = products.filter(prod => {
    // 1. Text Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      const matchIng = prod.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchCategory && !matchIng) return false;
    }

    // 2. Category selection
    if (selectedCategory !== "All" && prod.category !== selectedCategory) {
      return false;
    }

    // 3. Skin Physiology selection
    if (selectedSkinType !== "All") {
      const skinMatch = prod.benefits.some(b => b.toLowerCase().includes(selectedSkinType.toLowerCase())) || 
                       prod.description.toLowerCase().includes(selectedSkinType.toLowerCase()) ||
                       prod.howToUse.toLowerCase().includes(selectedSkinType.toLowerCase());
      if (!skinMatch) return false;
    }

    // 4. Ethical Standards selection
    if (ethicalFilters.vegan && !prod.isVegan) return false;
    if (ethicalFilters.crueltyFree && !prod.isCrueltyFree) return false;
    if (ethicalFilters.organic && !prod.ingredients.some(i => i.toLowerCase().includes("organic") || i.toLowerCase().includes("stem cell"))) return false;

    // 5. Price Buckets selection
    if (priceBucket !== "all") {
      const price = prod.isFlashSale && prod.flashSalePrice ? prod.flashSalePrice : prod.price;
      if (priceBucket === "under-50" && price >= 50) return false;
      if (priceBucket === "50-100" && (price < 50 || price > 100)) return false;
      if (priceBucket === "100-200" && (price < 100 || price > 200)) return false;
      if (priceBucket === "over-200" && price <= 200) return false;
    }

    return true;
  });

  // Sort Catalog Products Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price;
    const bPrice = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price;

    if (sortBy === "price-low-to-high") return aPrice - bPrice;
    if (sortBy === "price-high-to-low") return bPrice - aPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.isNewArrival ? 1 : -1;
    // Featured standard
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const featuredCreations = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#C5A059]/20 selection:text-[#1A1A1A] flex flex-col justify-between">
      
      {/* Premium Navigation Sticky Header */}
      <Header 
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateCartQty={handleUpdateCartQuantity}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onSetView={handleSetView}
        onOpenChat={() => setIsChatOpen(true)}
        products={products}
      />

      {/* Main Screen Layout Container */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {view === "home" && (
          <div className="space-y-0">
            {/* Hero slideshow */}
            <Hero onSetView={handleSetView} onOpenChat={() => setIsChatOpen(true)} />

            {/* Before / After Case Studies */}
            <BeforeAfterShowcase />

            {/* Bespoke Skincare Ambition Selector / Quick Trigger */}
            <DiagnosticQuickTrigger 
              onStartCustomQuiz={handleStartCustomQuiz} 
              onSetView={handleSetView} 
            />

            {/* Shop by Category Icons panel */}
            <section className="py-20 max-w-7xl mx-auto px-6 text-center select-none space-y-12">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">Maison Portals</span>
                <h3 className="font-serif text-3xl font-extralight text-[#1A1A1A]">Shop by Creation Category</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
                {[
                  { name: "Skincare", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300" },
                  { name: "Makeup", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=300" },
                  { name: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300" },
                  { name: "Haircare", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300" },
                  { name: "Bodycare", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=300" },
                  { name: "Beauty Tools", image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=300" }
                ].map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); handleSetView("shop"); }}
                    className="group flex flex-col items-center space-y-3 cursor-pointer"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-[#E5E1D8] shadow-sm relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    <span className="text-xs font-serif tracking-widest uppercase text-[#4A4A4A] group-hover:text-[#C5A059] transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured creations grid */}
            <section className="py-20 bg-white border-y border-[#E5E1D8]">
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">The Signature Rituals</span>
                    <h3 className="font-serif text-3xl font-extralight text-[#1A1A1A]">Featured Creations</h3>
                  </div>
                  <button 
                    onClick={() => handleSetView("shop")}
                    className="text-xs tracking-widest uppercase font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All Offerings</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredCreations.map(prod => (
                    <ProductCard 
                      key={prod.id}
                      product={prod}
                      wishlist={wishlist}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onRemoveFromWishlist={handleRemoveFromWishlist}
                      onSetView={handleSetView}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Scientific Active Botanical Library */}
            <IngredientLibrary 
              onSetCategory={setSelectedCategory} 
              onSetView={handleSetView} 
            />

            {/* Luxury Editorial Story section */}
            <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center select-none">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">Stem Cell Biology Heritage</span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-extralight leading-tight">
                  Crafting Cosmetics like <br />
                  <span className="italic font-light text-[#C5A059]">High Jewelry Creations</span>
                </h3>
                <p className="text-[#4A4A4A] font-sans text-xs md:text-sm tracking-wide leading-relaxed font-light">
                  Within our Grasse botanical labs, each white rose cellular clone is curated with clinical scrutiny. By cold-extracting lipids using vacuum centrifugation, we ensure no amino compound deteriorates. The resulting elixirs act as high-jewelry resistance frameworks directly for your skin barrier.
                </p>
                <div className="flex items-center space-x-3 text-xs italic text-[#C5A059]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Each custom formulation takes up to 6 months to mature in our cell vaults.</span>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-end">
                <div className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-[#E5E1D8]">
                  <img src="https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&q=80&w=800" alt="Laboratory extraction" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-radial-vignette bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </section>

            {/* Instagram Live Showcase Grid */}
            <section className="py-20 bg-[#FAF9F6] border-t border-[#E5E1D8]">
              <div className="max-w-7xl mx-auto px-6 text-center space-y-12 select-none">
                <div className="space-y-2">
                  <Instagram className="w-6 h-6 text-[#C5A059] mx-auto" />
                  <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">Maison Chronicles</span>
                  <h3 className="font-serif text-3xl font-extralight text-[#1A1A1A]">#AuraLuxuryGlow Live</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300",
                    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=300",
                    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300",
                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300",
                    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=300",
                    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=300"
                  ].map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-xs relative group cursor-pointer border border-[#E5E1D8]">
                      <img src={img} alt="Cosmetics flaylay" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <span className="text-[9px] tracking-widest uppercase font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">View Chronicle</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOG (SHOP) */}
        {view === "shop" && (
          <section className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Sidebar Filters */}
            <div className="lg:col-span-3">
              <ProductFilters 
                searchQuery={searchQuery}
                onSetSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                onSetSelectedCategory={setSelectedCategory}
                selectedSkinType={selectedSkinType}
                onSetSelectedSkinType={setSelectedSkinType}
                priceBucket={priceBucket}
                onSetPriceBucket={setPriceBucket}
                ethicalFilters={ethicalFilters}
                onToggleEthicalFilter={(key) => setEthicalFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                sortBy={sortBy}
                onSetSortBy={setSortBy}
                onResetFilters={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedSkinType("All");
                  setPriceBucket("all");
                  setEthicalFilters({ vegan: false, crueltyFree: false, organic: false });
                }}
                viewMode={viewMode}
                onSetViewMode={setViewMode}
                activeCount={sortedProducts.length}
              />
            </div>

            {/* Right Column - Catalog Grid */}
            <div className="lg:col-span-9 space-y-8">
              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 space-y-4 font-sans">
                  <HelpIcon className="w-8 h-8 text-[#c19273] mx-auto animate-bounce" />
                  <h4 className="font-serif text-sm uppercase tracking-widest text-gray-800">No Matching Creations</h4>
                  <p className="text-gray-500 text-xs">Pardon, chérie, we found no active formulations matching those filter parameters.</p>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                  {sortedProducts.map(prod => (
                    viewMode === "grid" ? (
                      <ProductCard 
                        key={prod.id}
                        product={prod}
                        wishlist={wishlist}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                        onSetView={handleSetView}
                      />
                    ) : (
                      /* LIST VIEW ITEM */
                      <div 
                        key={prod.id}
                        onClick={() => handleSetView("details", prod.id)}
                        className="p-4 border border-[#ebd8cc]/30 hover:border-[#c19273] rounded-xl flex items-center justify-between text-xs cursor-pointer bg-white shadow-xs transition-all select-none"
                      >
                        <div className="flex items-center space-x-4">
                          <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-md" />
                          <div className="space-y-1">
                            <span className="text-[8px] font-sans tracking-widest uppercase text-[#c19273] font-bold">{prod.brand}</span>
                            <h4 className="text-sm font-serif text-gray-900">{prod.name}</h4>
                            <p className="text-[10px] text-gray-500 font-light line-clamp-1">{prod.description}</p>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <span className="font-mono text-sm font-semibold text-gray-900">${prod.price}</span>
                          <span className="block text-[8px] text-green-700 font-bold uppercase tracking-widest bg-green-50 py-0.5 px-1.5 rounded">In Stock</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VIEW 3: PRODUCT DETAILS */}
        {view === "details" && (
          <ProductDetails 
            productId={targetProductId}
            products={products}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onSetView={handleSetView}
          />
        )}

        {/* VIEW 4: CHECKOUT FORM */}
        {view === "checkout" && (
          <Checkout 
            cart={cart}
            currentUser={currentUser}
            onSetView={handleSetView}
            onClearCart={handleClearCart}
          />
        )}

        {/* VIEW 5: CUSTOMER DASHBOARD */}
        {view === "dashboard" && (
          <CustomerDashboard 
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onSetView={handleSetView}
          />
        )}

        {/* VIEW 6: ADMIN BI PANEL */}
        {view === "admin" && (
          <AdminPanel 
            products={products}
            onUpdateProducts={setProducts}
            onSetView={handleSetView}
          />
        )}

        {/* VIEW 7: AI SHADE FINDER */}
        {view === "shade-finder" && (
          <ShadeFinder 
            products={products}
            onAddToCart={handleAddToCart}
            onSetView={handleSetView}
          />
        )}

        {/* VIEW 8: BESPOKE ROUTINE BUILDER */}
        {view === "routine-builder" && (
          <RoutineBuilder 
            products={products}
            onAddToCart={handleAddToCart}
            onSetView={handleSetView}
            presetSkinType={presetSkinType}
            presetConcerns={presetConcerns}
          />
        )}

      </main>

      {/* Floating Gemini AI Beauty Assistant Oracle */}
      <AIAssistant 
        currentUser={currentUser}
        onSetView={handleSetView}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />

      {/* High-Contrast Luxury Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16 border-t border-white/5 select-none font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Manifesto */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl tracking-[0.2em] uppercase text-[#C5A059]">AURA</h4>
            <p className="text-[11px] text-gray-400 font-sans tracking-wide leading-relaxed font-light">
              Maison de Beauté Biologique. Formulating absolute-purity botanical and clinical cellular elixirs in Grasse, France to elevate self-care regimes into sacred, meditative luxury rituals.
            </p>
          </div>

          {/* Catalog links */}
          <div className="space-y-4">
            <h5 className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold font-sans">Atelier Collections</h5>
            <ul className="space-y-2 text-[11px] text-gray-400 font-light">
              <li><button onClick={() => { setSelectedCategory("Skincare"); handleSetView("shop"); }} className="hover:text-[#C5A059] transition-colors cursor-pointer">White Rose Skincare</button></li>
              <li><button onClick={() => { setSelectedCategory("Makeup"); handleSetView("shop"); }} className="hover:text-[#C5A059] transition-colors cursor-pointer">Couture Lipsticks & Matte Tints</button></li>
              <li><button onClick={() => { setSelectedCategory("Fragrance"); handleSetView("shop"); }} className="hover:text-[#C5A059] transition-colors cursor-pointer">L'Ambre Imperial Perfumes</button></li>
              <li><button onClick={() => { setSelectedCategory("Beauty Tools"); handleSetView("shop"); }} className="hover:text-[#C5A059] transition-colors cursor-pointer">Gold Cryo-Rollers</button></li>
            </ul>
          </div>

          {/* Quick Support info */}
          <div className="space-y-4">
            <h5 className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold font-sans">Maison Concierge</h5>
            <ul className="space-y-2 text-[11px] text-gray-400 font-light">
              <li><button onClick={() => setIsChatOpen(true)} className="hover:text-[#C5A059] transition-colors cursor-pointer">Interactive AI Beauty Oracle</button></li>
              <li><button onClick={() => handleSetView("dashboard")} className="hover:text-[#C5A059] transition-colors cursor-pointer">My VIP Membership Profile</button></li>
              <li><button onClick={() => handleSetView("admin")} className="hover:text-[#C5A059] transition-colors cursor-pointer">Business Intelligence Console</button></li>
              <li><span className="text-gray-400 font-sans font-normal">VIP Hotline: +33 1 70 88 99</span></li>
            </ul>
          </div>

          {/* Trust certifications */}
          <div className="space-y-4">
            <h5 className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold font-sans">Authentic Guarantees</h5>
            <p className="text-[10px] text-gray-400 leading-relaxed font-light">
              All Aura creations are certified vegan, cruelty-free, organic, allergy-tested, and tracked with priority DHL Express dispatch.
            </p>
            <div className="flex space-x-3 text-gray-400">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <Compass className="w-5 h-5 text-[#C5A059]" />
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-sans">
          <span>© {new Date().getFullYear()} Aura Luxury de Beauté. All Rights Reserved. Crafted with French Botanical Cell Extracts.</span>
          <div className="flex space-x-4 pt-3 sm:pt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">VIP Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
