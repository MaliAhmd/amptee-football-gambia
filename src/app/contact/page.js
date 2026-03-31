"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending email/message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      e.target.reset();
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl uppercase font-extrabold mb-4">Get In <span className="text-primary">Touch</span></h2>
          <p className="mt-2 text-base sm:text-lg leading-8 text-gray-400">
            Have a story, inquiry, or feedback? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto items-center">
          <div className="space-y-8 lg:space-y-10 order-2 lg:order-1 bg-white/5 p-6 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary via-accent-blue to-accent-gold opacity-10 blur-xl flex-shrink-0"></div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 uppercase border-b border-primary/30 pb-4 inline-block">Contact Info</h3>
              
              <div className="flex gap-x-4 sm:gap-x-6 items-center group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/30 group-hover:bg-primary group-hover:text-white transition-colors">
                   <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-300">Call Us</p>
                  <p className="text-base sm:text-lg font-bold text-white break-words">+220 123 4567</p>
                </div>
              </div>

              <div className="flex gap-x-4 sm:gap-x-6 items-center group mt-6 sm:mt-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-blue/20 text-accent-blue ring-1 ring-accent-blue/30 group-hover:bg-accent-blue group-hover:text-white transition-colors">
                   <Mail className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-6 text-gray-300">Email Us</p>
                  <p className="text-base sm:text-lg font-bold text-white break-all sm:break-normal">info@ampteefootball.gm</p>
                </div>
              </div>

              <div className="flex gap-x-4 sm:gap-x-6 items-center group mt-6 sm:mt-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold ring-1 ring-accent-gold/30 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                   <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-300">Headquarters</p>
                  <p className="text-base sm:text-lg font-bold text-white break-words">Banjul, The Gambia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 w-full">
              {success && (
                <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded text-center font-medium">
                  Message sent successfully!
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold leading-6 text-white uppercase tracking-wide mb-2">Name</label>
                <input type="text" required className="block w-full rounded-xl border-0 bg-white/5 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-white/10 transition-all text-base sm:text-sm sm:leading-6" placeholder="Your full name" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold leading-6 text-white uppercase tracking-wide mb-2">Email</label>
                <input type="email" required className="block w-full rounded-xl border-0 bg-white/5 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-white/10 transition-all text-base sm:text-sm sm:leading-6" placeholder="you@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold leading-6 text-white uppercase tracking-wide mb-2">Message</label>
                <textarea rows="5" required className="block w-full rounded-xl border-0 bg-white/5 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-white/10 transition-all text-base sm:text-sm sm:leading-6 resize-none" placeholder="How can we help?"></textarea>
              </div>

              <button type="submit" disabled={loading} className="mt-2 sm:mt-4 flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70">
                {loading ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
