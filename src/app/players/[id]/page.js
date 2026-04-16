"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Crosshair, Trophy, Users } from "lucide-react";
import { useParams } from "next/navigation";

export default function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const docRef = doc(db, "players", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlayer({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching player:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-white p-6">
        <h2 className="text-3xl font-bold mb-4">Player Not Found</h2>
        <Link href="/players" className="text-primary hover:text-white transition-colors">
          Return to Directory
        </Link>
      </div>
    );
  }

  // Formatting date safely
  const formattedRegDate = player.registrationDate 
    ? new Date(player.registrationDate.seconds * 1000).toLocaleDateString() 
    : "Unknown date";

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/players" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-10 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Players
        </Link>
        
        <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full filter blur-[80px] z-0 pointer-events-none"></div>
          
          {/* Player Image */}
          <div className="md:w-2/5 relative z-10 w-full aspect-[4/5] md:aspect-auto">
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <Users className="h-32 w-32 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111] via-transparent to-transparent opacity-90 md:opacity-60"></div>
          </div>
          
          {/* Player Info */}
          <div className="md:w-3/5 p-8 md:p-12 relative z-10 flex flex-col justify-center">
             <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg">
                  {player.position}
                </span>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
               {player.fullName}
             </h1>
             <p className="text-xl text-gray-400 font-medium mb-10 flex items-center gap-2">
               <Trophy className="h-5 w-5 text-accent-gold" /> {player.club || "Unattached Free Agent"}
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-10">
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Amputation</h3>
                  <p className="text-lg text-white font-medium flex items-center gap-3">
                    <Crosshair className="h-5 w-5 text-primary" /> {player.amputationType}
                  </p>
               </div>
               
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Player ID</h3>
                  <p className="text-lg text-white font-medium/80 font-mono">
                    {player.playerId || "Pending"}
                  </p>
               </div>
               
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Registration</h3>
                  <p className="text-lg text-white font-medium flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-400" /> {formattedRegDate}
                  </p>
               </div>
             </div>
             
             <div className="mt-12 pt-8 border-t border-white/10">
               <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                 This is an official profile of the Amputee Football Association of Gambia. 
                 Confidential medical flags and direct contact options have been hidden for privacy.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
