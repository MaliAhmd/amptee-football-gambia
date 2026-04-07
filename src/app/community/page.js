"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Filter, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Free Football",
  "Regional Football",
  "Club Football",
  "Engagement"
];

export default function CommunityPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "community"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching community items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    activeFilter === "All" || item.category === activeFilter
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full filter blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full filter blur-[120px] pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
             <Users className="h-4 w-4 text-primary" />
             <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Community Engagement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-6 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">Community</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            Discover the heart of our operations. From free local events to regional tournaments, see how we unite players and fans alike.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-white/50 text-sm font-bold uppercase tracking-wider mr-2 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter by:
            </span>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeFilter === category 
                    ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(22,163,74,0.4)]" 
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Users className="mx-auto h-16 w-16 text-gray-500 mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No Programs Found</h3>
            <p className="text-gray-400">There are currently no community programs matching this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-[#111] backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)]"
              >
                <div className="relative h-64 overflow-hidden bg-black/40">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="h-20 w-20 text-gray-600 opacity-30" />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow relative z-10 -mt-6">
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/community/${item.id}`}>
                      <span className="absolute inset-0 z-10" />
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
                    {item.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "Community Event"}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
