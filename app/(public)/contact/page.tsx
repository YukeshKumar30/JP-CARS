import type { Metadata } from "next";
import { business } from "@/config/business";
import { PageTransition, Reveal } from "@/components/shared/animations";
import {
  Phone, MessageCircle, MapPin, Instagram, Youtube, Users,
  ExternalLink, Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact JP CARS",
  description: "Get in touch with JP CARS Kallakurichi. Call, WhatsApp, or visit us.",
};

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    value: business.phone,
    href: `tel:${business.phoneRaw}`,
    buttonLabel: "Call Now",
    color: "bg-jp-black text-white",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: business.whatsapp,
    href: business.whatsappBase,
    buttonLabel: "Chat Now",
    color: "bg-[#25D366] text-white",
    external: true,
  },
  {
    icon: MapPin,
    title: "Get Directions",
    value: "Kallakurichi, Tamil Nadu",
    href: business.googleMaps,
    buttonLabel: "Open Maps",
    color: "bg-blue-600 text-white",
    external: true,
  },
];

const socialChannels = [
  { icon: Instagram, label: "Instagram", handle: "@jp_cars_kallakurichi_", href: business.instagram, color: "from-purple-500 to-pink-500" },
  { icon: Youtube, label: "YouTube", handle: "@jpcarskallakurichi", href: business.youtube, color: "from-red-500 to-red-600" },
  { icon: Users, label: "WhatsApp Community", handle: "Join our community", href: business.whatsappCommunity, color: "from-green-500 to-green-600" },
  { icon: MessageCircle, label: "WhatsApp Catalog", handle: "Browse our cars", href: business.whatsappCatalog, color: "from-emerald-400 to-teal-500" },
];

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          <Reveal className="text-center mb-12">
            <span className="section-tag justify-center">Contact</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-jp-text dark:text-white mb-3">
              Get in Touch
            </h1>
            <p className="text-jp-muted">We&apos;re available Mon–Sat, 9 AM to 7 PM. Reach us by call, WhatsApp, or visit us in Kallakurichi.</p>
          </Reveal>

          {/* Primary contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {contactMethods.map((method, i) => (
              <Reveal key={method.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-center hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-jp-bg dark:bg-jp-black flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-7 h-7 text-jp-gold" />
                  </div>
                  <h2 className="font-bold text-jp-text dark:text-white mb-1">{method.title}</h2>
                  <p className="text-sm text-jp-muted mb-4">{method.value}</p>
                  <a
                    href={method.href}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    className={`btn ${method.color} w-full text-sm`}
                  >
                    {method.buttonLabel}
                    {method.external && <ExternalLink className="w-3.5 h-3.5" />}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Social channels */}
          <Reveal>
            <h2 className="font-bold text-jp-text dark:text-white text-lg mb-5">Social Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {socialChannels.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-jp-text dark:text-white text-sm">{s.label}</p>
                    <p className="text-xs text-jp-muted">{s.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Hours & Location */}
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-jp-gold" />
                  <h3 className="font-semibold text-jp-text dark:text-white">Business Hours</h3>
                </div>
                <p className="text-jp-muted text-sm">{business.hours}</p>
                <p className="text-xs text-jp-muted mt-2">Sunday: Closed</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-jp-gold" />
                  <h3 className="font-semibold text-jp-text dark:text-white">Location</h3>
                </div>
                <p className="text-jp-muted text-sm">Kallakurichi, Tamil Nadu, India</p>
                <a href={business.googleMaps} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-jp-blue-light mt-3 hover:underline">
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
