"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trophy, ArrowRight } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="bg-background min-h-screen py-24 relative">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-blue/10 via-background to-background"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl uppercase font-extrabold mb-4">The Dugout <span className="text-accent-gold">Blog</span></h2>
          <p className="mt-2 text-lg leading-8 text-gray-400">
            Insights, match analysis, and exclusive stories from Amptee Football Gambia.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {loading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="h-48 bg-white/5 rounded-xl"></div>
                <div className="h-6 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((post) => (
              <article key={post.id} className="flex flex-col items-start justify-between group overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 duration-300 transform hover:-translate-y-1">
                <div className="relative w-full">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="aspect-video w-full object-cover sm:aspect-2/1 lg:aspect-3/2 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-black sm:aspect-2/1 lg:aspect-3/2 flex items-center justify-center">
                      <Trophy className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="p-6 flex-1 flex flex-col w-full">
                  <div className="flex items-center gap-x-4 text-xs mb-4">
                    {post.createdAt && (
                      <time dateTime={post.createdAt} className="text-gray-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </time>
                    )}
                    <div className="relative z-10 rounded-full bg-accent-blue/20 px-3 py-1 font-medium text-accent-blue uppercase">
                      {post.category || 'News'}
                    </div>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-2 text-xl font-bold leading-6 text-white group-hover:text-accent-gold transition-colors duration-300">
                      <Link href={`/blog/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                      {post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : "Read the full article...")}
                    </p>
                  </div>
                  <div className="relative mt-6 flex items-center gap-x-4 mt-auto pt-6 border-t border-white/10">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-primary transition-colors">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-white">
                        <span className="absolute inset-0" />
                        Amptee Editorial
                      </p>
                      <p className="text-gray-400">Staff Writer</p>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
                <p className="text-gray-400 text-lg">No articles available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
