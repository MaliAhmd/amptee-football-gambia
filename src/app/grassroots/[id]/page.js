"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Clock, CalendarDays, Globe } from "lucide-react";
import Link from "next/link";

export default function GrassrootsPost() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const docRef = doc(db, "grassroots", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push("/grassroots");
        }
      } catch (error) {
        console.error("Error fetching grassroots post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-24 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="min-h-screen py-24 bg-background relative">
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#16a34a] to-[#22c55e] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
      </div>
      
      <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10">
        <Link href="/grassroots" className="inline-flex items-center gap-2 text-sm font-semibold leading-6 text-gray-400 hover:text-white transition-colors mb-12 uppercase tracking-wide">
          <ArrowLeft className="h-4 w-4" /> Back to Grassroots
        </Link>
        <div className="space-y-4 mb-12">
          {post.category && (
             <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary uppercase shadow-sm ring-1 ring-inset ring-primary/20 tracking-wider flex items-center w-fit gap-2">
               <Globe className="h-4 w-4" />
               {post.category}
             </span>
          )}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl break-words uppercase">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-l-2 border-primary pl-4 mt-8">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <CalendarDays className="h-4 w-4" />
              {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : 'Ongoing'}
            </span>
          </div>
        </div>

        {post.image && (
          <div className="relative mb-16 aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(22,163,74,0.3)]">
            <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-primary prose-p:leading-relaxed prose-img:rounded-xl">
          {post.description && post.description.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p className="text-gray-300 text-lg sm:text-xl font-medium leading-loose" key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>
      </div>
    </article>
  );
}
