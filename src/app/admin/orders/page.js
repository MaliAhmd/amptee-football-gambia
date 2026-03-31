"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Package, CheckCircle, Clock } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. You may need to create an index in Firestore.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10 w-full">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2">
          Order Management
        </h1>
        <p className="text-gray-400">View and track customer orders and their payment status.</p>
      </div>

      {error ? (
        <div className="bg-accent-red/20 text-accent-red p-4 rounded-xl border border-accent-red/30">
          {error}
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-4 font-bold">Order ID / Date</th>
                  <th className="p-4 font-bold">Customer Details</th>
                  <th className="p-4 font-bold">Products</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-bold text-gray-300">No orders found</p>
                      <p>Orders will appear here once customers make a purchase.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 align-top w-48">
                        <p className="text-sm font-mono text-white mb-1 truncate" title={order.id}>{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 align-top min-w-[200px]">
                        <div className="text-sm">
                          <p className="font-bold text-white mb-1">{order.customerDetails?.name || 'N/A'}</p>
                          <p className="text-gray-400">{order.customerDetails?.email}</p>
                          <p className="text-gray-400">{order.customerDetails?.phone}</p>
                          <p className="text-[10px] tracking-wider uppercase text-gray-500 mt-3 pt-2 border-t border-white/5">
                            {order.customerDetails?.address}, {order.customerDetails?.city} {order.customerDetails?.zipCode}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 align-top min-w-[250px]">
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm bg-black/30 p-2.5 rounded-lg border border-white/5">
                              <span className="text-gray-300 line-clamp-2 mr-3 font-medium">{item.name}</span>
                              <div className="text-right">
                                <span className="text-primary font-black whitespace-nowrap block">x{item.quantity}</span>
                                <span className="text-xs text-gray-500">${item.price?.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <p className="text-lg font-black text-white px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl inline-block mt-1">
                          ${order.totalAmount?.toFixed(2)}
                        </p>
                      </td>
                      <td className="p-4 align-top">
                        {order.status === 'paid' ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider mt-1">
                            <CheckCircle className="w-4 h-4" /> Paid
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20 text-xs font-black uppercase tracking-wider mt-1">
                            <Clock className="w-4 h-4" /> {order.status || 'Pending'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
