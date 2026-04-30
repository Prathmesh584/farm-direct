import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-extrabold text-green-900 mb-6">Farm Direct</h1>
      <p className="text-xl text-gray-700 max-w-2xl mb-10">
        Bypassing the middlemen. Connecting local farmers directly with consumers using Edge networks and real-time inventory.
      </p>
      
      <div className="flex gap-6">
        <Link href="/dashboard" className="px-8 py-4 bg-white text-green-800 font-bold rounded-xl shadow-lg border border-green-200 hover:bg-green-100 transition">
          Farmer Login
        </Link>
        <Link href="/marketplace" className="px-8 py-4 bg-green-700 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition">
          Shop Marketplace
        </Link>
      </div>
    </div>
  );
}