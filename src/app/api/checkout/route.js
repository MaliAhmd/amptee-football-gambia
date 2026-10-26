import { NextResponse } from "next/server";
import Stripe from "stripe";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe Secret Key is not configured");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await req.json();
    const { checkoutData, cartItems, cartTotal } = body;

    // 1. Create Order in Firebase with status "pending"
    const orderRef = await addDoc(collection(db, "orders"), {
      customerDetails: checkoutData,
      items: cartItems,
      totalAmount: cartTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // 2. Create Stripe Checkout Session
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
          description: item.description || "Amputee Football Gear",
        },
        unit_amount: Math.round(item.price * 100), // convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderRef.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products?canceled=true`,
      metadata: {
        orderId: orderRef.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
