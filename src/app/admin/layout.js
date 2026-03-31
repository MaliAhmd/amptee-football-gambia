"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, FileText, Settings, Trophy, ShoppingBag } from "lucide-react";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If on login page, just render it without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (!user) return null; // Wait for redirect

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-white/10 hidden md:block flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl" />
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <Trophy className="h-6 w-6 text-accent-gold" />
            <span className="text-xl font-bold uppercase tracking-wide">Amptee Admin</span>
          </Link>
          <nav className="space-y-2">
             <Link href="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/admin/dashboard" ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <LayoutDashboard className="h-5 w-5" /> Dashboard
             </Link>
             <Link href="/admin/about" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/admin/about" ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <Settings className="h-5 w-5" /> About Settings
             </Link>
             <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/admin/products" ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <ShoppingBag className="h-5 w-5" /> Products
             </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
          <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-gray-400 hover:text-accent-red transition-all w-full px-4 py-3 rounded-xl hover:bg-white/5">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
