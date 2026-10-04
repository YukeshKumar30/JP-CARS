"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Users, CalendarDays, DollarSign,
  TrendingDown, Star, HelpCircle, Settings, Menu, X, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { business } from "@/config/business";
import { useState, type ReactNode } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/test-drives", label: "Test Drives", icon: CalendarDays },
  { href: "/admin/sell-requests", label: "Sell Requests", icon: TrendingDown },
  { href: "/admin/finance", label: "Finance", icon: DollarSign },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (link: typeof adminLinks[0]) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col bg-jp-black text-white",
      mobile ? "h-full w-72" : "w-64 flex-shrink-0 hidden lg:flex h-screen sticky top-0"
    )}>
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/jp-cars-logo.svg"
            alt="JP CARS"
            width={170}
            height={110}
            className="h-11 w-auto rounded-md bg-white px-1.5 py-0.5"
          />
          <span className="font-bold text-sm">Admin</span>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive(link)
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <link.icon className="w-4 h-4 flex-shrink-0" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </form>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          Back to Website
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-jp-bg dark:bg-jp-black overflow-hidden">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-jp-dark border-b border-jp-border dark:border-jp-border-dark flex items-center gap-3 px-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-jp-bg dark:hover:bg-jp-black" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-jp-text dark:text-white text-sm">
            {adminLinks.find((link) => isActive(link))?.label || "Admin"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-jp-muted hidden sm:block">{business.fullName}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}