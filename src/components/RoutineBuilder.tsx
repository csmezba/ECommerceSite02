/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, 
  ShoppingBag, Star, HelpCircle, Mail, Copy, Check, Share2, 
  Bookmark, BookmarkCheck, Heart, Trash2, Calendar
} from "lucide-react";
import { Product } from "../types";

interface RoutineBuilderProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onSetView: (view: string, targetId?: string) => void;
  presetSkinType?: string;
  presetConcerns?: string[];
}

interface SavedRoutine {
  id: string;
  name: string;
  skinType: string;
  concerns: string[];
  outcome: string;
  productIds: string[];
  date: string;
}

export default function RoutineBuilder({ 
  products, 
  onAddToCart, 
  onSetView,
  presetSkinType,
  presetConcerns
}: RoutineBuilderProps) {
  const [step, setStep] = useState<"quiz-intro" | "quiz-type" | "quiz-concerns" | "quiz-outcome" | "routine-view">("quiz-intro");
  
  // Quiz Answers
  const [skinType, setSkinType] = useState<string>("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [desiredOutcome, setDesiredOutcome] = useState<string>("");

  useEffect(() => {
    if (presetSkinType || (presetConcerns && presetConcerns.length > 0)) {
      if (presetSkinType) setSkinType(presetSkinType);
      if (presetConcerns) setSelectedConcerns(presetConcerns);
      setDesiredOutcome("Radiant & Illuminated Satin Skin");
      setStep("routine-view");
    }
  }, [presetSkinType, presetConcerns]);

  // UI Interactive states
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedName, setSavedName] = useState<string>("");
  const [savedRoutinesList, setSavedRoutinesList] = useState<SavedRoutine[]>(() => {
    try {
      const raw = localStorage.getItem("aura_saved_routines");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [addedAll, setAddedAll] = useState<boolean>(false);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern) 
        : [...prev, concern]
    );
  };

  // Routine matching algorithm
  const getCuratedRoutine = () => {
    const routineSteps: { stepNum: number; stepName: string; stepTitle: string; product: Product }[] = [];
    
    // Step 1: Cleanser -> prod-01 (White Rose Cellular Cleansing Elixir)
    const cleanser = products.find(p => p.id === "prod-01") || products[0];
    if (cleanser) {
      routineSteps.push({
        stepNum: 1,
        stepName: "Purifier",
        stepTitle: "Purifying Cellular Cleansing",
        product: cleanser
      });
    }

    // Step 2: Toner / Essence -> prod-03 (White Rose Micro-Peel Resurfacing Essence)
    const toner = products.find(p => p.id === "prod-03") || products[2];
    if (toner) {
      routineSteps.push({
        stepNum: 2,
        stepName: "Essence / Toner",
        stepTitle: "Micro-Peel Cellular Resurfacing",
        product: toner
      });
    }

    // Step 3: Active Serum -> prod-04 (Centella Asiatica Soothing Serum)
    const serum = products.find(p => p.id === "prod-04") || products[3];
    if (serum) {
      routineSteps.push({
        stepNum: 3,
        stepName: "Active Treatment Serum",
        stepTitle: "Hydrating & Repairing Deep Serum",
        product: serum
      });
    }

    // Step 4: Active Moisturizer -> prod-06 (White Rose Cellular Regenerating Cream)
    const moisturizer = products.find(p => p.id === "prod-06") || products[5];
    if (moisturizer) {
      routineSteps.push({
        stepNum: 4,
        stepName: "Nourishing Moisturizer",
        stepTitle: "Cellular Cellular Barrier Regeneration",
        product: moisturizer
      });
    }

    // Step 5: Treatment Oil -> prod-07 (Nectar Infusion Cellular Face Oil) or prod-08
    const oil = products.find(p => p.id === "prod-07") || products[6];
    if (oil) {
      routineSteps.push({
        stepNum: 5,
        stepName: "Sensorial Treatment Oil",
        stepTitle: "Radiance Sealing Cellular Oil",
        product: oil
      });
    }

    return routineSteps;
  };

  const handleAddSingleToCart = (prod: Product) => {
    onAddToCart(prod, 1);
    setAddedItems(prev => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    const routine = getCuratedRoutine();
    routine.forEach(stepItem => {
      onAddToCart(stepItem.product, 1);
    });
    setAddedAll(true);
    setTimeout(() => {
      setAddedAll(false);
    }, 3000);
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedName.trim()) return;

    const routine = getCuratedRoutine();
    const newRoutine: SavedRoutine = {
      id: "routine-" + Date.now(),
      name: savedName,
      skinType,
      concerns: selectedConcerns,
      outcome: desiredOutcome,
      productIds: routine.map(s => s.product.id),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    const updated = [newRoutine, ...savedRoutinesList];
    setSavedRoutinesList(updated);
    localStorage.setItem("aura_saved_routines", JSON.stringify(updated));
    setSavedName("");
    setIsSaved(true);
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = savedRoutinesList.filter(r => r.id !== id);
    setSavedRoutinesList(updated);
    localStorage.setItem("aura_saved_routines", JSON.stringify(updated));
  };

  const handleLoadSavedRoutine = (routine: SavedRoutine) => {
    setSkinType(routine.skinType);
    setSelectedConcerns(routine.concerns);
    setDesiredOutcome(routine.outcome);
    setStep("routine-view");
    setIsSaved(true);
  };

  const handleCopyShareLink = () => {
    const mockUrl = `${window.location.origin}/?ritual=custom&skinType=${encodeURIComponent(skinType)}&outcome=${encodeURIComponent(desiredOutcome)}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const routineItems = getCuratedRoutine();
  const totalPrice = routineItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <section id="bespoke-routine-builder" className="py-28 max-w-7xl mx-auto px-6 font-sans select-none">
      
      {/* Title section */}
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] tracking-[0.3em] text-[#C5A059] uppercase font-bold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Beauty Atelier</span>
        </span>
        <h2 className="font-serif text-4xl font-extralight text-[#1A1A1A]">Aura Ritual Architect</h2>
        <p className="text-gray-500 font-light max-w-lg mx-auto text-xs leading-relaxed">
          Formulate a bespoke daily cosmetic ritual by selecting cellular step-by-step treatments tuned directly to your skin concerns, physiology, and desired aesthetic finish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Wizard / Saved Rituals */}
        <div className="lg:col-span-8 bg-white border border-[#E5E1D8] rounded-3xl p-8 md:p-10 shadow-lg min-h-[500px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* INTRO PORTAL */}
            {step === "quiz-intro" && (
              <motion.div 
                key="quiz-intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 my-auto"
              >
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-light text-gray-900 leading-snug">
                    Architect your signature multi-step cellular ritual
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Maison Aura rejects the concept of one-size-fits-all beauty routines. True cell correction requires synchronized layers—each prep-stage maximizing the absorption of subsequent serums. Our ritual generator recommends structured, botanical, multi-step skincare to amplify skin density, water levels, and ultimate cell light.
                  </p>
                </div>

                {/* Saved routines listing */}
                {savedRoutinesList.length > 0 && (
                  <div className="space-y-3.5 pt-4 border-t border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">My Saved Bespoke Rituals</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedRoutinesList.map(item => (
                        <div key={item.id} className="p-3 border border-gray-100 bg-[#FAF9F6] rounded-xl flex items-center justify-between">
                          <button 
                            onClick={() => handleLoadSavedRoutine(item)}
                            className="text-left shrink-0 block group cursor-pointer"
                          >
                            <h4 className="font-serif text-xs font-semibold text-gray-800 group-hover:text-[#C5A059] transition-colors">{item.name}</h4>
                            <span className="text-[9px] text-gray-400 font-light block mt-0.5">{item.skinType} • {item.date}</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteRoutine(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex pt-6">
                  <button 
                    onClick={() => setStep("quiz-type")}
                    className="px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center space-x-2 transition-all"
                  >
                    <span>Curate My Ritual</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* QUIZ STEP 1: SKIN TYPE */}
            {step === "quiz-type" && (
              <motion.div 
                key="quiz-type"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 my-auto"
              >
                <div>
                  <span className="text-[9px] font-bold text-[#C5A059] tracking-widest uppercase">Stage 1 of 3 • Physiology</span>
                  <h3 className="font-serif text-xl font-light text-gray-900 mt-1">What is your current skin behavior type?</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Dry", label: "Dry & Dehydrated", desc: "Tightness, flakiness, thirsts for oils" },
                    { id: "Oily", label: "Oily & Glossy", desc: "Excess sebum production, larger pores" },
                    { id: "Sensitive", label: "Sensitive & Red", desc: "Prone to irritation, redness, barrier tear" },
                    { id: "Combination", label: "Combination", desc: "Dry cheeks with an oily T-zone" },
                    { id: "Normal", label: "Balanced / Normal", desc: "Hydrated, comfortable, minimal breakouts" }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSkinType(type.id)}
                      className={`p-4 border text-left rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[100px] ${
                        skinType === type.id 
                          ? "border-[#C5A059] bg-[#C5A059]/5 text-gray-900" 
                          : "border-gray-100 bg-[#FAF9F6]/20 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      <span className="block text-xs font-semibold">{type.label}</span>
                      <span className="block text-[10px] text-gray-400 font-light mt-2.5 leading-relaxed">{type.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => setStep("quiz-intro")}
                    className="text-xs uppercase font-semibold text-gray-400 hover:text-gray-900 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button 
                    disabled={!skinType}
                    onClick={() => setStep("quiz-concerns")}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center space-x-2 transition-all"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* QUIZ STEP 2: CONCERNS */}
            {step === "quiz-concerns" && (
              <motion.div 
                key="quiz-concerns"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 my-auto"
              >
                <div>
                  <span className="text-[9px] font-bold text-[#C5A059] tracking-widest uppercase">Stage 2 of 3 • Cellular Target</span>
                  <h3 className="font-serif text-xl font-light text-gray-900 mt-1">Select your primary target concerns (multi-select):</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "Dryness", label: "Dehydration & Loss of Plumpness", desc: "Fine dry lines, rough cellular patches" },
                    { id: "Aging / Fine Lines", label: "Loss of Density & Elasticity", desc: "Expression lines, wrinkles, sagging contours" },
                    { id: "Breakouts", label: "Active Breakouts & Blocked Pores", desc: "Blackheads, hormonal congestion, irritation" },
                    { id: "Dullness", label: "Dullness & Hyper-pigmentation", desc: "Uneven skin tone, loss of light reflection" },
                    { id: "Redness", label: "Chronic Redness & Fragility", desc: "Visible capillaries, delicate skin, flaring" }
                  ].map(concern => (
                    <button
                      key={concern.id}
                      onClick={() => toggleConcern(concern.id)}
                      className={`p-4 border text-left rounded-2xl transition-all cursor-pointer flex items-start space-x-3.5 ${
                        selectedConcerns.includes(concern.id)
                          ? "border-[#C5A059] bg-[#C5A059]/5 text-gray-900" 
                          : "border-gray-100 bg-[#FAF9F6]/20 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedConcerns.includes(concern.id) ? "bg-[#C5A059] border-[#C5A059] text-white" : "border-gray-300"
                      }`}>
                        {selectedConcerns.includes(concern.id) && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                      <div className="space-y-1">
                        <span className="block text-xs font-semibold">{concern.label}</span>
                        <span className="block text-[10px] text-gray-400 font-light leading-relaxed">{concern.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => setStep("quiz-type")}
                    className="text-xs uppercase font-semibold text-gray-400 hover:text-gray-900 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button 
                    disabled={selectedConcerns.length === 0}
                    onClick={() => setStep("quiz-outcome")}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center space-x-2 transition-all"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* QUIZ STEP 3: DESIRED OUTCOME */}
            {step === "quiz-outcome" && (
              <motion.div 
                key="quiz-outcome"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 my-auto"
              >
                <div>
                  <span className="text-[9px] font-bold text-[#C5A059] tracking-widest uppercase">Stage 3 of 3 • Desired Finish</span>
                  <h3 className="font-serif text-xl font-light text-gray-900 mt-1">What is your ultimate skin aesthetic aspiration?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "Glow", label: "Hyper-Gloss Radical Glow", desc: "Glazed glass finish, high dewiness, reflective light" },
                    { id: "Matte", label: "Velvety Matte Balance", desc: "No grease shine, blurred airbrushed canvas, smooth pores" },
                    { id: "Smooth", label: "Pristine Epidermal Smoothness", desc: "Zero texturing, unified skin grains, minimized bumps" },
                    { id: "Lifted", label: "Sculpted & Lifted Contour", desc: "Plump cheeks, firm jawline definitions, dense cells" }
                  ].map(outcome => (
                    <button
                      key={outcome.id}
                      onClick={() => setDesiredOutcome(outcome.id)}
                      className={`p-4 border text-left rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[100px] ${
                        desiredOutcome === outcome.id 
                          ? "border-[#C5A059] bg-[#C5A059]/5 text-gray-900" 
                          : "border-gray-100 bg-[#FAF9F6]/20 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      <span className="block text-xs font-semibold">{outcome.label}</span>
                      <span className="block text-[10px] text-gray-400 font-light mt-2.5 leading-relaxed">{outcome.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => setStep("quiz-concerns")}
                    className="text-xs uppercase font-semibold text-gray-400 hover:text-gray-900 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button 
                    disabled={!desiredOutcome}
                    onClick={() => { setStep("routine-view"); setIsSaved(false); }}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center space-x-2 transition-all"
                  >
                    <span>Curate My Ritual</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* CURATED ROUTINE DETAIL VIEW */}
            {step === "routine-view" && (
              <motion.div 
                key="routine-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#C5A059] tracking-widest uppercase">My Custom Curated Ritual</span>
                    <h3 className="font-serif text-xl font-light text-gray-900 mt-0.5">
                      The Bespoke 5-Step {skinType} Skin Alignment
                    </h3>
                  </div>
                  
                  {/* Quick utility buttons */}
                  <div className="flex items-center space-x-3.5">
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="px-3 py-1.5 border border-gray-200 hover:border-[#C5A059] text-gray-400 hover:text-[#C5A059] rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>

                    <button 
                      onClick={() => { setStep("quiz-intro"); }}
                      className="px-3 py-1.5 border border-gray-200 hover:border-[#C5A059] text-gray-400 hover:text-[#C5A059] rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Recurative</span>
                    </button>
                  </div>
                </div>

                {/* Step Listing */}
                <div className="space-y-6">
                  {routineItems.map((item, index) => (
                    <div 
                      key={item.product.id}
                      className="group flex flex-col sm:flex-row items-start gap-5 p-5 border border-gray-100 hover:border-[#C5A059]/30 rounded-2xl bg-white transition-all hover:shadow-md"
                    >
                      {/* Step Indicator */}
                      <div className="flex sm:flex-col items-center justify-center shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-xs font-semibold">
                          0{item.stepNum}
                        </div>
                        <span className="text-[8px] font-bold text-[#C5A059] tracking-widest uppercase mt-1.5 block shrink-0 text-center">
                          {item.stepName}
                        </span>
                      </div>

                      {/* Product details */}
                      <div className="flex-1 flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <img src={item.product.image} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                          <div className="space-y-1 text-xs">
                            <span className="text-[8px] font-sans tracking-widest text-[#C5A059] uppercase font-bold">{item.product.brand}</span>
                            <h4 
                              onClick={() => onSetView("details", item.product.id)}
                              className="font-serif text-sm font-semibold text-gray-800 hover:text-[#C5A059] cursor-pointer transition-colors"
                            >
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-light leading-relaxed line-clamp-2">{item.product.description}</p>
                            
                            {/* Target Matching pill */}
                            <div className="flex items-center space-x-1.5 pt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                              <span className="text-[9px] text-gray-400">Specially formulated for <strong className="font-semibold">{skinType} Skin & {desiredOutcome} finishes</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Add to Cart button */}
                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-3">
                          <span className="font-mono text-xs font-semibold text-gray-900">${item.product.price}</span>
                          <button 
                            onClick={() => handleAddSingleToCart(item.product)}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                              addedItems[item.product.id] 
                                ? "bg-green-600 text-white" 
                                : "bg-[#1A1A1A]/5 hover:bg-[#C5A059]/15 text-gray-700 hover:text-[#C5A059]"
                            }`}
                          >
                            {addedItems[item.product.id] ? "Added to Cart" : "+ Add To Ritual"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Ritual Form */}
                {!isSaved ? (
                  <form onSubmit={handleSaveRoutine} className="p-5 border border-dashed border-gray-200 bg-gray-50 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-serif text-xs font-semibold text-gray-800 flex items-center space-x-1.5">
                        <Bookmark className="w-4 h-4 text-[#C5A059]" />
                        <span>Save this Signature Ritual</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-light">Name and save this routine to access or update it in the future.</p>
                    </div>
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <input 
                        type="text"
                        required
                        value={savedName}
                        onChange={(e) => setSavedName(e.target.value)}
                        placeholder="e.g. My Versailles Summer Glow"
                        className="flex-1 sm:w-48 bg-white border border-gray-200 focus:border-[#C5A059] px-3.5 py-2 text-xs rounded-xl focus:outline-none"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#C5A059] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-[11px] rounded-2xl flex items-center space-x-2">
                    <BookmarkCheck className="w-5 h-5 text-green-700 shrink-0" />
                    <span>This ritual has been securely archived to your VIP local profile catalog.</span>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Right Column: Routine Pricing Summary & Cart Action */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-full h-full bg-radial opacity-10 pointer-events-none" />

            <div className="space-y-1 border-b border-white/10 pb-4 relative z-10">
              <span className="text-[8px] tracking-widest text-[#C5A059] uppercase font-bold">Consolidated Regime</span>
              <h3 className="font-serif text-lg font-light text-white">Ritual Curation Index</h3>
            </div>

            <div className="space-y-3 relative z-10">
              {routineItems.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-gray-400 font-light line-clamp-1 flex-1 pr-4">0{item.stepNum}. {item.product.name}</span>
                  <span className="font-mono font-semibold text-white">${item.product.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total Atelier Value</span>
                <span className="font-mono text-xl font-light text-[#C5A059]">${totalPrice}</span>
              </div>
              
              <button 
                disabled={step !== "routine-view"}
                onClick={handleAddAllToCart}
                className={`w-full py-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                  addedAll ? "bg-green-700 text-white" : "bg-[#C5A059] hover:bg-[#FAF9F6] text-white hover:text-gray-900"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedAll ? "All Added To Cart!" : `Add All 5 Items To Cart`}</span>
              </button>

              <p className="text-[9.5px] text-gray-400 leading-relaxed text-center font-light italic">
                *Compiling this bundle unlocks complimentary deluxe white rose botanical samples and priority shipping.
              </p>
            </div>

          </div>

          {/* Aesthetic ritual calendar card */}
          <div className="border border-[#E5E1D8] bg-white rounded-3xl p-6 space-y-3 shadow-xs">
            <h4 className="font-serif text-xs font-semibold text-gray-800 flex items-center space-x-1.5">
              <Calendar className="w-4.5 h-4.5 text-[#C5A059]" />
              <span>Aura Cellular Cycle Ritual</span>
            </h4>
            <p className="text-[10.5px] text-gray-500 font-light leading-relaxed">
              White rose botanical stem cells require consistent 28-day regenerative cycles to fully correct epidermal light reflection. Complete this 5-step regime morning and evening for 4 consecutive weeks to witness absolute, clinical cellular transformation.
            </p>
          </div>

        </div>

      </div>

      {/* SHARE RITUAL MODAL DIALOG */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E5E1D8] max-w-md w-full rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-serif text-sm font-semibold text-gray-900">Share your Custom Routine</h4>
              <button 
                onClick={() => { setShowShareModal(false); setCopiedLink(false); }}
                className="text-gray-400 hover:text-gray-900 font-semibold cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-light">Copy this unique cryptographic link. When opened, it will pre-load your custom skin type and curated product recommendations instantly.</p>
            
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly
                value={`${window.location.origin}/?ritual=custom&skinType=${skinType}&outcome=${desiredOutcome}`}
                className="flex-1 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-[10px] text-gray-500 focus:outline-none"
              />
              <button 
                onClick={handleCopyShareLink}
                className="p-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white rounded-lg transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[9.5px] text-center text-[#C5A059] font-semibold tracking-wider uppercase">
              {copiedLink ? "Link Copied to Clipboard!" : "Copy & Share"}
            </p>
          </motion.div>
        </div>
      )}

    </section>
  );
}
