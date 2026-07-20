/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Send, X, MessageSquare, Loader2, Compass, 
  HelpCircle, ChevronRight, User as UserIcon, Heart
} from "lucide-react";
import { User } from "../types";

export interface Message {
  role: "user" | "model";
  text: string;
}

interface AIAssistantProps {
  currentUser: User | null;
  onSetView: (view: string, targetId?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function AIAssistant({
  currentUser,
  onSetView,
  isOpen,
  onClose,
  onOpen
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Bonjour, chérie! I am your Maison Aura Beauty Oracle. Confide in me about your skin physiology, tone concerns, or fragrance desires, and I shall craft your bespoke ritual recommendations."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message stream
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    // Prepare complete conversation payload including user ID (for skin context)
    const payload = {
      message: textToSend,
      history: messages,
      userId: currentUser?.id || "guest"
    };

    fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, { role: "model", text: data.response }]);
        setLoading(false);
      })
      .catch(err => {
        console.error("AI Assistant network error:", err);
        setMessages(prev => [...prev, { 
          role: "model", 
          text: "Pardon, chérie, my neural cosmetics model was temporarily interrupted. Please re-issue your beauty request." 
        }]);
        setLoading(false);
      });
  };

  const SUGGESTED_PILLS = [
    "Analyze Rose Céleste pH",
    "Suggest olive skin lip shade",
    "Create 3-step morning ritual",
    "Recommend a cozy vanilla parfum"
  ];

  return (
    <>
      {/* 1. Floating Launcher Ball */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={onOpen}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-tr from-[#1A1A1A] to-[#333333] text-[#C5A059] shadow-2xl z-40 border border-[#C5A059]/50 flex items-center space-x-2 group cursor-pointer"
            aria-label="Toggle AI Beauty Oracle"
          >
            <Sparkles className="w-5 h-5 animate-pulse text-[#C5A059]" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-[10px] tracking-widest uppercase font-semibold text-white whitespace-nowrap">
              Aura Beauty Oracle
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Expanded Premium Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 w-[360px] md:w-[420px] h-[550px] bg-white border border-[#E5E1D8] rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden z-50 select-none font-sans"
          >
            
            {/* Header branding band */}
            <div className="p-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-white/5 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-radial opacity-20 pointer-events-none" />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-serif text-xs tracking-widest text-[#C5A059] uppercase">Maison Aura Oracle</h4>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] text-gray-300 font-sans tracking-widest uppercase">Consulting Skin Profiles</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile context banner */}
            {currentUser?.beautyProfile && (
              <div className="bg-[#FAF9F6] border-b border-[#E5E1D8] px-4 py-2.5 flex items-center justify-between text-[9px] text-gray-600 font-sans tracking-widest uppercase">
                <span className="flex items-center space-x-1 text-[#C5A059] font-bold">
                  <Compass className="w-3.5 h-3.5 inline" />
                  <span>Profile Synced</span>
                </span>
                <span>Type: {currentUser.beautyProfile.skinType} • concerns: {currentUser.beautyProfile.skinConcerns?.length || 0}</span>
              </div>
            )}

            {/* Messages body thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FAF9F6] to-white scrollbar-thin">
              
              {messages.map((msg, index) => {
                const isModel = msg.role === "model";
                return (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2.5 ${isModel ? "justify-start" : "justify-end"}`}
                  >
                    {isModel && (
                      <div className="w-6 h-6 rounded-full bg-[#C5A059] text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-1">
                        A
                      </div>
                    )}
                    
                    <div className="space-y-1 max-w-[80%]">
                      <div 
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-sans font-light shadow-xs border ${
                          isModel 
                            ? "bg-white text-gray-700 border-gray-100" 
                            : "bg-[#1A1A1A] text-white border-transparent"
                        }`}
                      >
                        {/* Render simple list markdown or formatting if present */}
                        <div className="whitespace-pre-line space-y-1.5">
                          {msg.text}
                        </div>
                      </div>

                      {/* Display contextual action suggestions if text references specific cosmetics */}
                      {isModel && index === messages.length - 1 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.text.includes("Céleste") && (
                            <button 
                              onClick={() => { onSetView("details", "rose-celeste"); onClose(); }}
                              className="px-2 py-1 bg-[#FAF9F6] border border-[#E5E1D8] text-[9px] text-[#C5A059] uppercase tracking-wider font-semibold hover:bg-white"
                            >
                              Inspect Rose Céleste
                            </button>
                          )}
                          {msg.text.includes("Ambre") && (
                            <button 
                              onClick={() => { onSetView("details", "ambre-imperial"); onClose(); }}
                              className="px-2 py-1 bg-[#FAF9F6] border border-[#E5E1D8] text-[9px] text-[#C5A059] uppercase tracking-wider font-semibold hover:bg-white"
                            >
                              Explore L'Ambre
                            </button>
                          )}
                          {msg.text.includes("Gold") && (
                            <button 
                              onClick={() => { onSetView("details", "absolute-gold"); onClose(); }}
                              className="px-2 py-1 bg-[#FAF9F6] border border-[#E5E1D8] text-[9px] text-[#C5A059] uppercase tracking-wider font-semibold hover:bg-white"
                            >
                              View Absolute Gold
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Streaming loading indicator */}
              {loading && (
                <div className="flex items-center space-x-2 text-xs text-gray-400 font-sans italic pl-8">
                  <Loader2 className="w-4 h-4 text-[#C5A059] animate-spin" />
                  <span>Aura formulation engine weighing botanical cells...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Pills panel */}
            <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-1 bg-white">
              {SUGGESTED_PILLS.map(pill => (
                <button
                  key={pill}
                  onClick={() => handleSendMessage(pill)}
                  className="text-[9px] tracking-wider font-sans bg-gray-50 hover:bg-[#FAF9F6] hover:border-[#C5A059] text-gray-500 hover:text-[#C5A059] px-2.5 py-1.5 border border-gray-200 rounded-full transition-all cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input submission bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
              className="p-3 border-t border-gray-100 bg-white flex items-center space-x-2"
            >
              <input 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about skin pH, tones, routine sequences..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
              <button 
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="p-2 bg-[#1A1A1A] hover:bg-[#C5A059] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
