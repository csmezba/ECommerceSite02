/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Heart, ShoppingBag, User as UserIcon, Sparkles, X, 
  Trash2, ArrowRight, Check, Star, LogIn, Lock, Mail, Tag, Eye, ShieldAlert
} from "lucide-react";
import { Product, CartItem, User } from "../types";

interface HeaderProps {
  cart: CartItem[];
  wishlist: Product[];
  currentUser: User | null;
  onSetView: (view: string, targetId?: string) => void;
  onRemoveFromCart: (productId: string, color?: string, size?: string) => void;
  onUpdateCartQty: (productId: string, qty: number, color?: string, size?: string) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  onLogout: () => void;
  onLogin: (email: string) => void;
  onOpenChat: () => void;
  products: Product[];
}

export default function Header({
  cart,
  wishlist,
  currentUser,
  onSetView,
  onRemoveFromCart,
  onUpdateCartQty,
  onRemoveFromWishlist,
  onMoveToCart,
  onLogout,
  onLogin,
  onOpenChat,
  products
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  
  // Auth Form state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Track page scroll to apply luxury glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update suggestions dynamically as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    setSearchSuggestions(filtered);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSetView("shop");
      setIsSearchOpen(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!authEmail) {
      setAuthError("Email is required");
      return;
    }
    
    if (isRegister && !authName) {
      setAuthError("Name is required");
      return;
    }

    // Call API Login/Register mock
    onLogin(authEmail);
    setIsAuthOpen(false);
    // Clear forms
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "LUXE20") {
      setCouponSuccess("Luxury Coupon Applied! 20% savings active on checkout.");
    } else {
      setCouponSuccess("Invalid coupon code. Try LUXE20.");
    }
  };

  // Compute total cart value
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <>
      {/* Top announcements ticker */}
      <div className="w-full bg-[#1A1A1A] text-[#FAF9F6] text-xs py-2 px-4 text-center font-sans tracking-widest font-light uppercase border-b border-[#E5E1D8]/10">
        Complimentary worldwide priority delivery on orders over $150 • Luxe Presentation Box & Samples Included
      </div>

      <header className={`w-full fixed top-8 left-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? "glass-premium shadow-md py-4 text-[#1A1A1A] border-b border-[#E5E1D8]" 
          : "bg-transparent text-[#1A1A1A] py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onSetView("home")} 
            className="cursor-pointer flex flex-col items-start select-none"
          >
            <span className="font-serif text-2xl tracking-[0.25em] font-light">A U R A</span>
            <span className="text-[9px] tracking-[0.45em] font-sans text-[#C5A059] font-medium uppercase -mt-1">Beauty House</span>
          </div>

          {/* Desktop Categories Menu */}
          <nav className="hidden md:flex items-center space-x-6 font-sans text-xs tracking-widest uppercase font-light">
            <button 
              onClick={() => onSetView("home")} 
              className="hover:text-[#C5A059] transition-colors cursor-pointer py-2 border-b border-transparent hover:border-[#C5A059]"
            >
              The Maison
            </button>
            <button 
              onClick={() => onSetView("shop")} 
              className="hover:text-[#C5A059] transition-colors cursor-pointer py-2 border-b border-transparent hover:border-[#C5A059]"
            >
              All Beauty
            </button>
            <button 
              onClick={() => onSetView("shade-finder")} 
              className="hover:text-[#C5A059] text-[#C5A059] font-medium transition-colors cursor-pointer py-2 border-b border-transparent hover:border-[#C5A059] flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>AI Shade Finder</span>
            </button>
            <button 
              onClick={() => onSetView("routine-builder")} 
              className="hover:text-[#C5A059] transition-colors cursor-pointer py-2 border-b border-transparent hover:border-[#C5A059]"
            >
              Bespoke Rituals
            </button>
            <button 
              onClick={() => onSetView("shop")} 
              className="hover:text-[#C5A059] transition-colors cursor-pointer py-2 border-b border-transparent hover:border-[#C5A059]"
            >
              New Arrivals
            </button>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-6">
            
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-1 hover:text-[#C5A059] transition-colors cursor-pointer relative"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 stroke-[1.25]" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => setIsWishlistOpen(true)} 
              className="p-1 hover:text-[#C5A059] transition-colors cursor-pointer relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.25]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-[#FAF9F6] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="p-1 hover:text-[#C5A059] transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-semibold">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onSetView(currentUser.role === "admin" ? "admin" : "dashboard")} 
                  className="p-1 hover:text-[#C5A059] flex items-center space-x-1.5 transition-colors cursor-pointer text-xs font-sans tracking-wider"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.25]" />
                  <span className="hidden lg:inline-block font-light text-[10px] uppercase tracking-widest text-gray-500">
                    Chère {currentUser.name.split(" ")[0]}
                  </span>
                </button>
                <button 
                  onClick={onLogout} 
                  className="text-[9px] font-sans tracking-widest font-semibold uppercase text-red-700/80 hover:text-red-900 ml-1.5"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setIsRegister(false); setIsAuthOpen(true); }} 
                className="p-1 hover:text-[#C5A059] flex items-center space-x-1.5 transition-colors cursor-pointer text-xs font-sans tracking-wider"
                aria-label="Account Login"
              >
                <UserIcon className="w-5 h-5 stroke-[1.25]" />
                <span className="hidden lg:inline-block font-light text-[10px] uppercase tracking-widest text-gray-500">Sign In</span>
              </button>
            )}

            {/* Floating AI Direct Trigger */}
            <button 
              onClick={onOpenChat}
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white hover:text-white transition-all duration-300 font-sans text-[10px] tracking-widest uppercase font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C5A059]" />
              <span>Beauty AI</span>
            </button>

          </div>
        </div>
      </header>

      {/* ==========================================
          DYNAMIC SLIDEOUTS / MODALS
         ========================================== */}
      
      {/* 1. INSTANT SEARCH POPUP OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1c1917]/85 backdrop-blur-md z-50 flex flex-col justify-start pt-32 px-6"
          >
            <div className="max-w-3xl mx-auto w-full relative">
              <button 
                onClick={() => setIsSearchOpen(false)} 
                className="absolute -top-16 right-0 text-white hover:text-[#c19273] p-2 cursor-pointer"
              >
                <X className="w-8 h-8 font-light" />
              </button>

              <form onSubmit={handleSearchSubmit} className="w-full relative border-b border-[#ebd8cc]/50 py-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH FOR SKINCARE, SILK TINTS, LUXURY MATTES..." 
                  className="w-full bg-transparent text-white font-serif text-2xl md:text-3xl tracking-widest outline-none border-none placeholder:text-gray-500/70"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white">
                  <Search className="w-7 h-7 stroke-[1.25]" />
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-8">
                {searchSuggestions.length > 0 ? (
                  <div>
                    <h4 className="text-[10px] font-sans tracking-widest uppercase text-gray-400 mb-4 font-semibold">Immediate Matching Creations</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {searchSuggestions.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            onSetView("details", item.id);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[10px] font-sans tracking-widest text-[#c19273] font-semibold">{item.brand}</span>
                            <h5 className="text-sm font-serif text-white tracking-wide font-light">{item.name}</h5>
                            <span className="text-xs font-mono text-gray-300">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  searchQuery.trim() !== "" ? (
                    <p className="text-gray-400 text-sm font-sans font-light">No custom formulations found matching "{searchQuery}"</p>
                  ) : (
                    <div>
                      <h4 className="text-[10px] font-sans tracking-widest uppercase text-gray-400 mb-4">Trending Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {["La Rose Serum", "Or Blanc", "Skin Tint", "Red 999 Lipstick", "Gua Sha"].map(word => (
                          <button 
                            key={word}
                            onClick={() => setSearchQuery(word)}
                            className="px-4 py-2 rounded-full border border-white/15 hover:border-[#c19273] text-xs font-sans text-white hover:text-[#c19273] bg-white/5 transition-all cursor-pointer"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PREMIUM SHOPPING BAG DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-[#1c1917]/50 backdrop-blur-xs"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-md bg-[#fcfbfa] h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="p-6 border-b border-[#ebd8cc] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#c19273]" />
                  <h3 className="font-serif text-lg tracking-widest uppercase text-[#1c1917]">Shopping Bag</h3>
                  <span className="text-xs font-mono text-gray-500">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="p-2 hover:text-[#c19273] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#fcfaf7] flex items-center justify-center border border-[#ebd8cc]">
                      <ShoppingBag className="w-6 h-6 stroke-[1.25] text-gray-400" />
                    </div>
                    <h4 className="font-serif text-base tracking-widest text-[#1c1917] uppercase font-light">Your Bag is Empty</h4>
                    <p className="text-xs text-gray-500 font-sans max-w-xs font-light">Explore Aura's luxury formulations and claim your complementary white rose samples.</p>
                    <button 
                      onClick={() => { setIsCartOpen(false); onSetView("shop"); }}
                      className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#c19273] text-[#fcfbfa] font-sans text-[10px] tracking-widest uppercase font-semibold transition-all duration-300"
                    >
                      Browse Creations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const itemPrice = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
                      return (
                        <div key={`${item.product.id}-${idx}`} className="flex items-start space-x-4 p-4 bg-white border border-[#ebd8cc]/40 rounded-lg shadow-xs relative">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-20 h-20 object-cover rounded-md border border-[#ebd8cc]/30"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-1.5">
                            <span className="text-[9px] font-sans tracking-widest uppercase font-bold text-[#c19273]">{item.product.brand}</span>
                            <h4 className="text-xs font-serif text-gray-900 tracking-wide">{item.product.name}</h4>
                            
                            {/* Color/Size Info */}
                            <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-sans font-light">
                              {item.selectedColor && (
                                <div className="flex items-center space-x-1">
                                  <span className="w-2.5 h-2.5 rounded-full border border-gray-400" style={{ backgroundColor: item.selectedColor.hex }} />
                                  <span>{item.selectedColor.name}</span>
                                </div>
                              )}
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center border border-gray-200 rounded">
                                <button 
                                  onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1, item.selectedColor?.name, item.selectedSize)}
                                  className="px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-mono">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1, item.selectedColor?.name, item.selectedSize)}
                                  className="px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs font-mono text-gray-900 font-semibold">${itemPrice * item.quantity}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => onRemoveFromCart(item.product.id, item.selectedColor?.name, item.selectedSize)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#ebd8cc] bg-white space-y-4 shadow-lg">
                  {/* Coupon Area */}
                  <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
                    <Tag className="w-4 h-4 text-[#c19273]" />
                    <input 
                      type="text" 
                      placeholder="ENTER LUXE20 PROMO CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-transparent border-none text-[10px] tracking-widest outline-none font-sans uppercase placeholder:text-gray-400 text-gray-800"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="text-[10px] font-sans tracking-widest font-bold uppercase text-[#c19273] hover:text-[#1c1917] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponSuccess && (
                    <p className="text-[10px] font-sans text-green-700 bg-green-50 p-2 rounded tracking-wide border border-green-100">
                      {couponSuccess}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-sans">
                      <span>Maison Subtotal</span>
                      <span className="font-mono">${cartSubtotal}</span>
                    </div>
                    {couponSuccess.includes("Applied") && (
                      <div className="flex justify-between text-xs text-green-700 font-sans font-semibold">
                        <span>Luxury Discount (20%)</span>
                        <span className="font-mono">-${Math.floor(cartSubtotal * 0.2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500 font-sans">
                      <span>DHL Express Delivery</span>
                      <span className="font-sans text-[10px] tracking-wider text-green-700 font-medium">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#1c1917] font-sans font-bold pt-1 border-t border-gray-100">
                      <span>Total Invoice</span>
                      <span className="font-mono">
                        ${couponSuccess.includes("Applied") ? Math.floor(cartSubtotal * 0.8) : cartSubtotal}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setIsCartOpen(false); onSetView("checkout"); }}
                    className="w-full py-3 bg-[#1c1917] hover:bg-[#c19273] text-white font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[9px] text-gray-400 font-sans text-center tracking-widest">
                    Secure checkout with Stripe & PayPal, certified under PCI-DSS.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. WISHLIST SIDEBAR DRAWER */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-[#1c1917]/50 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-md bg-[#fcfbfa] h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="p-6 border-b border-[#ebd8cc] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <h3 className="font-serif text-lg tracking-widest uppercase text-[#1c1917]">Your Favorites</h3>
                  <span className="text-xs font-mono text-gray-500">({wishlist.length})</span>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:text-[#c19273] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <Heart className="w-12 h-12 stroke-[1] text-gray-300" />
                    <h4 className="font-serif text-base tracking-widest text-[#1c1917] uppercase font-light">No Favorites Saved</h4>
                    <p className="text-xs text-gray-500 font-sans max-w-xs font-light">Bookmark editorial makeup shades and custom botanical serums while exploring the Maison.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-[#ebd8cc]/30 rounded-lg shadow-xs">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[9px] font-sans tracking-widest uppercase text-[#c19273] font-bold">{product.brand}</span>
                            <h4 className="text-xs font-serif text-gray-900 tracking-wide font-light line-clamp-1">{product.name}</h4>
                            <span className="text-[10px] font-mono text-gray-500">${product.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              onMoveToCart(product);
                              setIsWishlistOpen(false);
                            }}
                            className="px-2.5 py-1.5 bg-[#1c1917] text-white hover:bg-[#c19273] font-sans text-[9px] tracking-widest font-bold uppercase transition-colors"
                          >
                            Bag
                          </button>
                          <button 
                            onClick={() => onRemoveFromWishlist(product)}
                            className="p-1.5 text-gray-400 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[#ebd8cc] bg-white text-center">
                <button 
                  onClick={() => { setIsWishlistOpen(false); onSetView("shop"); }}
                  className="text-[10px] font-sans tracking-widest font-bold uppercase text-[#c19273] hover:text-[#1c1917]"
                >
                  Return to Atelier Catalog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. PREMIUM LOGIN/REGISTER MODAL OVERLAY */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthOpen(false)}
              className="absolute inset-0 bg-[#1c1917]/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#fcfbfa] w-full max-w-md p-8 shadow-2xl rounded-xl border border-[#ebd8cc] z-10 space-y-6"
            >
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-4 right-4 p-1 hover:text-[#c19273] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1.5">
                <h3 className="font-serif text-2xl tracking-widest uppercase text-[#1c1917]">
                  {isRegister ? "Join the Maison" : "Welcome Back"}
                </h3>
                <p className="text-xs text-gray-500 font-sans font-light">
                  {isRegister 
                    ? "Unlock priority dispatch, custom beauty profiling, and 100 reward points." 
                    : "Access your VIP beauty profile, order timelines, and rewards balance."}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded font-sans tracking-wide flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Your Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Charlotte Despres"
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#c19273]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Maison Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="customer@aura.com or admin@aura.com"
                      className="w-full bg-white border border-gray-200 rounded pl-9 pr-3 py-2 text-xs font-sans focus:outline-none focus:border-[#c19273]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-gray-200 rounded pl-9 pr-3 py-2 text-xs font-sans focus:outline-none focus:border-[#c19273]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-sans text-gray-500 font-light pt-1">
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="rememberMe" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="rememberMe">Remember my profile</label>
                  </div>
                  <button type="button" className="text-[#c19273] hover:underline">Forgot passcode?</button>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1c1917] hover:bg-[#c19273] text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isRegister ? "Register Membership" : "Authorize Session"}</span>
                </button>
              </form>

              <div className="border-t border-gray-100 pt-4 text-center">
                <button 
                  onClick={() => { setIsRegister(!isRegister); setAuthError(""); }}
                  className="text-[10px] font-sans tracking-widest uppercase text-gray-600 hover:text-[#c19273]"
                >
                  {isRegister ? "Have an account? Sign In" : "New to the Maison? Create Account"}
                </button>
              </div>

              <div className="bg-[#fcfaf7] p-3 rounded-lg border border-[#ebd8cc]/40 text-center space-y-1">
                <p className="text-[9px] font-sans text-gray-400 uppercase tracking-wider">Instant VIP Test Profiles</p>
                <div className="flex justify-center space-x-3 text-[10px] font-mono text-gray-600">
                  <button 
                    onClick={() => { setAuthEmail("customer@aura.com"); setAuthPassword("password"); }} 
                    className="hover:text-[#c19273] underline"
                  >
                    Customer Profile
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => { setAuthEmail("admin@aura.com"); setAuthPassword("password"); }} 
                    className="hover:text-[#c19273] underline"
                  >
                    Maison Admin
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
