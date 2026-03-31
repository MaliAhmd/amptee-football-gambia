"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const orderId = searchParams.get("order_id");

      if (!sessionId || !orderId) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, orderId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Clear cart on success
          localStorage.removeItem("amptee_cart");
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Verifying Payment...</h2>
        <p className="text-gray-400 mt-2">Please wait while we confirm your order.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-accent-red/20 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-accent-red" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-4">Payment Failed</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          We couldn't verify your payment. Please try again or contact support if you believe this is an error.
        </p>
        <Link 
          href="/products"
          className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 border border-white/10 flex items-center gap-2"
        >
          Return to Shop <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/20 rounded-full filter blur-[120px] pointer-events-none opacity-50" />
      
      <div className="z-10 bg-[#111] border border-white/10 p-10 md:p-16 rounded-3xl max-w-xl w-full text-center shadow-[0_20px_60px_-15px_rgba(22,163,74,0.3)] flex flex-col items-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.5)]">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-4">
          Order Confirmed!
        </h2>
        
        <p className="text-gray-400 mb-2 text-lg">
          Thank you for your purchase. We've received your order.
        </p>
        
        <div className="bg-black/50 border border-white/5 rounded-xl p-4 w-full mb-8 mt-4">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Order Tracking ID</p>
          <p className="text-primary font-mono text-lg">{searchParams.get("order_id")}</p>
        </div>
        
        <Link 
          href="/products"
          className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wide py-4 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(22,163,74,0.4)] flex justify-center items-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
