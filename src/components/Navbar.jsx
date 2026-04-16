"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Do not show the navigation bar on the dashboard pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/editor") || pathname.startsWith("/coach") || pathname.startsWith("/change-password")) return null;

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Grassroots", path: "/grassroots" },
    { name: "Team", path: "/players" },
    { name: "Community", path: "/community" },
    { name: "Shop", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden">
            <img src="/logo1.png" alt="Amputee Football Gambia" className="h-full w-full object-contain" />
            </div>
            <Link href="/" className="flex flex-col leading-tight hover:text-accent-gold transition-colors duration-300">
    <span className="text-sm font-bold uppercase tracking-wide text-white">Gambia Amputee</span>
    <span className="text-sm font-bold uppercase tracking-wide text-accent-gold">Football Association</span>
  </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-accent-gold bg-white/5"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-white/10">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {links.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-accent-gold bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
