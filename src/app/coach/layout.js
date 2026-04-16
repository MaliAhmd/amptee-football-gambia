"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, Activity } from "lucide-react";
import Cookies from "js-cookie";

export default function CoachLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        Cookies.remove('firebaseToken');
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove('firebaseToken');
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-white/10 hidden md:block flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full filter blur-3xl" />
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-10">
             <Activity className="h-6 w-6 text-green-400" />
            <span className="text-xl font-bold uppercase tracking-wide">Coach Portal</span>
          </Link>
          <nav className="space-y-2">
             <Link href="/coach/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/coach/dashboard" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <Users className="h-5 w-5" /> Team Roster
             </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-accent-red transition-all w-full px-4 py-3 rounded-xl hover:bg-white/5">
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
