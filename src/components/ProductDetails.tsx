/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, 
  Check, Sparkles, MessageSquare, Image, Plus, HelpCircle
} from "lucide-react";
import { Product, Review, CartItem } from "../types";

interface ProductDetailsProps {
  productId: string;
  products: Product[];
  wishlist: Product[];
  onAddToCart: (product: Product, quantity: number, color?: { name: string; hex: string }, size?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onSetView: (view: string, targetId?: string) => void;
}

export default function ProductDetails({
  productId,
  products,
  wishlist,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onSetView
}: ProductDetailsProps) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="py-32 text-center space-y-4 font-sans select-none">
        <h2 className="text-xl font-serif">Creation Not Found</h2>
        <p className="text-gray-500 text-xs">Pardon, chérie, we cannot locate this formulation in our current atelier catalogs.</p>
        <button 
          onClick={() => onSetView("shop")}
          className="px-6 py-2 bg-[#1c1917] text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-[#c19273]"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Gallery State
  const [activeImg, setActiveImg] = useState(product.image);
  
  // Custom Product Selections
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : undefined);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse" | "benefits">("description");

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const isWishlisted = wishlist.some(w => w.id === product.id);

  // Fetch reviews from server
  useEffect(() => {
    setActiveImg(product.image);
    setSelectedColor(product.colors ? product.colors[0] : undefined);
    setSelectedSize(product.sizes ? product.sizes[0] : undefined);
    setQuantity(1);
    setReviewSuccess("");

    fetch(`/api/reviews/${product.id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error loading product reviews:", err));
  }, [productId, product]);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      onRemoveFromWishlist(product);
    } else {
      onAddToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    const payload = {
      productId: product.id,
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true,
      images: reviewImage ? [reviewImage] : []
    };

    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(newReview => {
        setReviews(prev => [newReview, ...prev]);
        setReviewerName("");
        setReviewComment("");
        setReviewImage("");
        setReviewSuccess("Merci, chérie! Your verified luxury review was added to our registries.");
      })
      .catch(err => console.error("Error creating review:", err));
  };

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isSale = product.isFlashSale && product.flashSalePrice;
  const currentPrice = isSale ? product.flashSalePrice! : product.price;

  return (
    <div className="py-28 max-w-7xl mx-auto px-6 space-y-16 select-none font-sans">
      
      {/* Breadcrumb */}
      <div className="text-[10px] tracking-widest text-gray-400 uppercase flex items-center space-x-2">
        <span className="cursor-pointer hover:text-[#C5A059]" onClick={() => onSetView("home")}>Maison</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[#C5A059]" onClick={() => onSetView("shop")}>{product.category}</span>
        <span>/</span>
        <span className="text-[#1A1A1A]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN - GALLERY */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          {/* Thumbnails */}
          <div className="col-span-2 flex flex-col space-y-3">
            <button 
              onClick={() => setActiveImg(product.image)}
              className={`aspect-square border rounded-md overflow-hidden bg-neutral-50 transition-all ${activeImg === product.image ? "border-[#c19273] ring-1 ring-[#c19273]" : "border-gray-200"}`}
            >
              <img src={product.image} alt="Thumbnail Primary" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
            {product.hoverImage && (
              <button 
                onClick={() => setActiveImg(product.hoverImage)}
                className={`aspect-square border rounded-md overflow-hidden bg-neutral-50 transition-all ${activeImg === product.hoverImage ? "border-[#c19273] ring-1 ring-[#c19273]" : "border-gray-200"}`}
              >
                <img src={product.hoverImage} alt="Thumbnail Hover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            )}
            {/* Hardcoded detail thumbnail to satisfy luxury photoshoot criteria */}
            <button 
              onClick={() => setActiveImg("https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600")}
              className={`aspect-square border rounded-md overflow-hidden bg-neutral-50 transition-all ${activeImg.includes("512290923902") ? "border-[#c19273] ring-1 ring-[#c19273]" : "border-gray-200"}`}
            >
              <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600" alt="Thumbnail Studio Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          </div>

          {/* Active Big Image */}
          <div className="col-span-10 relative aspect-[4/5] bg-[#FAF9F6] border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-md">
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isSale && (
              <span className="absolute top-4 left-4 bg-red-700 text-white text-[10px] tracking-widest uppercase font-bold py-1 px-3 rounded shadow-md">
                FLASH DISCOUNT ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - PURCHASE CONFIGURATIONS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">{product.brand}</span>
            <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-[#1A1A1A] leading-tight">{product.name}</h1>
            
            {/* Rating summary */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500 hover:underline cursor-pointer">{reviews.length} Verified Reviews</span>
            </div>
          </div>

          {/* Pricing tier */}
          <div className="py-4 border-y border-[#E5E1D8] flex items-center space-x-4">
            {product.originalPrice && (
              <span className="text-sm font-mono text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-2xl font-mono text-[#1A1A1A] font-bold">
              ${currentPrice}
            </span>
            <span className="text-[10px] text-green-700 bg-green-50 py-1 px-2.5 rounded uppercase font-bold tracking-widest font-sans">
              In Stock & ready to ship
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light font-sans">
            {product.description}
          </p>

          {/* IF colors exist (Makeup) */}
          {product.colors && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="tracking-widest uppercase text-gray-500 font-bold">Select Custom Shade</span>
                  <span className="text-[#C5A059] font-medium">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform relative cursor-pointer ${
                        selectedColor?.name === color.name ? "border-[#C5A059] scale-110" : "border-transparent hover:scale-105"
                      }`}
                      title={color.name}
                    >
                      <span 
                        className="absolute inset-0.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Seamless AI Shade Finder CTA card */}
              <div className="p-4 border border-[#C5A059]/30 bg-[#C5A059]/5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-[#C5A059]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="font-serif font-semibold tracking-wide">Unsure of your perfect match?</span>
                </div>
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                  Let our biometric AI Shade Finder analyze your skin undertones or process a natural selfie to select your exact coordinate with a 100% Match Guarantee.
                </p>
                <button 
                  onClick={() => onSetView("shade-finder")}
                  className="text-[9px] font-sans tracking-widest uppercase font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open AI Shade Finder</span>
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* IF sizes exist (Skincare / Fragrances) */}
          {product.sizes && (
            <div className="space-y-2.5">
              <span className="text-xs tracking-widest uppercase text-gray-500 font-bold">Select Bottle Volume</span>
              <div className="flex items-center space-x-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-mono rounded border transition-all cursor-pointer ${
                      selectedSize === size 
                        ? "border-[#C5A059] bg-[#FAF9F6] text-[#C5A059] font-semibold" 
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity stepper & triggers */}
          <div className="flex items-stretch space-x-4 pt-4">
            
            {/* Stepper */}
            <div className="flex items-center border border-gray-200 rounded">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 font-mono text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

            {/* Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#FAF9F6] font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag • ${(currentPrice * quantity)}</span>
            </button>

            {/* Wishlist Heart */}
            <button
              onClick={handleWishlistToggle}
              className={`p-3 border rounded transition-all cursor-pointer ${
                isWishlisted 
                  ? "border-red-200 bg-red-50 text-red-500" 
                  : "border-gray-200 hover:border-gray-400 text-gray-500"
              }`}
              aria-label="Wishlist Bookmark"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
            </button>

          </div>

          {/* Logistics highlights bento */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 text-[11px] text-gray-500">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Complementary DHL Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-[#C5A059]" />
              <span>30-Day Sealed Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>100% Certified Formula</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Award-Winning Quality</span>
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED SPECIFICATIONS TABS */}
      <div className="border-t border-[#E5E1D8] pt-10">
        <div className="flex border-b border-gray-100 space-x-8 text-xs font-sans tracking-widest uppercase font-semibold text-gray-400">
          <button 
            onClick={() => setActiveTab("description")}
            className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "description" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
          >
            The Ritual Details
          </button>
          <button 
            onClick={() => setActiveTab("ingredients")}
            className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "ingredients" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
          >
            Full Ingredients
          </button>
          <button 
            onClick={() => setActiveTab("howToUse")}
            className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "howToUse" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
          >
            How to Apply
          </button>
          <button 
            onClick={() => setActiveTab("benefits")}
            className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "benefits" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
          >
            Primary Benefits
          </button>
        </div>

        <div className="py-8 max-w-4xl text-gray-600 text-xs md:text-sm leading-relaxed font-light">
          {activeTab === "description" && (
            <p className="font-sans leading-loose">{product.description} Hand-crafted with organic lipids and trace gold elements in Grasse, France to elevate your self-care regime into a sacred meditation ritual.</p>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <p className="font-sans font-semibold text-gray-900 uppercase tracking-widest text-[10px]">Pure Active Bio-Complex Formula:</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map(ing => (
                  <span key={ing} className="bg-gray-100 text-gray-800 py-1.5 px-3 rounded-full text-xs font-sans font-light">
                    {ing}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 italic">Certified organic, clean, gluten-free, and formulated entirely without formaldehyde donors or synthetic fragrance carriers.</p>
            </div>
          )}

          {activeTab === "howToUse" && (
            <p className="font-sans leading-loose">{product.howToUse}</p>
          )}

          {activeTab === "benefits" && (
            <ul className="space-y-3">
              {product.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-gray-700 font-sans">
                  <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* VERIFIED CUSTOMER REVIEWS PORTAL */}
      <div className="border-t border-[#ebd8cc]/40 pt-12 space-y-10">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl tracking-wider text-gray-900 uppercase">Verified Reviews</h3>
            <p className="text-xs text-gray-500 font-sans font-light">Honest photography and video chronicles provided by our beauty members.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-[#fcfaf7] border border-[#ebd8cc]/40 rounded-xl text-center">
              <span className="font-serif text-3xl text-gray-900 font-bold block">{product.rating}</span>
              <span className="text-[8px] font-sans text-gray-500 uppercase tracking-widest">Out of 5 Stars</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-800">{reviews.length} total members voted</span>
              <div className="text-[10px] text-gray-400 font-sans">99% would recommend to a close confidant</div>
            </div>
          </div>
        </div>

        {/* List of Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews column */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-xs italic font-sans font-light">Be the first to leave a verified purchase review for this custom formulation.</p>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="p-5 bg-white border border-gray-100 rounded-xl space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {rev.userAvatar ? (
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-900 font-sans">{rev.userName}</h5>
                        <div className="flex items-center space-x-1.5 text-[9px] text-gray-400 font-sans">
                          <span>{rev.date}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase font-bold flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3 inline" />
                              <span>Verified Client</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-sans font-light">{rev.comment}</p>

                  {/* Review Images */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex space-x-2 pt-2">
                      {rev.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="Review attachment" 
                          className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form write review column */}
          <div className="lg:col-span-5 bg-[#fcfbfa] border border-[#ebd8cc]/40 p-6 rounded-2xl space-y-4">
            <h4 className="font-serif text-sm tracking-widest text-[#1c1917] uppercase">Share Your Experience</h4>
            
            {reviewSuccess && (
              <p className="p-3 bg-green-50 border border-green-100 text-green-800 text-xs rounded font-sans">
                {reviewSuccess}
              </p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Your Signature Name</label>
                <input 
                  type="text" 
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Marie Laurent"
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Rating Verdict</label>
                <select 
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                >
                  <option value={5}>5 Stars - Exquisite perfection</option>
                  <option value={4}>4 Stars - High quality luxury</option>
                  <option value={3}>3 Stars - Decent, but lacks lustre</option>
                  <option value={2}>2 Stars - Subpar experience</option>
                  <option value={1}>1 Star - Dissatisfied entirely</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Your Review Commentary</label>
                <textarea 
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us how the serum, matte lipstick, or Eau de Parfum evolves on your skin..."
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-sans tracking-widest text-gray-500 uppercase font-semibold">Link Customer Photo URL (Optional)</label>
                <input 
                  type="url" 
                  value={reviewImage}
                  onChange={(e) => setReviewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#1c1917] hover:bg-[#c19273] text-[#fcfbfa] font-sans text-[10px] tracking-widest uppercase font-semibold rounded cursor-pointer transition-colors"
              >
                Submit Luxury Verdict
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* SIMILAR PRODUCTS SEGMENT */}
      {similarProducts.length > 0 && (
        <div className="border-t border-[#ebd8cc]/40 pt-12 space-y-6">
          <h3 className="font-serif text-lg tracking-wider text-gray-900 uppercase">You May Also Admire</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => onSetView("details", prod.id)}
                className="group border border-[#ebd8cc]/20 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all space-y-2 bg-white pb-3"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="px-3 space-y-1 text-center">
                  <span className="text-[8px] font-sans tracking-widest uppercase text-[#c19273] font-bold">{prod.brand}</span>
                  <h4 className="text-xs font-serif text-gray-800 line-clamp-1">{prod.name}</h4>
                  <span className="text-xs font-mono font-semibold text-gray-900">${prod.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
