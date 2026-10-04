"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageCircle, Search, X, Menu, Sun, Moon, ChevronRight,
} from "lucide-react";
import { business } from "@/config/business";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/sell-your-car", label: "Sell Your Car" },
  { href: "/finance", label: "Finance" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href === "/admin"
        ? pathname === "/admin" || pathname.startsWith("/admin/")
        : pathname.startsWith(href);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-jp-dark/95 backdrop-blur-md shadow-sm border-b border-jp-border dark:border-jp-border-dark"
            : "bg-transparent"
        )}
      >
        <div className={cn("jp-container flex items-center gap-6 transition-all duration-300", scrolled ? "h-14" : "h-16")}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="JP CARS Home"
          >
            <Image
              src="/jp-cars-logo.svg"
              alt="JP CARS - Buying, Selling, Finance"
              width={170}
              height={110}
              priority
              className="h-12 w-auto rounded-md bg-white px-1.5 py-0.5 transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "text-jp-black dark:text-white"
                    : "text-jp-muted hover:text-jp-text dark:hover:text-white"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-jp-gold rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-jp-muted hover:text-jp-text dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-jp-muted hover:text-jp-text dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* WhatsApp */}
            <a
              href={business.whatsappBase}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { source: "navbar" })}
              aria-label="WhatsApp JP CARS"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1da855] transition-all duration-200 hover:shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Call */}
            <a
              href={`tel:${business.phoneRaw}`}
              onClick={() => track("call_click", { source: "navbar" })}
              aria-label={`Call JP CARS: ${business.phone}`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-jp-black dark:bg-white text-white dark:text-jp-black hover:opacity-90 transition-all duration-200 hover:shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 rounded-lg text-jp-muted hover:text-jp-text dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-2xl bg-white dark:bg-jp-dark rounded-2xl shadow-2xl p-4 border border-jp-border dark:border-jp-border-dark"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-jp-muted flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search cars by brand, model, or variant…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/cars?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                  className="flex-1 bg-transparent text-jp-text dark:text-white placeholder:text-jp-muted outline-none text-base"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 text-jp-muted" />
                </button>
              </div>
              {searchQuery.trim() && (
                <div className="mt-3 pt-3 border-t border-jp-border dark:border-jp-border-dark">
                  <Link
                    href={`/cars?search=${encodeURIComponent(searchQuery.trim())}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>Search for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                    <ChevronRight className="w-4 h-4 text-jp-muted" />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed right-0 top-0 bottom-0 z-[80] w-80 max-w-full bg-white dark:bg-jp-dark flex flex-col shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-jp-border dark:border-jp-border-dark">
                <Image src="/jp-cars-logo.svg" alt="JP CARS" width={150} height={47} className="h-11 w-auto rounded-md bg-white px-1 py-0.5" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive(link.href)
                          ? "bg-jp-black dark:bg-white text-white dark:text-jp-black"
                          : "text-jp-text dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && <ChevronRight className="w-4 h-4 opacity-60" />}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="p-4 border-t border-jp-border dark:border-jp-border-dark space-y-2">
                <a
                  href={business.whatsappBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click", { source: "mobile_nav" })}
                  className="btn btn-whatsapp w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
                <a
                  href={`tel:${business.phoneRaw}`}
                  onClick={() => track("call_click", { source: "mobile_nav" })}
                  className="btn btn-primary w-full"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
