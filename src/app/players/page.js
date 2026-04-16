"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Search, MapPin, Users, Crosshair } from "lucide-react";

export default function PlayersDirectory() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const [amputationFilter, setAmputationFilter] = useState("All");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const q = query(collection(db, "players"), orderBy("registrationDate", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = 
        (player.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (player.club || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = positionFilter === "All" || player.position === positionFilter;
      const matchesAmputation = amputationFilter === "All" || player.amputationType === amputationFilter;

      return matchesSearch && matchesPosition && matchesAmputation;
    });
  }, [players, searchQuery, positionFilter, amputationFilter]);

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            National <span className="text-primary">Team Directory</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet the incredible athletes defining the future of Amputee Football in Gambia.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#111] p-6 rounded-2xl border border-white/10 mb-10 shadow-xl flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name or club..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <select 
            value={positionFilter} 
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all md:w-48 appearance-none"
          >
            <option value="All" className="bg-[#111] text-white">All Positions</option>
            <option value="Forward" className="bg-[#111] text-white">Forward</option>
            <option value="Midfielder" className="bg-[#111] text-white">Midfielder</option>
            <option value="Defender" className="bg-[#111] text-white">Defender</option>
            <option value="Goalkeeper" className="bg-[#111] text-white">Goalkeeper</option>
          </select>
          <select 
            value={amputationFilter} 
            onChange={(e) => setAmputationFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all md:w-48 appearance-none"
          >
            <option value="All" className="bg-[#111] text-white">All Amputations</option>
            <option value="Lower Limb" className="bg-[#111] text-white">Lower Limb</option>
            <option value="Upper Limb" className="bg-[#111] text-white">Upper Limb</option>
            <option value="Both Lower" className="bg-[#111] text-white">Both Lower</option>
            <option value="Both Upper" className="bg-[#111] text-white">Both Upper</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            No players match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map(player => (
              <Link href={`/players/${player.id}`} key={player.id} className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 block aspect-[3/4]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity"></div>
                {player.imageUrl ? (
                  <img src={player.imageUrl} alt={player.fullName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white/20" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-2 shadow-lg">
                      {player.position}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{player.fullName}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <Crosshair className="h-4 w-4 text-gray-500" />
                      {player.amputationType}
                    </p>
                    <p className="text-sm text-gray-300 flex items-center gap-2 line-clamp-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {player.club || "Unattached"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
