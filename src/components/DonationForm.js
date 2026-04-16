'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function DonationForm({ isOpen, onClose }) {
  const { user } = useAuth();

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [expiryHours, setExpiryHours] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !user) return;

    try {
      await addDoc(collection(db, "donations"), {
        foodName,
        quantity,
        phone,
        location,
        expiryHours: Number(expiryHours) || null,

        donorId: user.uid,
        donorEmail: user.email,

        status: "available",
        createdAt: serverTimestamp()
      });

      setFoodName("");
      setQuantity("");
      setPhone('');
      setLocation('');
      setExpiryHours('');

      onClose();

    } catch (error) {
      console.error("Error adding donation:", error);
      alert("Failed to post donation");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                New Donation
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Input style FIXED */}
              <input 
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Food Name"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />

              <input 
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Pickup Phone"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />

              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pickup Location"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />

              <input 
                type="number"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                placeholder="Valid for (hours)"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md transition"
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