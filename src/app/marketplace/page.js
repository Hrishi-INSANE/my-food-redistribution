'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import { MapPin, Utensils } from 'lucide-react';

export default function Marketplace() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  // 🔥 Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Gatekeeper
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (role === null) return;

    if (role !== 'recipient') {
      router.replace('/');
    }
  }, [user, role, loading, router]);

  // Fetch
  useEffect(() => {
    if (!user || role !== 'recipient') return;

    const q = query(collection(db, "donations"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, [user, role]);

  // 🔥 Countdown logic
  const getTimeLeft = (item) => {
    if (!item.createdAt || !item.expiryHours) return null;

    const created = item.createdAt.seconds * 1000;
    const expiry = created + item.expiryHours * 60 * 60 * 1000;
    const diff = expiry - currentTime;

    if (diff <= 0) return "expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const markInterested = async (itemId) => {
    await updateDoc(doc(db, "donations", itemId), {
      status: "interested",
      interestedByUID: user.uid,
      interestedByEmail: user.email
    });
  };

  const requestFood = async (itemId) => {
    await updateDoc(doc(db, "donations", itemId), {
      status: "requested",
      requestedByUID: user.uid,
      requestedByEmail: user.email
    });
  };

  if (loading || !user || role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading marketplace...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* TOP BAR */}
        <div className="mb-8">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketplace
              </h1>
              <p className="text-gray-600 text-sm">
                Find available food near you
              </p>
            </div>

            <div className="bg-white px-4 py-2 rounded-xl border text-sm text-gray-600 shadow-sm">
              🍱 {items.length} listings
            </div>
          </div>

          <input 
            type="text"
            placeholder="Search food..."
            className="w-full max-w-lg p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items
            .filter(item => {
              const matchesSearch = (item.foodName || "").toLowerCase().includes(searchTerm.toLowerCase());
              const timeLeft = getTimeLeft(item);

              return matchesSearch && timeLeft !== "expired"; // 🔥 hide expired
            })
            .map((item) => {
              const timeLeft = getTimeLeft(item);

              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition border border-gray-200">

                  <div className="bg-green-100 text-green-700 p-2 rounded-lg w-fit mb-3">
                    <Utensils size={20} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {item.foodName}
                  </h3>

                  {/* DETAILS */}
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {item.quantity && <p>🍽 {item.quantity}</p>}
                    {item.expiryHours && <p>⏱ {item.expiryHours} hrs</p>}
                  </div>

                  {/* COUNTDOWN */}
                  {timeLeft && (
                    timeLeft === "expired" ? (
                      <p className="text-red-600 text-xs font-semibold mt-1">
                        ❌ Expired
                      </p>
                    ) : (
                      <p className="text-green-600 text-xs font-semibold mt-1">
                        ⏳ {timeLeft} left
                      </p>
                    )
                  )}

                  {/* LOCATION */}
                  <p className="text-gray-700 text-sm mt-2 flex items-center gap-1">
                    <MapPin size={14} /> 
                    {item.status === 'accepted' && item.claimedByUID === user.uid ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline"
                      >
                        {item.location}
                      </a>
                    ) : (
                      'Hidden until accepted'
                    )}
                  </p>

                  {/* STATUS */}
                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {item.status}
                  </span>

                  {/* FLOW */}

                  {item.status === 'available' && (
                    <button
                      onClick={() => markInterested(item.id)}
                      className="w-full mt-4 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      View Details
                    </button>
                  )}

                  {item.status === 'interested' && item.interestedByUID === user.uid && (
                    <>
                      <div className="mt-4 text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                        👀 Interested
                      </div>

                      <button
                        onClick={() => requestFood(item.id)}
                        className="w-full mt-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700"
                      >
                        Request Pickup
                      </button>
                    </>
                  )}

                  {item.status === 'requested' && item.requestedByUID === user.uid && (
                    <div className="mt-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded-lg">
                      ⏳ Waiting approval
                    </div>
                  )}

                  {item.status === 'accepted' && item.claimedByUID === user.uid && (
                    <div className="mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                      <p className="font-semibold">🎉 Approved</p>
                      <p className="mt-2 text-xs">📍 {item.location}</p>
                      <p className="text-xs">📞 {item.phone}</p>
                    </div>
                  )}

                </div>
              );
            })}
        </div>

      </div>
    </main>
  );
}