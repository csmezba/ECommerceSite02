/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";

interface HeroProps {
  onSetView: (view: string) => void;
  onOpenChat: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1800",
    subtitle: "REGENERATIVE CLINICAL BIOLOGY",
    title: "La Rose Céleste",
    accent: "Elixir Ritual",
    description: "Infused with botanical white rose cells and micro-infused multi-peptides to achieve an immediate, pristine, lit-from-within editorial glow.",
    ctaText: "Discover the Elixir",
    action: "shop"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1800",
    subtitle: "24K GOLD CELLULAR RESISTANCE",
    title: "Absolute Gold",
    accent: "Or Blanc Cream",
    description: "Stimulate natural cellular respiration and fortify your moisture barrier against micro-pollutants with our gold-infused sovereign cream.",
    ctaText: "Explore Or Blanc",
    action: "shop"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1800",
    subtitle: "COUTURE SCENT OF THE SOVEREIGN WOMAN",
    title: "L'Ambre Impérial",
    accent: "Eau De Parfum",
    description: "An intoxicating, mysterious sensory narrative weaving Madagascan vanilla, velvet jasmine, and warm botanical amber.",
    ctaText: "Sample the Scent",
    action: "shop"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1800",
    subtitle: "HIGH-PIGMENT BOTANICAL COUTURE",
    title: "Le Rouge Vibrant",
    accent: "Couture Velvet Lip",
    description: "Enriched with wild pomegranate flower nectar and organic camellia oil for vivid, ultra-nourishing satin color.",
    ctaText: "Discover Couture Colors",
    action: "shop"
  }
];

export default function Hero({ onSetView, onOpenChat }: HeroProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentIdx];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A1A1A] select-none">
      
      {/* Background Images with Zoom Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.72 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {/* Elegant Radial Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette bg-gradient-to-t from-[#0D0D0D] via-[#1A1A1A]/25 to-transparent" />

      {/* Hero Content Container */}
      <div className="relative h-full max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6 flex flex-col justify-center z-10">
        
        <div className="max-w-2xl space-y-6 pt-16">
          
          {/* Animated Subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`sub-${slide.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center space-x-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[#C5A059] font-medium uppercase">
                {slide.subtitle}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Large Serif Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${slide.id}`}
              initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h1 className="font-serif text-5xl md:text-7xl font-extralight text-white leading-tight tracking-wide">
                {slide.title}
              </h1>
              <h2 className="font-serif italic text-3xl md:text-4xl text-[#C5A059] font-light">
                {slide.accent}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Narrative Text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${slide.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-gray-300 font-sans text-xs md:text-sm tracking-wide leading-relaxed font-light"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          {/* Action CTAs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${slide.id}`}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                onClick={() => onSetView(slide.action)}
                className="px-8 py-3.5 bg-[#FAF9F6] hover:bg-[#C5A059] text-[#1A1A1A] hover:text-white transition-all duration-300 rounded-xs font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-[#C5A059]/30 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white transition-all duration-300 rounded-xs font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
                <span>AI Consult Ritual</span>
              </button>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Slide Navigation Dots / Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-20">
        {HERO_SLIDES.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(index)}
            className="group flex items-center space-x-2 py-2 cursor-pointer"
            aria-label={`Slide ${index + 1}`}
          >
            <div className={`transition-all duration-500 h-1 rounded-full ${
              currentIdx === index ? "w-8 bg-[#C5A059]" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`} />
          </button>
        ))}
      </div>

      {/* Floating features ticker at the absolute bottom of the Hero section */}
      <div className="absolute bottom-0 left-0 w-full bg-[#1A1A1A]/80 backdrop-blur-md py-4 border-t border-white/5 z-20 hidden lg:block">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-3 gap-8">
          <div className="flex items-center space-x-3 text-white/80">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] stroke-[1.5]" />
            <span className="text-[10px] font-sans tracking-widest uppercase font-light">100% Certified Allergen-Free</span>
          </div>
          <div className="flex items-center space-x-3 text-white/80">
            <Compass className="w-4 h-4 text-[#C5A059] stroke-[1.5]" />
            <span className="text-[10px] font-sans tracking-widest uppercase font-light">Grasse Floral Cell Extraction</span>
          </div>
          <div className="flex items-center space-x-3 text-white/80">
            <Sparkles className="w-4 h-4 text-[#C5A059] stroke-[1.5]" />
            <span className="text-[10px] font-sans tracking-widest uppercase font-light">Bespoke AI Formulation Match</span>
          </div>
        </div>
      </div>

    </section>
  );
}
