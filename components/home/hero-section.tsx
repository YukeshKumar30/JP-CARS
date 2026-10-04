"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Play } from "lucide-react";
import { business } from "@/config/business";
import { track } from "@/lib/analytics";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-screen" />;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-jp-bg dark:bg-jp-black">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/[0.03] dark:from-white/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-jp-bg dark:from-jp-black to-transparent" />
      </div>

      <div className="jp-container relative z-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6
                         bg-jp-gold/10 text-jp-gold border border-jp-gold/20"
            >
              <Star className="w-3 h-3 fill-current" />
              Trusted Dealership · Kallakurichi
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-jp-text dark:text-white mb-5"
            >
              Find a Car<br />
              You&apos;ll Love<br />
              <span className="text-jp-gold">to Drive.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-base sm:text-lg text-jp-muted dark:text-white/60 mb-8 max-w-md leading-relaxed"
            >
              Explore quality pre-owned cars with a simple, transparent buying experience.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href="/cars"
                className="btn btn-primary text-sm px-5 py-2.5 group"
              >
                Explore Cars
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sell-your-car"
                className="btn btn-secondary text-sm px-5 py-2.5"
              >
                Sell Your Car
              </Link>
              <a
                href={business.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("directions_click", { source: "hero" })}
                className="btn btn-secondary text-sm px-5 py-2.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { value: business.stats.carsSold, label: "Cars Sold" },
                { value: business.stats.happyCustomers, label: "Happy Customers" },
                { value: business.stats.yearsOfExperience, label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-jp-text dark:text-white">{stat.value}</div>
                  <div className="text-xs text-jp-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&q=85"
                alt="Premium pre-owned car at JP CARS Kallakurichi"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-jp-dark rounded-xl shadow-xl p-4 border border-jp-border dark:border-jp-border-dark max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-jp-gold text-jp-gold" />
                  ))}
                </div>
                <span className="text-xs font-semibold">5.0</span>
              </div>
              <p className="text-xs text-jp-muted">&ldquo;Best car buying experience&rdquo;</p>
              <p className="text-xs font-semibold mt-1">— Verified Customer</p>
            </motion.div>

            {/* YouTube CTA */}
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              href={business.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -top-4 -right-4 bg-white dark:bg-jp-dark rounded-xl shadow-xl p-3 border border-jp-border dark:border-jp-border-dark flex items-center gap-2 hover:shadow-2xl transition-shadow"
              aria-label="Follow JP CARS on YouTube"
            >
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <div className="text-xs font-semibold">Follow JP CARS</div>
                <div className="text-xs text-jp-muted">YouTube</div>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
