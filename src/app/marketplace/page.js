'use client';
import { motion } from 'framer-motion';
import { MapPin, Clock, Search } from 'lucide-react';

export default function Marketplace() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Food</h1>
            <p className="text-gray-500">Find fresh surplus near your location.</p>
          </div>
          
          {/* Search Bar - Makes it feel like a real platform */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
        </header>

        {/* This will eventually be your grid of food items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
               {/* Placeholder for food image */}
               <div className="w-full h-full flex items-center justify-center text-gray-400 italic">Food Image</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Assorted Pastries</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2 mb-4">
              <MapPin size={14} /> <span>Downtown Bakery • 0.8 miles away</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <span className="flex items-center gap-1 text-orange-600 font-medium text-sm">
                <Clock size={14} /> Expires in 45m
              </span>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                Claim Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}