"use client";
import { useRealTimeProducts } from '@/components/shared/useRealTimeProducts';
import { processCheckout } from '@/lib/actions/checkout';
import { useState } from 'react';
import Link from 'next/link';

export default function MarketplacePage() {
  const { products, loading } = useRealTimeProducts();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleCheckout = async (productId: string) => {
    setBuyingId(productId);
    const result = await processCheckout(productId); 
    if (result?.error) alert(result.error);
    else alert("Purchase successful! Funds held in escrow.");
    setBuyingId(null);
  };

  if (loading) return <div className="p-8 text-center text-xl mt-20">Loading live inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link href="/" className="text-green-700 font-bold mb-8 block">&larr; Back Home</Link>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Consumer Marketplace</h1>
        <p className="text-gray-600 mb-8">Live local inventory. When someone buys an item, stock drops instantly.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-4">Farm: {product.farmer_name}</p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-green-700">₹{product.price}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                </span>
              </div>
              <button 
                onClick={() => handleCheckout(product.id)}
                disabled={product.stock <= 0 || buyingId === product.id}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition"
              >
                {buyingId === product.id ? 'Processing...' : 'Buy via Escrow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}