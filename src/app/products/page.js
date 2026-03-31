"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, Star, Zap } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full filter blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 rounded-full filter blur-[100px] pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
             <Zap className="h-4 w-4 text-accent-gold" />
             <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Official Gear</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-6 leading-tight">
            Amptee <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue">Products</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            Support your local team with the official Amptee Football Gambia gear. Premium quality, built for the passionate fan.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-500 mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">Store is Empty</h3>
            <p className="text-gray-400">We are currently restocking our awesome gear. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.3)]"
              >
                <div className="relative aspect-square overflow-hidden bg-black/20">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-20 w-20 text-gray-600 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white font-black px-4 py-2 rounded-full border border-white/20 shadow-lg group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                    ${product.price}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 mb-3 text-accent-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>
                  
                  <button className="w-full bg-white/10 hover:bg-primary text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/10 hover:border-primary flex justify-center items-center gap-2 group/btn">
                    <ShoppingBag className="w-5 h-5 group-hover/btn:animate-bounce" />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
