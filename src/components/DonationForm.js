'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase'; // Your cloud bridge
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Clock, Info } from 'lucide-react';

export default function DonationForm({ isOpen, onClose }) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName) return;

    try {
      // THE CLOUD SHOUT: Sending data directly to Firestore [cite: 531, 536]
      await addDoc(collection(db, "donations"), {
        foodName: foodName,
        quantity: quantity,
        status: "available", // Default status so it shows in Marketplace [cite: 598]
        createdAt: serverTimestamp() // Professional way to track time 
      });

      // Reset and Close
      setFoodName("");
      setQuantity("");
      onClose();
    } catch (error) {
      console.error("Error adding to cloud: ", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Side Panel [cite: 209, 213] */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">New Donation</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name</label>
                <input 
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Fresh Bagels"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-100 mt-4"
              >
                Post Listing
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}