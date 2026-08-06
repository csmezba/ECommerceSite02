/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BeforeAfterShowcase() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-24 bg-[#FAF9F6] border-y border-[#E5E1D8] overflow-hidden select-none">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Editorial Text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#C5A059] uppercase font-bold">Clinical Case Studies</span>
            <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
            <span className="text-[10px] font-sans text-green-700 tracking-wider font-semibold uppercase">Organic Science</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-tight font-extralight tracking-wide">
            Visible Cellular <br />
            <span className="italic font-light text-[#C5A059]">Regeneration in 14 Days</span>
          </h2>

          <p className="text-gray-600 font-sans text-xs md:text-sm tracking-wide leading-relaxed font-light">
            Slide the interactive timeline slider to view clinical test results. Our independent trial of 150 subjects demonstrated significant improvements in facial contours, hydration, and tone uniformization.
          </p>

          {/* Test Statistics bento */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white border border-[#E5E1D8] rounded-lg">
              <span className="font-serif text-3xl text-[#1A1A1A] font-light block">+98%</span>
              <span className="text-[9px] font-sans tracking-widest text-gray-500 uppercase">Immediate Cellular Hydration</span>
            </div>
            <div className="p-4 bg-white border border-[#E5E1D8] rounded-lg">
              <span className="font-serif text-3xl text-[#1A1A1A] font-light block">-42%</span>
              <span className="text-[9px] font-sans tracking-widest text-gray-500 uppercase">Fine Lines Severity Reduction</span>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-xs font-sans text-gray-500 italic">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Formulated naturally without synthetic fillers or artificial parabens.</span>
          </div>
        </div>

        {/* Right Column - Interactive Slider Stage */}
        <div className="lg:col-span-7 flex justify-center">
          <div 
            ref={containerRef}
            className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            
            {/* Before Label (Left Side) */}
            <div className="absolute top-4 left-4 z-20 bg-[#1A1A1A]/70 text-white text-[9px] tracking-widest uppercase py-1 px-2.5 rounded backdrop-blur-xs font-sans">
              Pre-Ritual: Dryness & Dullness
            </div>

            {/* After Label (Right Side) */}
            <div className="absolute top-4 right-4 z-20 bg-[#C5A059]/85 text-white text-[9px] tracking-widest uppercase py-1 px-2.5 rounded backdrop-blur-xs font-sans">
              Day 14: Cellular Radiance Active
            </div>

            {/* AFTER IMAGE (Background, always fully visible on right side) */}
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
              alt="After Skincare Ritual Glow"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* BEFORE IMAGE (Clipped on top of After Image) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
                alt="Before Skincare Ritual Texture"
                className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.getBoundingClientRect().width || 570 }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sliding Divider Handle Line */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-white z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Drag Button / Circle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#1A1A1A] shadow-xl flex items-center justify-center border-2 border-[#C5A059]">
                <div className="flex items-center space-x-1 text-gray-500">
                  <span className="text-[10px] font-bold">‹</span>
                  <span className="text-[10px] font-bold">›</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
