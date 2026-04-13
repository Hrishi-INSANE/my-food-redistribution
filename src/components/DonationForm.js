'use client';
import { useState } from 'react'; // 1. Import useState
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function DonationForm({ isOpen, onClose }) {
  const [foodName, setFoodName] = useState(''); // 2. Create the "memory" for the input

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Listing posted: ${foodName}`); // Just a test for now!
    setFoodName(''); // Clear the form
    onClose(); // Close the slide-over
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 p-8 border-l border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">New Donation</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Food Item Name</label>
                <input 
                  type="text" 
                  value={foodName} 
                  onChange={(e) => setFoodName(e.target.value)} // 3. Update memory as user types
                  placeholder="e.g. 10x Fresh Sandwiches" 
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500" 
                  required
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition">
                Post Listing
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}