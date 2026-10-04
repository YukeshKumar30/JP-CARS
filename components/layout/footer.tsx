import Link from "next/link";
import Image from "next/image";
import { business } from "@/config/business";
import { Phone, MessageCircle, MapPin, Instagram, Youtube, Users } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Browse Cars", href: "/cars" },
    { label: "Sell Your Car", href: "/sell-your-car" },
    { label: "Finance", href: "/finance" },
    { label: "Services", href: "/services" },
    { label: "Book Test Drive", href: "/test-drive" },
  ],
  "Company": [
    { label: "About JP CARS", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Saved Cars", href: "/saved-cars" },
    { label: "Compare Cars", href: "/compare" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-jp-black text-white">
      <div className="jp-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src="/jp-cars-logo.svg"
                alt="JP CARS - Buying, Selling, Finance"
                width={170}
                height={110}
                className="h-16 w-auto rounded-md bg-white px-2 py-1 shadow-sm"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Your trusted destination for quality pre-owned cars in Kallakurichi. Simple, transparent, and hassle-free.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JP CARS Instagram"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={business.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JP CARS YouTube"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={business.whatsappCommunity}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JP CARS WhatsApp Community"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Users className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4 text-white/90">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/90">Contact</h3>
            <div className="space-y-3">
              <a
                href={`tel:${business.phoneRaw}`}
                className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {business.phone}
              </a>
              <a
                href={business.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                {business.whatsapp}
              </a>
              <a
                href={business.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-white/55 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Kallakurichi, Tamil Nadu</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} JP CARS Kallakurichi. All rights reserved.</p>
          <p>Pre-owned cars · Kallakurichi · Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
