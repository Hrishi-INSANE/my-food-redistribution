import "./globals.css";
import Link from 'next/link'; 
import { Utensils, LogOut, User } from 'lucide-react'; 
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Added Auth Context 
import Navbar from '@/components/Navbar';

// We create a small sub-component for the Nav links to use the Auth Hook [cite: 340]


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* The AuthProvider must wrap EVERYTHING to broadcast the user status  */}
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}