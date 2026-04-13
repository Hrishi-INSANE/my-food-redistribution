'use client'; 
import { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { PlusCircle, Package, Heart, ArrowRight, Utensils } from 'lucide-react';
import DonationForm from '@/components/DonationForm'; 
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function DonorDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [donations, setDonations] = useState([]); // Start with an empty list

  // 1. The "Receiver": This listens to the cloud 24/7
  useEffect(() => {
    const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    
    // onSnapshot means "Whenever the cloud changes, do this immediately"
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationList); // Update the screen with real cloud data
    });

    return () => unsubscribe(); // Turn off the radio when we leave the page
      }, []);
    
  return (
    <main className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* 1. Slide-over Form component */}
      <DonationForm 
  isOpen={isFormOpen} 
  onClose={() => setIsFormOpen(false)} 
  // REMOVE: onAddDonation={addDonation} <-- Delete this line!
/>
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Green Bistro Dashboard</h1>
          <p className="text-gray-500">You've helped 12 families this week. Keep it up!</p>
        </header>

        {/* 2. Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
          
          {/* Main Action Cell */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <PlusCircle size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Post New Donation</h2>
              <p className="text-gray-500 text-lg">List surplus food in under 60 seconds.</p>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              Start Listing <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Active Listings Cell */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold mb-6 flex items-center gap-2"><Package size={20}/> Active Listings</h3>
                  <div className="space-y-3">
                    {donations.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                          Expires in {item.expiry}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

          {/* Impact Stats Cell */}
          <div className="bg-orange-500 p-6 rounded-3xl shadow-lg shadow-orange-100 text-white flex flex-col justify-center">
             <Heart className="mb-2 opacity-80" />
             <p className="text-sm opacity-90 font-medium mb-1 uppercase tracking-wider">Total Impact</p>
             <p className="text-5xl font-bold">452</p>
             <p className="text-sm opacity-80 mt-1 italic text-orange-100">Meals Saved</p>
          </div>

          {/* Motivation Cell */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-gray-400 text-sm italic leading-relaxed">
              "Your store is in the <span className="text-green-600 font-bold">top 5%</span> of local donors this month."
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}