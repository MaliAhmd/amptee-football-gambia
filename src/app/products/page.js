"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, Star, Zap, Plus, Minus, ShoppingCart, Trash2, X, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // Map of productId -> cartItem
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("amptee_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("amptee_cart", JSON.stringify(cart));
  }, [cart]);

  // Disable background scrolling when cart or checkout is open
  useEffect(() => {
    if (isCartOpen || isCheckoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isCheckoutOpen]);

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

  const addToCart = (product) => {
    const price = parseFloat(product.price) || 0;
    setCart(prev => {
      const existing = prev[product.id];
      if (existing) return prev; // already tracking quantity via other buttons if needed
      
      return {
        ...prev,
        [product.id]: {
          id: product.id,
          name: product.name,
          price: price,
          quantity: 1,
          description: product.description,
          updated_price: price,
          imageUrl: product.imageUrl // Storing image for the cart slider
        }
      };
    });
    setIsCartOpen(true);
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = (e) => {
    e.preventDefault();
    alert("Payment submitted successfully! (This is a mockup. You will connect a payment processor here later.)");
    // Optionally: clear cart and close modal
    // setCart({});
    // setIsCheckoutOpen(false);
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const item = prev[productId];
      if (!item) return prev;
      
      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      
      return {
        ...prev,
        [productId]: {
          ...item,
          quantity: newQuantity,
          updated_price: item.price * newQuantity
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.updated_price, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full filter blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 rounded-full filter blur-[100px] pointer-events-none opacity-50" />
      
      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(22,163,74,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Slide-over Cart Panel */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        />
        
        {/* Slider */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
            <h2 className="text-2xl font-black uppercase tracking-wide text-white flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" /> Your Cart
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <ShoppingBag className="w-16 h-16 text-gray-500 mb-4" />
                <p className="text-xl font-bold text-gray-300">Your cart is empty</p>
                <p className="text-gray-500 mt-2">Looks like you haven't added any gear yet!</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col pt-1">
                    <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight pr-6">{item.name}</h4>
                    <p className="font-black text-primary mt-1">${item.updated_price.toFixed(2)}</p>
                    
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-medium">Subtotal ({cartItemCount} items)</span>
                <span className="font-bold text-xl text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4 border-b border-white/10 pb-4">
                <span>Shipping & Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-2xl text-white uppercase tracking-wide">Total</span>
                <span className="font-black text-3xl text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-lg font-black uppercase tracking-wide py-4 auto rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(22,163,74,0.4)] hover:shadow-[0_10px_40px_-5px_rgba(22,163,74,0.6)]"
              >
                Confirm Order <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
              aria-hidden="true" 
              onClick={() => setIsCheckoutOpen(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-[#111] text-left shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                 <h3 className="text-2xl font-black uppercase tracking-wide text-white">
                   Checkout
                 </h3>
                 <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex flex-col md:flex-row h-full max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Left Side: Form */}
                <div className="flex-[0.6] p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
                  <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Shipping Details</h4>
                  <form id="checkout-form" onSubmit={processPayment} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Full Name</label>
                      <input type="text" name="name" required value={checkoutData.name} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Email Address</label>
                        <input type="email" name="email" required value={checkoutData.email} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Phone Number</label>
                        <input type="tel" name="phone" required value={checkoutData.phone} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Street Address</label>
                      <input type="text" name="address" required value={checkoutData.address} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">City</label>
                        <input type="text" name="city" required value={checkoutData.city} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Banjul" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Zip / Postal Code</label>
                        <input type="text" name="zipCode" required value={checkoutData.zipCode} onChange={handleCheckoutChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="10001" />
                      </div>
                    </div>
                  </form>
                </div>
                
                {/* Right Side: Order Summary */}
                <div className="flex-[0.4] bg-black/40 p-6 md:p-8 flex flex-col">
                  <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center justify-between">
                    Order Summary
                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{cartItemCount} Items</span>
                  </h4>
                  
                  <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar space-y-4 max-h-[250px] md:max-h-none">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          ) : (
                            <ShoppingBag className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 text-white" />
                          )}
                          <div className="absolute top-0 right-0 bg-black/80 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-bl-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-white line-clamp-1">{item.name}</h5>
                          <p className="text-xs text-gray-500 line-clamp-1 uppercase tracking-wider">{item.description}</p>
                        </div>
                        <div className="font-bold text-accent-gold text-sm">
                          ${item.updated_price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Shipping</span>
                      <span className="text-white">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black pt-3 border-t border-white/10 mt-3">
                      <span className="text-white uppercase">Total</span>
                      <span className="text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/80 px-6 py-5 border-t border-white/10 sm:flex sm:flex-row-reverse gap-3">
                <button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full inline-flex justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto transition-all items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" /> Pay Now
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-xl bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white border border-white/10 hover:bg-white/10 sm:mt-0 sm:w-auto transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {products.map((product) => {
              const inCart = cart[product.id];
              return (
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
                      ${inCart ? inCart.updated_price.toFixed(2) : product.price}
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
                    
                    {inCart ? (
                      <div className="flex gap-2 h-[58px]">
                        <div className="flex-[0.5] flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2 px-3">
                          <button onClick={() => updateQuantity(product.id, -1)} className="hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="font-bold text-white">{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(product.id, 1)} className="hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button 
                          onClick={() => setIsCartOpen(true)}
                          className="flex-[0.5] bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/10 flex justify-center items-center text-sm"
                        >
                          View Cart
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-white/10 hover:bg-primary text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/10 hover:border-primary flex justify-center items-center gap-2 group/btn"
                      >
                        <ShoppingBag className="w-5 h-5 group-hover/btn:animate-bounce" />
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
