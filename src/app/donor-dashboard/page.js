'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { Plus, Package, Clock } from 'lucide-react';
import DonationForm from '@/components/DonationForm';

export default function DonorDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [donations, setDonations] = useState([]);

  // Gatekeeper
  useEffect(() => {
    if (loading) return;

    if (!user) return router.replace('/login');
    if (role === null) return;
    if (role !== 'donor') return router.replace('/');
  }, [user, role, loading, router]);

  // Fetch
  useEffect(() => {
    if (!user || role !== 'donor') return;

    const q = query(
      collection(db, "donations"),
      where("donorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, [user, role]);

  if (loading || !user || role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Donor Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your food donations
            </p>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700 shadow-md"
          >
            <Plus size={18} />
            Add Donation
          </button>
        </div>

        {/* 🔥 STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {donations.length}
            </p>
          </div>

          <div className="bg-green-600 text-white rounded-2xl p-5 shadow-md">
            <p className="text-sm opacity-80">Available</p>
            <p className="text-2xl font-bold">
              {donations.filter(d => d.status === 'available').length}
            </p>
          </div>

          <div className="bg-yellow-100 rounded-2xl p-5 border">
            <p className="text-yellow-800 text-sm">Requests</p>
            <p className="text-2xl font-bold text-yellow-900">
              {donations.filter(d => d.status === 'requested').length}
            </p>
          </div>

        </div>

        {/* 🔥 MAIN LIST */}
        <div className="bg-white rounded-2xl p-6 shadow border">

          <div className="flex items-center gap-2 mb-6">
            <Package className="text-green-600" size={22} />
            <h2 className="text-lg font-bold text-gray-900">
              Your Donations
            </h2>
          </div>

          <div className="space-y-4">

            {donations.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No donations yet
              </p>
            ) : (
              donations.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border transition hover:shadow-sm ${
                    item.status === 'requested'
                      ? 'bg-yellow-50 border-yellow-200'
                      : item.status === 'accepted'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >

                  {/* TOP */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.foodName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity || 'No quantity'}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-700 capitalize">
                      {item.status || 'available'}
                    </span>
                  </div>

                  {/* REQUEST */}
                  {item.status === 'requested' && (
                    <div className="mt-4">

                      <p className="text-xs text-gray-700 mb-2">
                        Request from: {item.requestedByEmail}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "donations", item.id), {
                              status: "accepted",
                              claimedByUID: item.requestedByUID,
                              claimedByEmail: item.requestedByEmail
                            });
                          }}
                          className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                        >
                          Accept
                        </button>

                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "donations", item.id), {
                              status: "available",
                              requestedByUID: null,
                              requestedByEmail: null
                            });
                          }}
                          className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>

                    </div>
                  )}

                  {/* ACCEPTED */}
                  {item.status === 'accepted' && (
                    <div className="mt-3 text-xs text-green-700">
                      Accepted by: {item.claimedByEmail}
                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        </div>

      </div>

      <DonationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </main>
  );
}