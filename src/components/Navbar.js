'use client'; 
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LogOut, User, LayoutDashboard, Store } from 'lucide-react'; // Added icons

export default function Navbar() {
  const { user, logOut, role } = useAuth(); // Now asking for the 'role' signal

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-green-600 text-xl italic">
        <Utensils size={24} />
        <span>FoodShare</span>
      </div>
      
      {/* ROLE-AWARE NAVIGATION */}
      <div className="flex gap-8 font-medium text-gray-600">
        {/* If user is a Donor, prioritize the Dashboard */}
        {role === 'donor' && (
          <Link href="/" className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        )}
        
        {/* If user is a Recipient, prioritize the Marketplace */}
        {role === 'recipient' && (
          <Link href="/marketplace" className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <Store size={18} />
            Marketplace
          </Link>
        )}

        {/* Both can see the Marketplace, but we can label it differently for Donors */}
        {role === 'donor' && (
          <Link href="/marketplace" className="hover:text-green-600 transition-colors">
            View Live Listings
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <User size={18} className="text-gray-400" />
              <div className="flex flex-col leading-none text-left">
                <span className="text-xs font-bold text-gray-700 capitalize">{role || 'User'}</span>
                <span className="text-[10px] text-gray-400 font-medium">{user.displayName}</span>
              </div>
            </div>
            <button onClick={logOut} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 shadow-md">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}