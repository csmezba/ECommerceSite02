/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Award, Heart, MapPin, ClipboardList, Sparkles, User as UserIcon, 
  Plus, Check, Trash2, Home, Compass, ShieldCheck, Mail, Ticket
} from "lucide-react";
import { User, Order, Address, BeautyProfile } from "../types";

interface CustomerDashboardProps {
  currentUser: User | null;
  onUpdateProfile: (updatedUser: User) => void;
  onSetView: (view: string, targetId?: string) => void;
}

export default function CustomerDashboard({
  currentUser,
  onUpdateProfile,
  onSetView
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile" | "addresses">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address form states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState("Home");
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrZip, setAddrZip] = useState("");

  // Profile Form States
  const [skinType, setSkinType] = useState<BeautyProfile["skinType"]>("Normal");
  const [skinUndertone, setSkinUndertone] = useState<BeautyProfile["skinUndertone"]>("Neutral");
  const [hairType, setHairType] = useState<BeautyProfile["hairType"]>("Straight");
  const [makeupPref, setMakeupPref] = useState<BeautyProfile["makeupPreference"]>("Natural");
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    // Load custom profile if exists
    if (currentUser.beautyProfile) {
      setSkinType(currentUser.beautyProfile.skinType);
      setSkinUndertone(currentUser.beautyProfile.skinUndertone);
      setHairType(currentUser.beautyProfile.hairType);
      setMakeupPref(currentUser.beautyProfile.makeupPreference);
      setSkinConcerns(currentUser.beautyProfile.skinConcerns || []);
    }

    // Load orders
    fetch(`/api/orders/user/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        if (data.length > 0) setSelectedOrder(data[0]);
      })
      .catch(err => console.error("Error loading user orders:", err));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="py-32 text-center space-y-4 font-sans select-none">
        <h2 className="text-xl font-serif">Aura Portal Restricted</h2>
        <p className="text-gray-500 text-xs">Pardon, chérie, you must sign in to view your VIP beauty registry and loyalty records.</p>
      </div>
    );
  }

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");

    const updatedProfile: BeautyProfile = {
      skinType,
      skinUndertone,
      hairType,
      makeupPreference: makeupPref,
      skinConcerns
    };

    fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        beautyProfile: updatedProfile
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          onUpdateProfile(result.user);
          setProfileSuccess("VIP Beauty Profile has been successfully written to Aura databases!");
          setTimeout(() => setProfileSuccess(""), 3000);
        }
      })
      .catch(err => console.error("Error writing profile:", err));
  };

  const handleToggleConcern = (concern: string) => {
    if (skinConcerns.includes(concern)) {
      setSkinConcerns(prev => prev.filter(c => c !== concern));
    } else {
      setSkinConcerns(prev => [...prev, concern]);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity) return;

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      label: addrLabel,
      fullName: addrName,
      phone: addrPhone,
      addressLine1: addrLine1,
      city: addrCity,
      postalCode: addrZip,
      country: "France",
      state: "Île-de-France",
      isDefault: currentUser.savedAddresses.length === 0
    };

    const updatedAddresses = [...currentUser.savedAddresses, newAddress];

    fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        savedAddresses: updatedAddresses
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          onUpdateProfile(result.user);
          setIsAddingAddress(false);
          // Clear address state
          setAddrName("");
          setAddrPhone("");
          setAddrLine1("");
          setAddrCity("");
          setAddrZip("");
        }
      })
      .catch(err => console.error("Error creating address:", err));
  };

  const handleDeleteAddress = (id: string) => {
    const filtered = currentUser.savedAddresses.filter(a => a.id !== id);
    fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        savedAddresses: filtered
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          onUpdateProfile(result.user);
        }
      })
      .catch(err => console.error("Error deleting address:", err));
  };

  return (
    <div className="py-28 max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6 select-none font-sans">
      
      {/* Dashboard visual ribbon */}
      <div className="p-8 bg-[#1A1A1A] rounded-3xl border border-[#C5A059]/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 gold-gradient opacity-10 rounded-full blur-3xl" />
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <UserIcon className="w-8 h-8 text-[#C5A059]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold">Maison Member</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <h2 className="font-serif text-2xl text-white font-light">{currentUser.name}</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{currentUser.email}</p>
          </div>
        </div>

        {/* Loyalty points panel */}
        <div className="flex items-center space-x-8 relative z-10 border-t md:border-t-0 md:border-l border-white/15 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
          <div className="space-y-1">
            <span className="text-[9px] tracking-widest uppercase text-gray-400">Loyalty Rewards</span>
            <div className="flex items-baseline space-x-1.5 text-white">
              <span className="font-serif text-3xl font-light text-[#C5A059]">{currentUser.rewardsPoints}</span>
              <span className="text-xs text-[#C5A059]">Points</span>
            </div>
            <span className="text-[9px] text-green-400 tracking-wider flex items-center space-x-1">
              <Ticket className="w-3 h-3 inline" />
              <span>Aura Gold VIP Status Tier</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 mt-10 space-x-8 text-xs font-sans tracking-widest uppercase font-semibold text-gray-400">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "overview" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
        >
          VIP Registry
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "orders" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
        >
          My Orders ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab("profile")}
          className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "profile" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
        >
          Beauty Profile
        </button>
        <button 
          onClick={() => setActiveTab("addresses")}
          className={`pb-4 border-b-2 transition-colors cursor-pointer ${activeTab === "addresses" ? "border-[#C5A059] text-[#1A1A1A]" : "border-transparent hover:text-gray-800"}`}
        >
          Addresses
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quick stats bento */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="font-serif text-lg text-gray-900 uppercase">Maison VIP Privileges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1">
                  <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Priority dispatch</span>
                  <h4 className="text-sm font-semibold text-gray-800">DHL Express Next-Day Delivery</h4>
                  <p className="text-[10px] text-gray-500">Your profile is marked for guaranteed 24-hour shipping on all new luxury elixirs.</p>
                </div>
                
                <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1">
                  <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">VIP Consultation</span>
                  <h4 className="text-sm font-semibold text-gray-800">Bespoke AI Formulation Agent</h4>
                  <p className="text-[10px] text-gray-500">Our model queries ingredients and recommends specific routines tailored precisely to your Beauty Profile.</p>
                </div>
              </div>

              {/* Recent Order Preview */}
              <div className="p-5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs font-serif text-gray-900 uppercase">Latest Order Pipeline</span>
                  <button onClick={() => setActiveTab("orders")} className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider hover:underline">View All</button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No orders submitted yet. Visit the atelier to configure your custom routine.</p>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-gray-800 font-semibold">{orders[0].id}</span>
                      <p className="text-[10px] text-gray-400">Submitted on {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold rounded">
                      {orders[0].status}
                    </span>
                    <span className="font-mono font-bold text-gray-900">${orders[0].total}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Profile Panel */}
            <div className="bg-white border border-[#E5E1D8] p-6 rounded-2xl space-y-4 text-center">
              <Compass className="w-10 h-10 text-[#C5A059] mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <h4 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">My Skin Profile</h4>
                <p className="text-xs text-gray-500">Configured to match custom botanicals.</p>
              </div>

              <div className="text-left space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Physiology:</span>
                  <span className="font-semibold text-gray-800">{currentUser.beautyProfile?.skinType || "Not configured"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Undertone:</span>
                  <span className="font-semibold text-gray-800">{currentUser.beautyProfile?.skinUndertone || "Neutral"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hair:</span>
                  <span className="font-semibold text-gray-800">{currentUser.beautyProfile?.hairType || "Straight"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Preference:</span>
                  <span className="font-semibold text-gray-800">{currentUser.beautyProfile?.makeupPreference || "Natural"}</span>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab("profile")}
                className="w-full py-2 bg-transparent hover:bg-gray-50 text-[#C5A059] hover:text-[#1A1A1A] border border-gray-100 hover:border-gray-300 font-sans text-[10px] tracking-widest uppercase font-semibold transition-all cursor-pointer"
              >
                Reconfigure Profile
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders list sidebar */}
            <div className="lg:col-span-4 space-y-3">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-xs italic">No orders logged under this membership.</p>
              ) : (
                orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedOrder?.id === order.id ? "border-[#C5A059] bg-[#FAF9F6]" : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-semibold text-gray-800">{order.id}</span>
                      <span className="text-[10px] font-mono text-gray-500">${order.total}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-green-700 bg-green-50 px-1.5 rounded">
                        {order.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Selected Order Detail Tracker */}
            <div className="lg:col-span-8 bg-white border border-[#E5E1D8] p-6 rounded-2xl shadow-xs">
              {selectedOrder ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Active Pipeline Tracker</span>
                      <h4 className="font-serif text-lg text-gray-900">{selectedOrder.id}</h4>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-800 rounded font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Invoice Receipt</span>
                    </button>
                  </div>

                  {/* DHL Status Bar */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] tracking-widest font-sans uppercase font-bold text-gray-400">DHL Carrier Pipeline Status</h5>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-gray-100">
                      {selectedOrder.trackingTimeline.map((step, i) => (
                        <div key={i} className="relative flex items-start space-x-3">
                          <span className={`absolute -left-6 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] bg-white z-10 ${
                            step.done ? "border-green-600 text-green-700" : "border-gray-200 text-gray-400"
                          }`}>
                            {step.done ? "✓" : i + 1}
                          </span>
                          <div>
                            <h5 className={`text-xs font-semibold ${step.done ? "text-gray-900" : "text-gray-400"}`}>{step.status}</h5>
                            <p className="text-[10px] text-gray-400 font-sans">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order items summary */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h5 className="text-[10px] tracking-widest font-sans uppercase font-bold text-gray-400">Consigned Creations</h5>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs pb-2.5 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                            <div>
                              <h6 className="font-serif text-gray-800 line-clamp-1">{item.productName}</h6>
                              <span className="text-[9px] text-gray-400 font-sans">
                                Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-gray-900 font-semibold">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 text-xs italic">Select an order invoice from the sidebar to track its transit timeline.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BEAUTY PROFILE BUILDER */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfileSubmit} className="bg-[#FAF9F6] border border-[#E5E1D8] p-6 md:p-8 rounded-2xl max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-lg tracking-wider text-[#1A1A1A] uppercase">Custom Beauty Profile</h3>
            </div>

            {profileSuccess && (
              <p className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded font-sans tracking-wide">
                {profileSuccess}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Skin Type */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Skin Physiology Type</label>
                <select 
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Normal">Normal Balance</option>
                  <option value="Dry">Dry / Lack Lustre</option>
                  <option value="Oily">Oily / High Sebum</option>
                  <option value="Sensitive">Hyper-Sensitive / Redness</option>
                  <option value="Combination">Combination T-Zone</option>
                </select>
              </div>

              {/* Undertone */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Skin Undertone</label>
                <select 
                  value={skinUndertone}
                  onChange={(e) => setSkinUndertone(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Neutral">Neutral (Balanced veins)</option>
                  <option value="Warm">Warm (Golden, green veins)</option>
                  <option value="Cool">Cool (Rosy, blue veins)</option>
                </select>
              </div>

              {/* Hair Type */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Hair Architecture</label>
                <select 
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Straight">Straight (Finely smooth)</option>
                  <option value="Wavy">Wavy (S-shape locks)</option>
                  <option value="Curly">Curly (Coiled spirals)</option>
                  <option value="Coily">Coily (Zig-zag loops)</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              {/* Makeup Preference */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Makeup Aesthetic Preference</label>
                <select 
                  value={makeupPref}
                  onChange={(e) => setMakeupPref(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Natural">Natural (Minimal skin-like blurred tints)</option>
                  <option value="Glam">Glam (Highly contoured rich mattes)</option>
                  <option value="Minimalist">Minimalist (Bare essentials only)</option>
                  <option value="Editorial">Editorial (Avant-garde haute couture)</option>
                </select>
              </div>

              {/* Concerns Multi-select checkboxes */}
              <div className="col-span-2 space-y-2.5">
                <label className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Targeted Skin Concerns</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Dryness", "Aging / Fine Lines", "Pores / Texture", "Acne / Congestion", "Hyperpigmentation", "Rosacea / Redness"].map(concern => {
                    const isChecked = skinConcerns.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => handleToggleConcern(concern)}
                        className={`py-2 px-3 text-left text-xs rounded-lg border flex items-center justify-between transition-all ${
                          isChecked 
                            ? "border-[#C5A059] bg-[#FAF9F6] text-[#C5A059]" 
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <span>{concern}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#FAF9F6] font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
            >
              Write Profile to AI memory
            </button>
          </form>
        )}

        {/* TAB 4: ADDRESSES MANAGER */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg text-gray-900 uppercase">Saved Addresses</h3>
              <button 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#C5A059] rounded font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.savedAddresses.length === 0 && (
                <p className="text-gray-500 text-xs italic">No saved delivery addresses. Complete checkout or add one above.</p>
              )}
              {currentUser.savedAddresses.map(addr => (
                <div key={addr.id} className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-3 relative shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#C5A059] flex items-center space-x-1">
                      <Home className="w-3.5 h-3.5" />
                      <span>{addr.label}</span>
                    </span>
                    {addr.isDefault && (
                      <span className="text-[8px] bg-green-50 text-green-700 px-1.5 py-0.5 uppercase font-bold tracking-wider font-sans rounded">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-700 font-sans space-y-0.5 font-light">
                    <p className="font-medium text-gray-900">{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    <p>{addr.city}, {addr.postalCode}</p>
                    <p>{addr.country}</p>
                    <p className="text-gray-400">{addr.phone}</p>
                  </div>

                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Address Form Modal */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="p-6 bg-[#FAF9F6] border border-[#E5E1D8] rounded-2xl max-w-xl mx-auto space-y-4">
                <h4 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">Add New delivery point</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Address Label</label>
                    <select 
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Home">Home Residence</option>
                      <option value="Work">Work / Studio Office</option>
                      <option value="Other">Other Alternative</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Recipient Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="e.g. Charlotte Despres"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={addrLine1}
                      onChange={(e) => setAddrLine1(e.target.value)}
                      placeholder="e.g. 15 Avenue des Champs-Élysées"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">City</label>
                    <input 
                      type="text" 
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="e.g. Paris"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Postal Zip Code</label>
                    <input 
                      type="text" 
                      required
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      placeholder="e.g. 75008"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="e.g. +33 6 1234 5678"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c19273]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingAddress(false)}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-400 text-gray-600 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-[#1c1917] hover:bg-[#c19273] text-white font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
