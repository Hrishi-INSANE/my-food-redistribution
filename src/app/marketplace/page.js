'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { Search, MapPin, Utensils, Heart } from 'lucide-react';

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Listen only for "available" food
  useEffect(() => {
    const q = query(collection(db, "donations"), where("status", "==", "available"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const claimFood = async (itemId) => {
    const foodRef = doc(db, "donations", itemId);
    await updateDoc(foodRef, { status: "claimed" });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Marketplace</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for fresh food..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.filter(item => item.foodName.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-100 text-green-600 p-3 rounded-2xl w-fit mb-4">
                <Utensils size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{item.foodName}</h3>
              <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                <MapPin size={14} /> Available for pickup
              </p>
              <button 
                onClick={() => claimFood(item.id)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Claim Donation <Heart size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}