"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, FileText, Settings, Trophy, Globe, Users } from "lucide-react";
import Cookies from "js-cookie";

export default function EditorLayout({ children }) {
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl" />
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-10">
             <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold uppercase tracking-wide">Editor Portal</span>
          </Link>
          <nav className="space-y-2">
             <Link href="/editor/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/editor/dashboard" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <LayoutDashboard className="h-5 w-5" /> Blog Posts
             </Link>
             <Link href="/editor/grassroots" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/editor/grassroots" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <Globe className="h-5 w-5" /> Grassroots
             </Link>
             <Link href="/editor/community" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/editor/community" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <Users className="h-5 w-5" /> Community
             </Link>
             <Link href="/editor/about" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
               pathname === "/editor/about" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}>
               <Settings className="h-5 w-5" /> About Page
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
