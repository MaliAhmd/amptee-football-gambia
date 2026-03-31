"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Trophy, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="max-w-md w-full space-y-8 bg-black/40 p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative">
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-gold/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        
        <div className="text-center relative">
          <div className="mx-auto h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/30 shadow-lg shadow-primary/20">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to manage Amptee Football</p>
        </div>
        
        <form className="mt-8 space-y-6 relative" onSubmit={handleLogin}>
          {error && (
             <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
               {error}
             </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="sr-only">Email address</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/10 bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/10 bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-wide rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
