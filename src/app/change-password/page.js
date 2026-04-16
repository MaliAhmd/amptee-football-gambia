"use client";

import { useState, useEffect } from "react";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Key } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      // 1. Update password in Auth
      if (user) {
        await updatePassword(user, password);
        
        // 2. Update firstLogin false in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          firstLogin: false
        });
        
        Cookies.set('userFirstLogin', 'false', { expires: 7 });

        // Redirect based on role (fetch role or re-trigger middleware)
        const role = Cookies.get('userRole');
        if (role === 'Admin') window.location.href = "/admin/dashboard";
        else if (role === 'Editor') window.location.href = "/editor/dashboard";
        else if (role === 'Team Coach') window.location.href = "/coach/dashboard";
        else window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || "Failed to update password. You may need to log out and log in again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="max-w-md w-full space-y-8 bg-black/40 p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center relative">
          <div className="mx-auto h-16 w-16 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-accent-gold/30">
            <Key className="h-8 w-8 text-accent-gold" />
          </div>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-400">Please change your password to continue</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
             <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
               {error}
             </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">New Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-wide rounded-xl text-black bg-accent-gold hover:bg-accent-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-gold focus:ring-offset-background transition-all disabled:opacity-70 shadow-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
