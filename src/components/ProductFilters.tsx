/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, SlidersHorizontal, RefreshCw, Grid, List } from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  onSetSearchQuery: (query: string) => void;
  selectedCategory: string;
  onSetSelectedCategory: (category: string) => void;
  selectedSkinType: string;
  onSetSelectedSkinType: (type: string) => void;
  priceBucket: string;
  onSetPriceBucket: (bucket: string) => void;
  ethicalFilters: { vegan: boolean; crueltyFree: boolean; organic: boolean };
  onToggleEthicalFilter: (key: "vegan" | "crueltyFree" | "organic") => void;
  sortBy: string;
  onSetSortBy: (sort: string) => void;
  onResetFilters: () => void;
  viewMode: "grid" | "list";
  onSetViewMode: (mode: "grid" | "list") => void;
  activeCount: number;
}

const CATEGORIES = ["All", "Skincare", "Makeup", "Fragrance", "Haircare", "Bodycare", "Beauty Tools"];
const SKIN_TYPES = ["All", "Dry", "Oily", "Sensitive", "Combination"];
const PRICE_BUCKETS = [
  { id: "all", label: "All Prices" },
  { id: "under-50", label: "Under $50" },
  { id: "50-100", label: "$50 to $100" },
  { id: "100-200", label: "$100 to $200" },
  { id: "over-200", label: "Over $200" }
];

export default function ProductFilters({
  searchQuery,
  onSetSearchQuery,
  selectedCategory,
  onSetSelectedCategory,
  selectedSkinType,
  onSetSelectedSkinType,
  priceBucket,
  onSetPriceBucket,
  ethicalFilters,
  onToggleEthicalFilter,
  sortBy,
  onSetSortBy,
  onResetFilters,
  viewMode,
  onSetViewMode,
  activeCount
}: ProductFiltersProps) {
  return (
    <aside className="space-y-6 lg:border-r lg:border-[#E5E1D8] lg:pr-6 select-none font-sans">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-sm tracking-widest uppercase text-[#1A1A1A] font-semibold">Refine Selection</h3>
        </div>
        <button 
          onClick={onResetFilters}
          className="flex items-center space-x-1 text-[10px] tracking-widest uppercase text-gray-500 hover:text-[#C5A059]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Results summary for Mobile */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Displaying <strong>{activeCount}</strong> Creations</span>
        
        {/* Grid/List Toggle */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onSetViewMode("grid")}
            className={`p-1.5 rounded cursor-pointer ${viewMode === "grid" ? "bg-[#C5A059]/15 text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onSetViewMode("list")}
            className={`p-1.5 rounded cursor-pointer ${viewMode === "list" ? "bg-[#C5A059]/15 text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Dynamic Text Search */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Aura Formulation Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSetSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full bg-white border border-gray-200 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* 2. Sorting select */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Sort Catalog By</label>
        <select 
          value={sortBy}
          onChange={(e) => onSetSortBy(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
        >
          <option value="featured">Featured Creations</option>
          <option value="price-low-to-high">Price: Low to High</option>
          <option value="price-high-to-low">Price: High to Low</option>
          <option value="rating">Highest Customer Rated</option>
          <option value="newest">New Arrivals First</option>
        </select>
      </div>

      {/* 3. Category Filter */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Maison Categories</label>
        <div className="flex flex-col space-y-1.5">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => onSetSelectedCategory(category)}
              className={`text-left text-xs py-1 px-2 rounded-md transition-all cursor-pointer ${
                (selectedCategory === category) 
                  ? "bg-[#C5A059]/15 text-[#C5A059] font-semibold" 
                  : "text-gray-600 hover:text-[#C5A059] hover:translate-x-1"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Skin Type Filter */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Skin Physiology</label>
        <div className="grid grid-cols-2 gap-1.5">
          {SKIN_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onSetSelectedSkinType(type)}
              className={`text-center text-[11px] py-2 rounded border transition-all cursor-pointer ${
                selectedSkinType === type 
                  ? "border-[#C5A059] bg-[#FAF9F6] text-[#C5A059] font-medium" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Price Bucket Filter */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Price Invoicing</label>
        <div className="space-y-1.5">
          {PRICE_BUCKETS.map(bucket => (
            <label key={bucket.id} className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer select-none">
              <input 
                type="radio"
                name="priceBucket"
                checked={priceBucket === bucket.id}
                onChange={() => onSetPriceBucket(bucket.id)}
                className="accent-[#C5A059] text-[#C5A059]"
              />
              <span>{bucket.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. Ethical Facets (Vegan, CrueltyFree, Organic) */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Ethical Standards</label>
        <div className="space-y-2 pt-1">
          
          <label className="flex items-center space-x-2.5 text-xs text-gray-600 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={ethicalFilters.vegan}
              onChange={() => onToggleEthicalFilter("vegan")}
              className="rounded border-gray-300 accent-[#C5A059] text-[#C5A059]"
            />
            <span>Vegan Formulations Only</span>
          </label>

          <label className="flex items-center space-x-2.5 text-xs text-gray-600 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={ethicalFilters.crueltyFree}
              onChange={() => onToggleEthicalFilter("crueltyFree")}
              className="rounded border-gray-300 accent-[#C5A059] text-[#C5A059]"
            />
            <span>100% Cruelty-Free certified</span>
          </label>

          <label className="flex items-center space-x-2.5 text-xs text-gray-600 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={ethicalFilters.organic}
              onChange={() => onToggleEthicalFilter("organic")}
              className="rounded border-gray-300 accent-[#C5A059] text-[#C5A059]"
            />
            <span>Certified Organic Botanical base</span>
          </label>

        </div>
      </div>

    </aside>
  );
}
