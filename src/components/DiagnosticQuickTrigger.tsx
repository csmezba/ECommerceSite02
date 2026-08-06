/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Activity, ShieldAlert, Award, Star, ArrowRight, UserCheck } from "lucide-react";

interface ConcernRitual {
  id: string;
  title: string;
  subtitle: string;
  skinType: string;
  concerns: string[];
  description: string;
  highlightedProduct: string;
  highlightedProductBrand: string;
  highlightedProductImage: string;
  clinicalClaim: string;
  colorTheme: string;
}

const RITUALS: ConcernRitual[] = [
  {
    id: "radiance",
    title: "The Radiance Cure",
    subtitle: "Dullness, Dark Spots & Uneven Tone",
    skinType: "All",
    concerns: ["Dullness", "Dark Spots"],
    description: "Designed for fatigued, lackluster skin. This protocol triggers molecular cell renewal to dissolve superficial hyper-pigmentation and cast a permanent lit-from-within glow.",
    highlightedProduct: "La Rose Céleste Revitalizing Elixir Serum",
    highlightedProductBrand: "AURA LUXE",
    highlightedProductImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
    clinicalClaim: "98% experienced immediate tone illumination in consumer trials",
    colorTheme: "#C5A059"
  },
  {
    id: "sculpt",
    title: "The Lift & Sculpt Protocol",
    subtitle: "Fine Lines, Loss of Density & Contours",
    skinType: "Dry",
    concerns: ["Fine Lines", "Loss of Elasticity"],
    description: "Targeted resistance for structural sagging. Uses high-performance gold colloidal particles to reinforce matrix structures, lifting the cheeks and defining jawline contouring.",
    highlightedProduct: "Or Blanc Absolute Skin-Defense Cream",
    highlightedProductBrand: "AURA LUXE",
    highlightedProductImage: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400",
    clinicalClaim: "42% reduction in visible fine line severity in 14 days",
    colorTheme: "#E5C282"
  },
  {
    id: "defense",
    title: "The Barrier Recovery Ritual",
    subtitle: "Redness, Extreme Sensitivity & Flaking",
    skinType: "Sensitive",
    concerns: ["Redness", "Sensitivity"],
    description: "An intensive botanical wrap for compromised, reactive skin. Instantly calms heat sensations, micro-vessel redness, and fortifies lipid resistance.",
    highlightedProduct: "High-Altitude Centella Elixir",
    highlightedProductBrand: "AURA LUXE",
    highlightedProductImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400",
    clinicalClaim: "64% reduction in micro-irritation and redness index scores",
    colorTheme: "#8EA890"
  },
  {
    id: "resurface",
    title: "The Micro-Resurfacing Polish",
    subtitle: "Visible Pores, Roughness & Micro-relief",
    skinType: "Combination",
    concerns: ["Pores", "Texture Roughness"],
    description: "Gently dissolves microscopic cell accumulation without stripping precious oils. Polishes surface texture to achieve an airbrushed, velvet editorial filter finish.",
    highlightedProduct: "White Rose Micro-Peel Resurfacing Essence",
    highlightedProductBrand: "AURA LUXE",
    highlightedProductImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
    clinicalClaim: "Smoothness index improved by 76% after 3 applications",
    colorTheme: "#BFA38F"
  }
];

interface DiagnosticQuickTriggerProps {
  onStartCustomQuiz: (skinType: string, concerns: string[]) => void;
  onSetView: (view: string) => void;
}

export default function DiagnosticQuickTrigger({ onStartCustomQuiz, onSetView }: DiagnosticQuickTriggerProps) {
  const [activeTab, setActiveTab] = useState<string>("radiance");

  const current = RITUALS.find(r => r.id === activeTab) || RITUALS[0];

  return (
    <section className="py-24 bg-[#FAF9F6] border-b border-[#E5E1D8] select-none">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Content Side / Grid Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block">
              Bespoke Diagnostic Concierge
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-extralight text-[#1A1A1A] leading-tight">
              Select Your Immediate <br />
              <span className="italic font-light text-[#C5A059]">Skincare Ambition</span>
            </h2>
            <p className="text-gray-500 font-sans text-xs md:text-sm tracking-wide leading-relaxed font-light">
              Skip the guesswork. Click your primary concern profile below to view its clinical signature ritual, then activate your custom Bespoke formulation profile instantly.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-wrap gap-2.5 lg:justify-end">
            {RITUALS.map((r) => {
              const isActive = r.id === activeTab;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveTab(r.id)}
                  className={`px-5 py-3 rounded-full text-xs font-sans tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-[#1A1A1A] text-[#FAF9F6] font-medium shadow-md shadow-black/10" 
                      : "bg-white border border-[#E5E1D8] text-gray-500 hover:border-[#C5A059] hover:text-[#1A1A1A]"
                  }`}
                >
                  {r.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Panel */}
        <div className="bg-white rounded-3xl border border-[#E5E1D8] overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left side: narrative */}
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-[#C5A059] bg-[#C5A059]/5 px-3.5 py-1.5 rounded-full text-[10px] font-sans tracking-wider uppercase font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Interactive Consultation Preset</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">TARGET COMPACT</span>
                  <h3 className="font-serif text-2xl md:text-3.5xl text-[#1A1A1A] font-light leading-snug">
                    {current.title}
                  </h3>
                  <p className="text-xs font-sans text-[#C5A059] tracking-widest uppercase font-bold">
                    {current.subtitle}
                  </p>
                </div>

                <p className="text-gray-600 font-sans text-xs md:text-sm tracking-wide leading-relaxed font-light">
                  {current.description}
                </p>

                {/* Clinical Guarantee Callout */}
                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E1D8]">
                  <div className="text-[#C5A059] mt-0.5 shrink-0">
                    <Award className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block font-bold">Clinical Trial Outcome</span>
                    <span className="text-xs font-sans text-gray-600 font-light leading-relaxed">
                      {current.clinicalClaim}
                    </span>
                  </div>
                </div>
              </div>

              {/* Portal Call-to-action button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-[#E5E1D8]/50">
                <button
                  onClick={() => onStartCustomQuiz(current.skinType, current.concerns)}
                  className="px-7 py-3.5 bg-[#C5A059] hover:bg-[#1A1A1A] text-white transition-all duration-300 rounded-xl font-sans text-[10px] tracking-widest uppercase font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-[#C5A059]/20"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Start Quiz With This Concern</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSetView("shop")}
                  className="px-6 py-3.5 bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <span>Explore Direct Creations</span>
                </button>
              </div>
            </div>

            {/* Right side: product preview */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border-t lg:border-t-0 lg:border-l border-[#E5E1D8] p-8 flex flex-col justify-between items-center text-center space-y-6">
              <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-bold">RECOMMENDED SEED INITIATOR</span>
              
              <div className="relative aspect-square w-48 rounded-full overflow-hidden border border-[#E5E1D8] shadow-md bg-white">
                <img 
                  src={current.highlightedProductImage} 
                  alt={current.highlightedProduct} 
                  className="w-full h-full object-cover p-2 rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] tracking-widest text-[#C5A059] font-sans font-bold uppercase block">{current.highlightedProductBrand}</span>
                <h4 className="font-serif text-sm font-medium text-gray-800 tracking-wide">
                  {current.highlightedProduct}
                </h4>
              </div>

              <div className="flex items-center justify-center space-x-1 text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[10px] font-sans text-gray-500 font-medium ml-1">5.0 Star Formulation</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
