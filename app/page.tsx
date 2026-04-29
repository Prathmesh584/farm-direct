"use client";
import { motion } from 'framer-motion';
import { Tractor, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-green-900 tracking-tight mb-6">
          Fresh from Bhopal's Farms to Your Table
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Support local farmers in Sehore, Vidisha, and Raisen. Buy organic vegetables and grains directly, cutting out the middlemen.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/marketplace" className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">
            <ShoppingBasket size={20} /> Shop Now
          </Link>
          <Link href="/register?role=farmer" className="flex items-center gap-2 bg-white text-green-700 border border-green-200 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition">
            <Tractor size={20} /> Sell Produce
          </Link>
        </div>
      </motion.div>
    </main>
  );
}