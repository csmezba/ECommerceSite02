/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, CheckCircle, Truck, ShoppingBag, ShieldCheck, 
  MapPin, Gift, Printer, ArrowLeft, Loader2, Award, Download
} from "lucide-react";
import { CartItem, User, Address, Order } from "../types";

interface CheckoutProps {
  cart: CartItem[];
  currentUser: User | null;
  onSetView: (view: string) => void;
  onClearCart: () => void;
}

export default function Checkout({
  cart,
  currentUser,
  onSetView,
  onClearCart
}: CheckoutProps) {
  const [step, setStep] = useState<"address" | "shipping" | "payment" | "success">("address");
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address Form State (Prefills with customer defaults if logged in)
  const [fullName, setFullName] = useState(currentUser?.savedAddresses[0]?.fullName || "");
  const [addressLine1, setAddressLine1] = useState(currentUser?.savedAddresses[0]?.addressLine1 || "");
  const [city, setCity] = useState(currentUser?.savedAddresses[0]?.city || "");
  const [postalCode, setPostalCode] = useState(currentUser?.savedAddresses[0]?.postalCode || "");
  const [country, setCountry] = useState(currentUser?.savedAddresses[0]?.country || "France");
  const [phone, setPhone] = useState(currentUser?.savedAddresses[0]?.phone || "");

  // Delivery Method Selection
  const [shippingMethod, setShippingMethod] = useState<"dhl" | "vip">("dhl");

  // Payment Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const discount = Math.floor(cartSubtotal * 0.1); // default luxury discount or rewards deduction
  const shippingCost = shippingMethod === "vip" ? 25 : 0;
  const tax = Math.floor(cartSubtotal * 0.05);
  const orderTotal = cartSubtotal - discount + shippingCost + tax;

  const handleNextStep = (next: "shipping" | "payment") => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(next);
    }, 800);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeAddress: Address = {
      id: `addr-${Date.now()}`,
      label: "Delivery Destination",
      fullName,
      phone,
      addressLine1,
      city,
      postalCode,
      country,
      state: "Île-de-France",
      isDefault: false
    };

    const payload = {
      userId: currentUser?.id || "user-guest",
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedColor: item.selectedColor?.name,
        selectedSize: item.selectedSize
      })),
      subtotal: cartSubtotal,
      discount,
      tax,
      shipping: shippingCost,
      total: orderTotal,
      shippingAddress: activeAddress,
      paymentMethod: "stripe"
    };

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(order => {
        setCreatedOrder(order);
        setLoading(false);
        setStep("success");
        onClearCart(); // empties user's active shopping session cart
      })
      .catch(err => {
        console.error("Error submitting order:", err);
        setLoading(false);
      });
  };

  return (
    <div className="py-28 max-w-[1536px] mx-auto px-3 sm:px-4 md:px-6 select-none font-sans">
      
      {/* Checkout Header Progress Tracker */}
      {step !== "success" && (
        <div className="flex items-center justify-between pb-8 border-b border-gray-100 max-w-4xl mx-auto">
          <button 
            onClick={() => onSetView("shop")}
            className="flex items-center space-x-2 text-xs text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Atelier Catalog</span>
          </button>
          
          {/* Visual indicators */}
          <div className="flex items-center space-x-4 md:space-x-8 text-xs font-sans tracking-widest uppercase font-semibold">
            <span className={step === "address" ? "text-[#C5A059]" : "text-gray-400"}>1. Delivery</span>
            <span className="text-gray-300">›</span>
            <span className={step === "shipping" ? "text-[#C5A059]" : "text-gray-400"}>2. Dispatch</span>
            <span className="text-gray-300">›</span>
            <span className={step === "payment" ? "text-[#C5A059]" : "text-gray-400"}>3. Payment</span>
          </div>
        </div>
      )}

      {/* LOADING SPINNER */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-xs z-50 flex items-center justify-center space-x-2">
          <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
          <span className="text-xs font-sans tracking-widest uppercase font-semibold text-gray-700">Validating on secure servers...</span>
        </div>
      )}

      {step !== "success" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8 items-start">
          
          {/* LEFT WIZARD */}
          <div className="lg:col-span-7 bg-white border border-[#E5E1D8] p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            
            {/* STEP 1: ADDRESS */}
            {step === "address" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <MapPin className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#1A1A1A] uppercase">Delivery Destination</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Recipient Name</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Charlotte Despres"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Contact Telephone</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +33 6 1234 5678"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. 15 Avenue des Champs-Élysées"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">City</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Paris"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">Postal Code</label>
                    <input 
                      type="text" 
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 75008"
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <button
                  disabled={!fullName || !addressLine1 || !city || !postalCode}
                  onClick={() => handleNextStep("shipping")}
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white disabled:bg-gray-200 disabled:text-gray-400 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                >
                  Continue to Dispatch
                </button>
              </div>
            )}

            {/* STEP 2: SHIPPING METHODS */}
            {step === "shipping" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <Truck className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#1A1A1A] uppercase">Maison Dispatch Method</h3>
                </div>

                <div className="space-y-4">
                  {/* DHL Free */}
                  <label className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === "dhl" ? "border-[#C5A059] bg-[#FAF9F6]" : "border-gray-200"}`}>
                    <div className="flex items-start space-x-3">
                      <input 
                        type="radio"
                        checked={shippingMethod === "dhl"}
                        onChange={() => setShippingMethod("dhl")}
                        className="text-[#C5A059] focus:ring-[#C5A059] mt-1"
                      />
                      <div>
                        <h4 className="text-xs font-serif text-gray-900 uppercase font-semibold">DHL Express Courier Priority</h4>
                        <p className="text-[10px] text-gray-500 font-sans font-light">Custom Aura presentation case, layered satin lining, includes 2 samples. Delivered in 2-4 business days.</p>
                      </div>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-green-700 font-bold">COMPLIMENTARY</span>
                  </label>

                  {/* VIP White Glove */}
                  <label className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === "vip" ? "border-[#C5A059] bg-[#FAF9F6]" : "border-gray-200"}`}>
                    <div className="flex items-start space-x-3">
                      <input 
                        type="radio"
                        checked={shippingMethod === "vip"}
                        onChange={() => setShippingMethod("vip")}
                        className="text-[#C5A059] focus:ring-[#C5A059] mt-1"
                      />
                      <div>
                        <h4 className="text-xs font-serif text-gray-900 uppercase font-semibold">Maison VIP Concierge Handover</h4>
                        <p className="text-[10px] text-gray-500 font-sans font-light">Direct white-glove courier handover, refrigerated storage during transport to keep floral elixirs optimal. Delivered tomorrow.</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-900">$25</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setStep("address")}
                    className="flex-1 py-3 border border-gray-200 hover:border-gray-400 text-gray-600 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Back to Address
                  </button>
                  <button 
                    onClick={() => handleNextStep("payment")}
                    className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SECURE PAYMENT */}
            {step === "payment" && (
              <form onSubmit={handleCompletePayment} className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#1A1A1A] uppercase">Secure Payment</h3>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#E5E1D8] space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span className="font-semibold uppercase tracking-wider">Stripe Secure SSL Core</span>
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Credit Card Number</label>
                      <input 
                        type="text" 
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Expiration Date</label>
                        <input 
                          type="text" 
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">CVV Code</label>
                        <input 
                          type="password" 
                          required
                          maxLength={3}
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="flex-1 py-3 border border-gray-200 hover:border-gray-400 text-gray-600 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors"
                  >
                    Back to Dispatch
                  </button>
                  <button 
                    type="submit"
                    disabled={!cardNumber || !cardExpiry || !cardCVC}
                    className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] disabled:bg-gray-200 text-white font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Validate & Pay ${orderTotal}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* RIGHT STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 bg-white border border-[#E5E1D8] p-6 rounded-2xl space-y-6">
            <h3 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">Invoice Preview</h3>
            
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {cart.map((item, idx) => {
                const itemPrice = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
                return (
                  <div key={`${item.product.id}-${idx}`} className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-serif text-gray-900 line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-gray-500 font-sans">
                          Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor.name}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-gray-900 font-semibold">${itemPrice * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-sans">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-mono">${cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-green-700 font-semibold">
                <span>VIP Discount (10%)</span>
                <span className="font-mono">-${discount}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>DHL Courier Dispatch</span>
                <span className="font-mono">${shippingCost}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax Allocation</span>
                <span className="font-mono">${tax}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Grand Invoice Total</span>
                <span className="font-mono">${orderTotal}</span>
              </div>
            </div>

            <div className="bg-[#fcfaf7] p-3 rounded border border-[#ebd8cc]/40 text-center space-y-1">
              <span className="text-[9px] font-sans tracking-widest text-[#c19273] uppercase font-bold flex items-center justify-center space-x-1">
                <Gift className="w-3.5 h-3.5" />
                <span>Maison Gift Packaging</span>
              </span>
              <p className="text-[9px] text-gray-400 font-sans">Your creations will be housed in custom satin presentation cases with white rose sample testers included.</p>
            </div>
          </div>

        </div>
      ) : (
        /* SUCCESS PAGE - RECEIPT DESIGN */
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto bg-white border border-[#ebd8cc] p-8 rounded-2xl shadow-2xl text-center space-y-8 select-none"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-700 stroke-[1.5]" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-[#c19273] font-bold uppercase font-sans">Transaction Validated</span>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-gray-900">Your Order has been Placed</h2>
            <p className="text-xs text-gray-500 font-sans font-light">Merci, chérie, your payment of **${createdOrder?.total}** was received. Your unique invoice is detailed below.</p>
          </div>

          {/* Details block */}
          <div className="border-y border-gray-100 py-6 space-y-4 text-left text-xs font-sans">
            <div className="flex justify-between text-gray-500">
              <span>Invoice Registry ID</span>
              <span className="font-mono text-gray-900 font-semibold">{createdOrder?.id}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Recipient</span>
              <span className="text-gray-900 font-medium">{fullName}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Destination</span>
              <span className="text-gray-900 font-light text-right max-w-xs">{addressLine1}, {city}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Courier Pipeline</span>
              <span className="text-green-700 font-semibold">DHL Express tracking bar active</span>
            </div>
            {currentUser && (
              <div className="flex justify-between items-center bg-[#fcfaf7] p-3 rounded border border-[#ebd8cc]/40">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#c19273]" />
                  <span className="text-[10px] uppercase font-bold text-[#c19273]">Maison VIP Loyalty</span>
                </div>
                <span className="font-mono text-gray-800 font-bold">+{Math.floor(orderTotal * 0.1)} Points Earned</span>
              </div>
            )}
          </div>

          {/* Tracking Bar Timeline */}
          <div className="space-y-4 text-left">
            <h4 className="text-[10px] tracking-widest font-sans uppercase font-semibold text-gray-400">DHL Express Delivery Pipeline</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-gray-100">
              {createdOrder?.trackingTimeline.map((step, i) => (
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            <button 
              onClick={() => onSetView("shop")}
              className="px-6 py-3 bg-[#1c1917] hover:bg-[#c19273] text-white font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
            >
              Continue Exploring Creations
            </button>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-200 hover:border-gray-400 text-gray-600 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
}
