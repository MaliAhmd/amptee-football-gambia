"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trophy, Users, Shield, Globe } from "lucide-react";

export default function About() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const docRef = doc(db, "settings", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content || "");
          setImageUrl(docSnap.data().imageUrl || "");
        } else {
          setContent("Amptee Football Gambia is your premier destination for football news, updates, and analyses. Our platform is dedicated to bringing the passion of Gambian and international football straight to your screens.");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  return (
    <div className="bg-background min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-primary/10 rounded-full filter blur-[100px] opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent-gold/10 rounded-full filter blur-[100px] opacity-30" />
      
      {/* Hero Header Section */}
      <section className="relative py-24 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-gold">Us</span>
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-16 font-medium">
          Driven by passion, dedicated to the beautiful game.
        </p>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-14 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {imageUrl && (
            <div className="mb-12 relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-black/40">
               <img src={imageUrl} alt="Amputee Football Cover" className="w-full h-auto max-h-[600px] object-contain transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                 <div className="flex items-center gap-3">
                   <Trophy className="h-8 w-8 text-accent-gold" />
                   <h2 className="text-white text-2xl font-bold uppercase tracking-wide">The Legacy</h2>
                 </div>
               </div>
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-accent-gold">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-11/12"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-4/5"></div>
              </div>
            ) : (
              content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="text-gray-300 mb-6 text-lg md:text-xl font-light">{paragraph}</p> : <br key={idx} />
              ))
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-24 max-w-2xl sm:mt-32 lg:mt-32 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center group">
              <dt className="flex items-center gap-x-3 text-2xl font-bold leading-7 text-white uppercase tracking-wider mb-6">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/20">
                  <Users className="h-8 w-8" aria-hidden="true" />
                </div>
              </dt>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Community</h3>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">Building a resilient, engaged family of enthusiasts and pros who live and breathe football.</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center group">
              <dt className="flex items-center gap-x-3 text-2xl font-bold leading-7 text-white uppercase tracking-wider mb-6">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-accent-blue/20 text-accent-blue ring-1 ring-accent-blue/30 group-hover:bg-accent-blue group-hover:text-white transition-all shadow-lg shadow-accent-blue/20">
                  <Globe className="h-8 w-8" aria-hidden="true" />
                </div>
              </dt>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Coverage</h3>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">From grassroots to international levels, delivering comprehensive, uncompromising coverage.</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center group">
              <dt className="flex items-center gap-x-3 text-2xl font-bold leading-7 text-white uppercase tracking-wider mb-6">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-accent-gold/20 text-accent-gold ring-1 ring-accent-gold/30 group-hover:bg-accent-gold group-hover:text-white transition-all shadow-lg shadow-accent-gold/20">
                  <Shield className="h-8 w-8" aria-hidden="true" />
                </div>
              </dt>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Integrity</h3>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">Reporting the facts, analyzing the tactics, and celebrating the game with pure honesty.</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
