"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function FarmerDashboard() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('products').insert([{
      name: formData.get('name'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      farmer_name: "Hackathon Farm Co." 
    }]);

    setLoading(false);
    if (error) alert("Error adding product: " + error.message);
    else {
      alert("Product added live to marketplace!");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-green-700 font-bold mb-8 block">&larr; Back Home</Link>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-green-900 mb-6">Farmer Dashboard</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Produce Name</label>
              <input name="name" type="text" required className="w-full border p-2 rounded" placeholder="e.g., Organic Tomatoes" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                <input name="price" type="number" required className="w-full border p-2 rounded" placeholder="150" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Amount</label>
                <input name="stock" type="number" required className="w-full border p-2 rounded" placeholder="50" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition">
              {loading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}