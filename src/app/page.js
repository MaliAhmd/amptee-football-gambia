"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestBlogs() {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestBlogs();
  }, []);

  return (
    <div className="flex-1 w-full relative">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm text-accent-gold ring-1 ring-inset ring-accent-gold/20 mb-8 bg-accent-gold/10 backdrop-blur-sm">
          <span>The heartbeat of Gambian football</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase">
          Empowering <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-gold">Amptee Football</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          The central hub for all updates, fixtures, match analysis, and inside stories 
          from the fastest-growing football community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="rounded-md bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
            Read Latest Articles <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/about" className="rounded-md bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all shadow-sm">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 bg-black/40 border-t border-white/5 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase border-l-4 border-accent-gold pl-4">Latest Action</h2>
              <p className="mt-2 text-lg leading-8 text-gray-400">
                Catch up on the newest stories and match analyses.
              </p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center text-accent-gold hover:text-white transition-colors gap-2 font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="h-64 bg-white/5 rounded-xl"></div>
                  <div className="h-6 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              blogs.map((post) => (
                <article key={post.id} className="flex flex-col items-start justify-between group overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 duration-300 transform hover:-translate-y-1">
                  <div className="relative w-full">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="aspect-video w-full w-full object-cover sm:aspect-2/1 lg:aspect-3/2 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="aspect-video w-full w-full bg-gradient-to-br from-primary/20 to-black sm:aspect-2/1 lg:aspect-3/2 flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="max-w-xl p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-x-4 text-xs">
                      {post.createdAt && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-xl font-bold leading-6 text-white group-hover:text-accent-gold transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                        {post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : "Read the full article...")}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
                <div className="col-span-3 text-center py-20 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400">No recent articles found.</p>
                </div>
            )}
          </div>
          
          <div className="mt-10 flex md:hidden justify-center">
             <Link href="/blog" className="flex items-center text-accent-gold hover:text-white transition-colors gap-2 font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Ensure you import Trophy if needed since it was used in fallback
function Trophy(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 5.5-3.6 6.3 3.6 6.3s3.6-.8 3.6-6.3v-2.34" />
      <path d="M8 9v2x" />
      <path d="M16 11V9" />
      <path d="M9 11h6" />
      <path d="M10 22v-3" />
      <path d="M14 22v-3" />
      <path d="M6 5h12v4a6 6 0 0 1-12 0V5Z" />
    </svg>
  );
}
