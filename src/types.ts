/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  hoverImage: string;
  description: string;
  ingredients: string[];
  howToUse: string;
  benefits: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  skinType?: ("All" | "Dry" | "Oily" | "Sensitive" | "Combination")[];
  spf?: string;
  isCrueltyFree: boolean;
  isVegan: boolean;
  isOrganic: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulVotes: number;
  images?: string[];
  video?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "manager";
  beautyProfile?: BeautyProfile;
  rewardsPoints: number;
  savedAddresses: Address[];
}

export interface BeautyProfile {
  skinType: "Dry" | "Oily" | "Sensitive" | "Combination" | "Normal";
  skinConcerns: string[];
  skinUndertone: "Warm" | "Cool" | "Neutral";
  hairType: "Straight" | "Wavy" | "Curly" | "Coily" | "Not Applicable";
  makeupPreference: "Natural" | "Glam" | "Minimalist" | "Editorial";
}

export interface Address {
  id: string;
  label: string; // Home, Work, etc.
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: "stripe" | "paypal" | "cod" | "giftcard";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  trackingTimeline: { status: string; date: string; description: string; done: boolean }[];
  invoiceUrl?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface BeautyTip {
  id: string;
  title: string;
  stepByStep: string[];
  skinType?: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  productsUsed: string[];
}
