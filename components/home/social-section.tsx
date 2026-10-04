import Link from "next/link";
import { Reveal } from "@/components/shared/animations";
import { business } from "@/config/business";
import { Instagram, Youtube, Users, ExternalLink, MessageCircle } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    handle: "@jp_cars_kallakurichi_",
    href: business.instagram,
    icon: Instagram,
    color: "from-purple-500 to-pink-500",
    description: "See the latest cars, updates, and dealership moments.",
  },
  {
    name: "YouTube",
    handle: "@jpcarskallakurichi",
    href: business.youtube,
    icon: Youtube,
    color: "from-red-500 to-red-600",
    description: "Watch vehicle walkarounds and customer testimonials.",
  },
  {
    name: "WhatsApp Catalog",
    handle: "Browse Cars on WhatsApp",
    href: business.whatsappCatalog,
    icon: MessageCircle,
    color: "from-green-400 to-green-600",
    description: "Browse our full vehicle catalog directly on WhatsApp.",
  },
  {
    name: "WhatsApp Community",
    handle: "Join Our Community",
    href: business.whatsappCommunity,
    icon: Users,
    color: "from-emerald-400 to-teal-600",
    description: "Get first access to new arrivals and exclusive deals.",
  },
];

export function SocialSection() {
  return (
    <section className="py-16 bg-jp-bg dark:bg-jp-black">
      <div className="jp-container">
        <Reveal className="text-center mb-10">
          <span className="section-tag justify-center">Follow JP CARS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Follow the Latest Cars from JP CARS
          </h2>
          <p className="text-jp-muted mt-3 max-w-lg mx-auto text-sm">
            Stay updated with new arrivals, vehicle videos, and dealership news across our social channels.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((social, i) => (
            <Reveal key={social.name} delay={i * 0.08}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <social.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-jp-text dark:text-white mb-0.5 flex items-center gap-1">
                  {social.name}
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-jp-muted mb-2">{social.handle}</p>
                <p className="text-xs text-jp-muted leading-relaxed flex-1">{social.description}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
