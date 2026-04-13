'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';
import DonationForm from '@/components/DonationForm';

export default function DonorDashboard() {
  // 1. ALL HOOKS FIRST
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [donations, setDonations] = useState([]);

  // 2. THE GATEKEEPER (Redirect Logic)
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role === null) {
        router.push('/role-selection');
      } else if (role === 'recipient') {
        router.push('/marketplace');
      }
    }
  }, [user, role, loading, router]);

  // 3. THE DATA FETCHER (Listen to Firebase)
useEffect(() => {
  if (!user || role !== 'donor') return;

  // 1. Define the collection reference
  const donationsRef = collection(db, "donations");

  // 2. Define the query 'q' (This is what was missing!)
  // We're querying all donations where the donor is the current user
  const q = query(donationsRef); 

  // 3. Use 'q' in the listener
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const allItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setDonations(allItems);
  });

  return () => unsubscribe();
}, [user, role]);

  // 4. THE LOADING GUARD (Prevents the Black Screen)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-gray-400">Loading your dashboard...</div>
      </div>
    );
  }

  // 5. THE SECURITY GUARD (Hides UI if not authorized)
  if (!user || role !== 'donor') return null;

  // 6. THE BENTO GRID (Your actual Dashboard)
// 6. THE BENTO GRID (Your actual Dashboard)
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            <Plus size={20} />
            Start Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {/* Main List Box (Large) */}
          <div className="md:col-span-3 md:row-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-green-600" size={24} />
              <h2 className="text-xl font-bold">Active Donations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {donations.length === 0 ? (
                <p className="text-gray-400 italic text-center py-10">No active listings yet. Post some food!</p>
              ) : (
                donations.map((item) => (
                  <div key={item.id} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                    item.status === 'claimed' ? 'bg-gray-100 opacity-60 border-transparent' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.foodName}</h4>
                      <p className="text-sm text-gray-500">
                        {item.status === 'claimed' ? 'Claimed! Preparation needed.' : (item.quantity || 'Available for pickup')}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      item.status === 'claimed' ? 'bg-gray-300 text-gray-600' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status || 'available'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats Box (Small) */}
          <div className="bg-green-600 rounded-3xl p-6 shadow-lg shadow-green-100 text-white flex flex-col justify-center items-center">
            <span className="text-4xl font-bold">{donations.filter(d => d.status !== 'claimed').length}</span>
            <span className="text-sm opacity-80 uppercase tracking-wider font-semibold">Ready Now</span>
          </div>

          {/* Schedule Box (Tall) */}
          <div className="md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <Clock size={20} />
              <h3 className="font-bold">Next Pickup</h3>
            </div>
            {donations.some(d => d.status === 'claimed') ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">You have items ready for pickup!</p>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-700 text-xs">
                  Check your Active List for claimed items.
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Waiting for claims...</p>
            )}
          </div>
        </div>
      </div>

      <DonationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </main>
  );
}