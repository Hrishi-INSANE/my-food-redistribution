import "./globals.css";
import Link from 'next/link'; // The "Pro" way to switch pages without refreshing 
import { Utensils } from 'lucide-react'; // Crisp icon for your brand [cite: 106]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Persistent Navigation Bar [cite: 160] */}
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold text-green-600 text-xl italic">
            <Utensils size={24} />
            <span>FoodShare</span>
          </div>
          
          <div className="flex gap-8 font-medium text-gray-600">
            {/* These Links allow the React Compiler to keep transitions smooth [cite: 157, 165] */}
            <Link href="/" className="hover:text-green-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="hover:text-green-600 transition-colors">
              Marketplace
            </Link>
          </div>

          <div className="hidden md:block">
            <button className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-100">
              Sign In
            </button>
          </div>
        </nav>

        {/* This renders the content of whichever page you are currently visiting [cite: 162] */}
        {children}
      </body>
    </html>
  );
}