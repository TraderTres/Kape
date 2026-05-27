"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Coffee, Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/shop", label: "Shop Beans" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/dashboard/loyalty", label: "Quests" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav
        className="mx-auto max-w-7xl rounded-2xl border border-espresso-100/60 bg-white/90 backdrop-blur-md shadow-card px-5 py-3"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Kape home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-900 text-gold-300 group-hover:bg-espresso-800 transition-colors duration-200">
              <Coffee className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-espresso-900 text-xl tracking-tight">
              KAPE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer",
                  pathname === link.href
                    ? "bg-espresso-50 text-espresso-900"
                    : "text-espresso-600 hover:text-espresso-900 hover:bg-espresso-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Button>
            </Link>
            <Link href="/subscribe">
              <Button variant="gold" size="sm">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Subscribe
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-espresso-700 hover:bg-espresso-50 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border-t border-espresso-100 pt-3 pb-1 space-y-1 animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                  pathname === link.href
                    ? "bg-espresso-50 text-espresso-900"
                    : "text-espresso-600 hover:text-espresso-900 hover:bg-espresso-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-espresso-100 flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/subscribe" onClick={() => setMobileOpen(false)}>
                <Button variant="gold" size="sm" className="w-full">
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
