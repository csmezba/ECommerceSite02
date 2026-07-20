/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key | any;
  product: Product;
  wishlist: Product[];
  onAddToCart: (product: Product, quantity: number, color?: { name: string; hex: string }, size?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onSetView: (view: string, targetId?: string) => void;
}

export default function ProductCard({
  product,
  wishlist,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onSetView
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.some(w => w.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      onRemoveFromWishlist(product);
    } else {
      onAddToWishlist(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use default color or size if available, or just standard product add
    const defaultColor = product.colors ? product.colors[0] : undefined;
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    onAddToCart(product, 1, defaultColor, defaultSize);
  };

  const isSale = product.isFlashSale && product.flashSalePrice;

  return (
    <div 
      className="group relative bg-white border border-[#E5E1D8] hover:border-[#C5A059] rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Card Header Media area */}
      <div 
        onClick={() => onSetView("details", product.id)}
        className="relative aspect-square w-full overflow-hidden cursor-pointer bg-neutral-50"
      >
        
        {/* Main Product Image / Secondary Swap on Hover */}
        <img 
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist floating trigger */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-red-500 transition-all shadow-md z-10 cursor-pointer"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "text-red-500 fill-red-500" : "stroke-gray-500"
            }`} 
          />
        </button>

        {/* Special Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 font-sans text-[8px] uppercase tracking-widest font-bold">
          {product.isBestSeller && (
            <span className="bg-[#1A1A1A] text-[#FAF9F6] px-2 py-0.5 rounded shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C5A059] text-white px-2 py-0.5 rounded shadow-sm">
              New Arrival
            </span>
          )}
          {isSale && (
            <span className="bg-red-700 text-white px-2 py-0.5 rounded shadow-sm">
              Flash Sale
            </span>
          )}
          {product.spf && (
            <span className="bg-[#FAF9F6] border border-[#E5E1D8] text-[#1A1A1A] px-2 py-0.5 rounded shadow-sm">
              {product.spf}
            </span>
          )}
        </div>

        {/* Slide-Up Action Bar (Quick Actions) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between space-x-2 z-10">
          <button 
            onClick={() => onSetView("details", product.id)}
            className="flex-1 py-2 bg-white hover:bg-[#C5A059] text-[#1A1A1A] hover:text-white font-sans text-[9px] tracking-widest font-bold uppercase rounded flex items-center justify-center space-x-1 transition-all cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>
          
          <button 
            onClick={handleQuickAdd}
            className="p-2 bg-[#C5A059] hover:bg-white text-white hover:text-[#C5A059] rounded border border-[#C5A059] transition-all cursor-pointer"
            aria-label="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Card Details Body area */}
      <div 
        onClick={() => onSetView("details", product.id)}
        className="p-4 space-y-2 cursor-pointer flex-1 flex flex-col justify-between bg-white select-none"
      >
        
        <div className="space-y-1">
          {/* Brand and organic labels */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-sans tracking-[0.2em] uppercase font-semibold text-[#C5A059]">
              {product.brand}
            </span>
            <div className="flex space-x-1">
              {product.isVegan && (
                <span className="text-[7px] font-sans tracking-wider uppercase font-bold text-green-700 bg-green-50 px-1 rounded">V</span>
              )}
              {product.isCrueltyFree && (
                <span className="text-[7px] font-sans tracking-wider uppercase font-bold text-sky-700 bg-sky-50 px-1 rounded">CF</span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm text-[#1A1A1A] tracking-wide leading-tight line-clamp-1 group-hover:text-[#C5A059] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          {/* Stars */}
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-sans font-medium text-gray-700">
              {product.rating}
            </span>
            <span className="text-[8px] text-gray-400">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-1.5">
            {product.originalPrice && (
              <span className="text-[10px] font-mono text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-xs font-mono text-[#1A1A1A] font-semibold">
              ${isSale ? product.flashSalePrice : product.price}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
