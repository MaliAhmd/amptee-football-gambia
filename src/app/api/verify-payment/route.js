import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe Secret Key is not configured");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Check if the payment status is paid
    if (session.payment_status === "paid") {
      // 3. Get the order from Firestore
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const orderData = orderSnap.data();

        // 4. Update the order status if it's not already paid
        if (orderData.status !== "paid") {
          await updateDoc(orderRef, {
            status: "paid",
            updatedAt: new Date().toISOString(),
          });
        }
        return NextResponse.json({ success: true, message: "Payment verified successfully" });
      } else {
         return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
