/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Compass, Shield, ArrowRight, Dna, FlaskConical } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  origin: string;
  extractionMethod: string;
  clinicalStat: string;
  clinicalLabel: string;
  benefits: string[];
  description: string;
  image: string;
  matchedCategory: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    id: "rose-stem",
    name: "White Rose Cellular Clones",
    scientificName: "Rosa Alba Leaf Cell Extract",
    category: "Cellular Regeneration",
    origin: "Grasse, France",
    extractionMethod: "Supercritical Fluid Extraction & Cold Centrifugation",
    clinicalStat: "+340%",
    clinicalLabel: "Dermal Lipid Synthesis Boost",
    benefits: [
      "Stimulates core cellular respiration and cell life cycle",
      "Accelerates barrier recovery by reproducing essential ceramides",
      "Re-densifies deep wrinkles and restores natural light refraction"
    ],
    description: "Hand-picked at dawn when cells are most resilient, our botanical White Rose clones undergo sterile vacuum isolation. Each molecular drop locks in powerful anti-inflammatory plant peptides that mirror skin's native protein matrices.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    matchedCategory: "Skincare"
  },
  {
    id: "colloidal-gold",
    name: "24K Colloidal Gold",
    scientificName: "Aurum Metallicum Nano-Suspension",
    category: "Micro-Circulation & Luminosity",
    origin: "Valais Alps, Switzerland",
    extractionMethod: "High-voltage Aqueous Laser Ablation",
    clinicalStat: "100%",
    clinicalLabel: "Free-Radical Shield Protection",
    benefits: [
      "Reflects ambient light at an index that blurs facial contours and wrinkles",
      "Enhances deep absorption of active multi-peptides",
      "Calms micro-inflammation and cellular oxidative stress"
    ],
    description: "Suspended in purified Alpine mineral water, pure 24-karat gold atoms act as premium catalytic transmitters. They stimulate skin's electrical properties to activate natural collagen creation while giving an immediate, majestic editorial satin shimmer.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800",
    matchedCategory: "Skincare"
  },
  {
    id: "vanilla-orchid",
    name: "Vanilla Planifolia Orchid Nectar",
    scientificName: "Vanilla Planifolia Fruit Extract",
    category: "Anti-Oxidative Sovereignty",
    origin: "Ambanja, Madagascar",
    extractionMethod: "Polykaryon Molecular Fractioning",
    clinicalStat: "-48%",
    clinicalLabel: "Age-Induced Fatigue Severity",
    benefits: [
      "Halts the breakdown of extracellular structures from environmental stressors",
      "Locks in deep, velvet lipid moisture for 72-hour comfort",
      "Infuses a rich, luxurious olfactory trail that calms user sensory pathways"
    ],
    description: "The Vanilla Orchid flowers only once a year for a single morning. Our botanists manually pollinate each flower to extract a concentrated juice containing rare polyketones—natural molecules that restart cellular lifespan clock genes.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
    matchedCategory: "Fragrance"
  },
  {
    id: "centella-cica",
    name: "High-Altitude Centella Elixir",
    scientificName: "Centella Asiatica Peptide Infusion",
    category: "Barrier Defense & Deep Repair",
    origin: "Himalayan Foothills, Nepal",
    extractionMethod: "Ultrasonic Cavitation Extraction",
    clinicalStat: "-64%",
    clinicalLabel: "Redness & Micro-Irritation Index",
    benefits: [
      "Provides instant comfort to sensitive skin types",
      "Accelerates healing of environmental micro-tears",
      "Reduces hyper-pigmentation and dark spots left by sun exposure"
    ],
    description: "Harvested at altitudes over 3,000 meters, this extreme-weather botanical survives immense UV strain. The resulting sap holds concentrated asiaticosides, which fortify cellular resistance, leaving skin perfectly calm and uniformly tone-balanced.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
    matchedCategory: "Skincare"
  }
];

interface IngredientLibraryProps {
  onSetCategory: (cat: string) => void;
  onSetView: (view: string) => void;
}

export default function IngredientLibrary({ onSetCategory, onSetView }: IngredientLibraryProps) {
  const [selectedId, setSelectedId] = useState<string>(INGREDIENTS[0].id);

  const active = INGREDIENTS.find(i => i.id === selectedId) || INGREDIENTS[0];

  return (
    <section className="py-24 bg-white border-y border-[#E5E1D8] select-none overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Header Block */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 text-[#C5A059]">
            <FlaskConical className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase font-bold">Scientific Alchemy</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-extralight text-[#1A1A1A] leading-tight">
            The Rare Botanical <span className="italic font-light text-[#C5A059]">Active Library</span>
          </h2>
          <p className="text-gray-500 font-sans text-xs md:text-sm tracking-wide max-w-2xl mx-auto font-light leading-relaxed">
            We scour remote micro-climates to isolate unique plant cells that endure extreme natural forces. 
            Explore the clinical science and pristine origins behind our master formulations.
          </p>
        </div>

        {/* Interactive Layout: Side Selector Grid + Large Detail Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Vertical Carousel Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="space-y-3.5">
              {INGREDIENTS.map((ing) => {
                const isSelected = ing.id === selectedId;
                return (
                  <button
                    key={ing.id}
                    onClick={() => setSelectedId(ing.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                      isSelected 
                        ? "bg-[#FAF9F6] border-[#C5A059] shadow-md shadow-[#C5A059]/5" 
                        : "bg-white border-[#E5E1D8] hover:border-[#C5A059]/50"
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <span className={`text-[9px] tracking-widest font-sans font-bold uppercase transition-colors ${
                        isSelected ? "text-[#C5A059]" : "text-gray-400 group-hover:text-gray-600"
                      }`}>
                        {ing.category}
                      </span>
                      <h4 className="font-serif text-base text-[#1A1A1A] font-light leading-snug group-hover:text-[#C5A059] transition-colors">
                        {ing.name}
                      </h4>
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isSelected 
                        ? "bg-[#C5A059] border-[#C5A059] text-white" 
                        : "bg-transparent border-[#E5E1D8] text-[#1A1A1A] group-hover:border-gray-400"
                    }`}>
                      <ChevronArrow isSelected={isSelected} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Fact Bento Box */}
            <div className="p-6 bg-[#C5A059]/5 border border-[#C5A059]/25 rounded-2xl space-y-3.5 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 text-[#C5A059]">
                <Shield className="w-4.5 h-4.5" />
                <span className="font-serif text-xs font-semibold tracking-wide">Purity Safeguard Protocol</span>
              </div>
              <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                All bio-actives undergo quadruple extraction inside sterilized Class-100 environmental cleanrooms. 
                Zero chemical additives, synthetic colorants, or heavy emulsifiers are ever introduced.
              </p>
            </div>
          </div>

          {/* Right Column: Immersive Detailed Presentation Card */}
          <div className="lg:col-span-8 bg-[#FAF9F6] border border-[#E5E1D8] rounded-3xl p-6 md:p-9 flex flex-col justify-between shadow-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch h-full"
              >
                {/* Visual Half */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 text-xs text-[#C5A059]">
                      <Compass className="w-4 h-4 animate-spin-slow text-[#C5A059]" />
                      <span className="font-sans font-bold tracking-widest uppercase text-[10px]">{active.origin}</span>
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] font-extralight leading-tight">
                      {active.name}
                    </h3>

                    <p className="text-xs text-gray-500 font-mono italic">
                      {active.scientificName}
                    </p>

                    <p className="text-gray-600 text-xs md:text-sm font-sans tracking-wide leading-relaxed font-light">
                      {active.description}
                    </p>
                  </div>

                  {/* Extraction details panel */}
                  <div className="p-4 bg-white border border-[#E5E1D8] rounded-xl space-y-1">
                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 block font-bold">Extraction Method</span>
                    <span className="text-[10px] font-sans tracking-wide text-[#1A1A1A] font-medium leading-relaxed">
                      {active.extractionMethod}
                    </span>
                  </div>
                </div>

                {/* Technical / Stat Half */}
                <div className="flex flex-col justify-between space-y-6">
                  {/* Photo with beautiful overlay details */}
                  <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-md border border-[#E5E1D8]">
                    <img 
                      src={active.image} 
                      alt={active.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Clinical trial badge floating on image */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl flex items-center space-x-3 shadow-lg">
                      <div className="bg-[#C5A059]/10 p-2 rounded-lg text-[#C5A059]">
                        <Dna className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-serif text-xl font-bold text-[#1A1A1A] leading-none block">{active.clinicalStat}</span>
                        <span className="text-[8px] font-sans tracking-widest text-gray-500 uppercase font-bold">{active.clinicalLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scientific actions list */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-gray-400 font-bold block">Biomimetic Mechanism</span>
                    <div className="space-y-2.5">
                      {active.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs text-gray-600 font-light leading-normal">
                          <span className="text-[#C5A059] mt-0.5"><Sparkles className="w-3 h-3" /></span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={() => {
                      onSetCategory(active.matchedCategory);
                      onSetView("shop");
                    }}
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white transition-all duration-300 rounded-xl font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-[#C5A059]/20 group"
                  >
                    <span>Formulations using this active</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

function ChevronArrow({ isSelected }: { isSelected: boolean }) {
  return (
    <svg 
      className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? "rotate-90" : "group-hover:translate-x-0.5"}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
    </svg>
  );
}
