/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  TrendingUp, ShoppingBag, Users, BrainCircuit, RefreshCw, 
  ToggleLeft, ToggleRight, Check, Plus, Edit3, Trash2, ArrowRight
} from "lucide-react";
import { Product, Order } from "../types";

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (updatedList: Product[]) => void;
  onSetView: (view: string) => void;
}

const COLORS_CHART = ["#C5A059", "#D4AF37", "#1A1A1A", "#8A7343", "#333333"];

export default function AdminPanel({
  products,
  onUpdateProducts,
  onSetView
}: AdminPanelProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [aiLogs, setAiLogs] = useState<{ query: string; count: number; date: string }[]>([]);
  const [systemDirective, setSystemDirective] = useState("");
  const [directiveStatus, setDirectiveStatus] = useState("");

  // Product form state for adding a new creation
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("Aura");
  const [newCategory, setNewCategory] = useState("Skincare");
  const [newPrice, setNewPrice] = useState(75);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600");

  useEffect(() => {
    // Fetch all orders on server
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        if (data.length > 0) setSelectedOrder(data[0]);
      })
      .catch(err => console.error("Error loading admin orders:", err));

    // Load custom AI system directives if saved
    fetch("/api/ai/directive")
      .then(res => res.json())
      .then(data => {
        if (data.directive) setSystemDirective(data.directive);
      })
      .catch(err => console.error("Error loading AI directive:", err));

    // Hardcode some gorgeous mock logs for standard operational compliance
    setAiLogs([
      { query: "Which elixirs are recommended for oily skin?", count: 48, date: "Today" },
      { query: "Is La Rose Céleste certified vegan?", count: 32, date: "Today" },
      { query: "Which lipstick shade pairs with gold skin tones?", count: 27, date: "Yesterday" },
      { query: "Recommend a high-end amber floral fragrance.", count: 19, date: "Yesterday" }
    ]);
  }, []);

  // Update order delivery status on server
  const handleAdvanceOrderStatus = (orderId: string, currentStatus: string) => {
    let nextStatus = "Placed";
    if (currentStatus === "Placed") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Out for Delivery";
    else if (currentStatus === "Out for Delivery") nextStatus = "Delivered";
    else return; // already delivered

    fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(updatedOrder => {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
      })
      .catch(err => console.error("Error advancing order status:", err));
  };

  // Submit System AI Directive to direct chatbot responses on server
  const handleSaveDirective = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectiveStatus("");

    fetch("/api/ai/directive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ directive: systemDirective })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setDirectiveStatus("Gemini AI neural weighting rules successfully updated!");
          setTimeout(() => setDirectiveStatus(""), 3000);
        }
      })
      .catch(err => console.error("Error saving directive:", err));
  };

  // Create new product item in catalog list
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDescription) return;

    const payload = {
      name: newName,
      brand: newBrand,
      category: newCategory,
      price: newPrice,
      description: newDescription,
      image: newImage,
      hoverImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
      ingredients: ["Rose Centifolia Stem Cells", "Gold Peptides", "Organic Shea Butter"],
      howToUse: "Apply morning and evening onto cleansed facial contours.",
      benefits: ["Intense structural hydration", "Calms immediate skin redness"],
      rating: 5.0,
      reviewsCount: 1,
      isBestSeller: true,
      isNewArrival: true,
      sizes: ["30ml", "50ml"]
    };

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(newProd => {
        onUpdateProducts([...products, newProd]);
        setIsAdding(false);
        setNewName("");
        setNewDescription("");
      })
      .catch(err => console.error("Error adding product:", err));
  };

  // Toggle flash sale discount on server
  const handleToggleFlashSale = (prod: Product) => {
    const isCurrentlySale = !!prod.isFlashSale;
    const updatedPayload = {
      isFlashSale: !isCurrentlySale,
      flashSalePrice: !isCurrentlySale ? Math.floor(prod.price * 0.8) : undefined
    };

    fetch(`/api/products/${prod.id}/flash`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPayload)
    })
      .then(res => res.json())
      .then(updatedProd => {
        onUpdateProducts(products.map(p => p.id === prod.id ? updatedProd : p));
      })
      .catch(err => console.error("Error toggling flash sale:", err));
  };

  // Calculate high-fidelity KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((sub, i) => sub + i.quantity, 0), 0);
  const totalOrdersCount = orders.length;

  // Chart 1 Data: Monthly Revenue (simulated with realistic business data plus actual orders)
  const salesChartData = [
    { name: "Feb", Sales: 14200 },
    { name: "Mar", Sales: 18400 },
    { name: "Apr", Sales: 22100 },
    { name: "May", Sales: 26800 },
    { name: "Jun", Sales: 31200 },
    { name: "Jul", Sales: 31200 + totalRevenue }
  ];

  // Chart 2 Data: Sales by Category distribution
  const categoryChartData = [
    { name: "Skincare", value: products.filter(p => p.category === "Skincare").length },
    { name: "Makeup", value: products.filter(p => p.category === "Makeup").length },
    { name: "Fragrances", value: products.filter(p => p.category === "Fragrance").length },
    { name: "Haircare", value: products.filter(p => p.category === "Haircare").length }
  ];

  return (
    <div className="py-28 max-w-7xl mx-auto px-6 select-none font-sans space-y-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">Maison Headquarters</span>
          <h1 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-wide">Business Intelligence Portal</h1>
        </div>
        <button 
          onClick={() => onSetView("shop")}
          className="text-xs text-[#C5A059] uppercase tracking-widest font-bold hover:underline flex items-center space-x-1"
        >
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 bg-[#1A1A1A] text-white rounded-2xl border border-white/5 space-y-2">
          <TrendingUp className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Total Sales Invoice</span>
          <span className="font-mono text-2xl font-bold block text-[#C5A059]">${totalRevenue + 143900}</span>
          <span className="text-[9px] text-green-400 block font-light">+18.4% compared to Q1</span>
        </div>

        <div className="p-5 bg-white border border-[#E5E1D8] rounded-2xl space-y-2 shadow-xs">
          <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Total Orders Placed</span>
          <span className="font-mono text-2xl font-bold block text-gray-900">{totalOrdersCount + 1340}</span>
          <span className="text-[9px] text-gray-500 block">Average cart size: $105</span>
        </div>

        <div className="p-5 bg-white border border-[#E5E1D8] rounded-2xl space-y-2 shadow-xs">
          <Users className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">VIP Members Registries</span>
          <span className="font-mono text-2xl font-bold block text-gray-900">4,289</span>
          <span className="text-[9px] text-green-700 block font-semibold">92% customer retention rate</span>
        </div>

        <div className="p-5 bg-white border border-[#E5E1D8] rounded-2xl space-y-2 shadow-xs">
          <BrainCircuit className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">AI Queries Directed</span>
          <span className="font-mono text-2xl font-bold block text-gray-900">18,340</span>
          <span className="text-[9px] text-purple-700 block font-medium">98.2% accuracy confidence</span>
        </div>

      </div>

      {/* CHARTS GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Sales Chart (Bar) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">Gross Revenue Pipeline</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={11} />
                <YAxis stroke="#999" fontSize={11} />
                <Tooltip cursor={{ fill: '#FAF9F6' }} />
                <Bar dataKey="Sales" fill="#C5A059" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution (Pie) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <h4 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">Category Allocation</h4>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CORE ADMINISTRATIVE DATA SUPERVISORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRODUCTS & INVENTORY CONTROL */}
        <div className="lg:col-span-7 bg-white border border-[#E5E1D8] p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif text-lg text-gray-900 uppercase">Atelier Catalog controller</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#C5A059] rounded font-sans text-[10px] tracking-widest uppercase font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Creation</span>
            </button>
          </div>

          {/* Form to add a product */}
          {isAdding && (
            <form onSubmit={handleAddProduct} className="p-4 bg-[#FAF9F6] rounded-xl border border-[#E5E1D8] space-y-4">
              <h4 className="font-serif text-xs uppercase tracking-widest text-gray-800 font-semibold">New Luxury Formulation Profile</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Creation Name</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Saphir Purifying Toner"
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Brand Maison</label>
                  <select 
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Aura">Aura</option>
                    <option value="Christian Dior">Christian Dior</option>
                    <option value="Chanel">Chanel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Fragrance">Fragrance</option>
                    <option value="Haircare">Haircare</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Retail Price ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Visual Unsplash Photo URL</label>
                  <input 
                    type="url" 
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[8px] tracking-widest text-gray-400 uppercase font-bold">Editorial Description</label>
                  <textarea 
                    required
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="A magical cellular renewal elixer..."
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 font-sans text-[10px] tracking-widest uppercase font-semibold rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-1.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded"
                >
                  Publish Creation
                </button>
              </div>
            </form>
          )}

          {/* Catalog products list table */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map(prod => {
              const isSale = !!prod.isFlashSale;
              return (
                <div key={prod.id} className="p-3.5 bg-white border border-gray-100 rounded-xl flex items-center justify-between text-xs shadow-xs hover:border-[#C5A059]">
                  <div className="flex items-center space-x-3">
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded" />
                    <div>
                      <h5 className="font-serif text-gray-900 font-semibold">{prod.name}</h5>
                      <span className="text-[9px] text-gray-400 uppercase font-sans font-bold tracking-wider">{prod.category} • ${prod.price}</span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center space-x-4">
                    {/* Flash Sale toggle */}
                    <button 
                      onClick={() => handleToggleFlashSale(prod)}
                      className="flex items-center space-x-1 text-[10px] uppercase font-bold font-sans tracking-widest"
                    >
                      {isSale ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-red-700" />
                          <span className="text-red-700">Sale On</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                          <span className="text-gray-400">Sale Off</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: AI CONSOLE DIRECTIVE OVERRIDE & ORDERS DISPATCH */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Directive controller */}
          <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-5 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-sm tracking-widest text-[#1A1A1A] uppercase">AI Assistant Directive Controller</h3>
            </div>
            
            <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
              Override the standard Gemini context weights. Write a promotional directive (e.g. "Recommend 'Absolute Gold' serum with highest priority") which is auto-appended to chatbot conversations.
            </p>

            {directiveStatus && (
              <p className="p-2 bg-green-50 border border-green-100 text-green-700 text-[10px] rounded font-sans font-semibold">
                {directiveStatus}
              </p>
            )}

            <form onSubmit={handleSaveDirective} className="space-y-3">
              <textarea 
                rows={3}
                value={systemDirective}
                onChange={(e) => setSystemDirective(e.target.value)}
                placeholder="Direct the AI Assistant chérie to focus on..."
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] font-sans"
              />
              
              <button 
                type="submit"
                className="w-full py-2 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#FAF9F6] font-sans text-[9px] tracking-widest uppercase font-semibold rounded cursor-pointer transition-colors"
              >
                Inject Neural Directive
              </button>
            </form>
          </div>

          {/* Orders timeline dispatcher */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 max-h-80 overflow-y-auto">
            <h3 className="font-serif text-sm tracking-widest text-gray-900 uppercase">Live Deliveries Dispatcher</h3>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-xs italic">No orders received on the server registry yet.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-3 bg-neutral-50 rounded-lg space-y-2 border border-gray-100 text-xs font-sans">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span className="font-mono">{order.id}</span>
                    <span className="text-[#C5A059] font-mono">${order.total}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span>Status: <strong className="text-green-700 uppercase">{order.status}</strong></span>
                    
                    {order.status !== "Delivered" && (
                      <button 
                        onClick={() => handleAdvanceOrderStatus(order.id, order.status)}
                        className="px-2 py-1 bg-[#C5A059]/20 text-[#1A1A1A] font-semibold tracking-widest uppercase rounded hover:bg-[#C5A059]/40 text-[9px]"
                      >
                        Advance Pipeline →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
