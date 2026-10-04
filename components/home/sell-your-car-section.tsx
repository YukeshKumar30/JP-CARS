import Link from "next/link";
import { Reveal } from "@/components/shared/animations";
import { ArrowRight, IndianRupee } from "lucide-react";

export function SellYourCarSection() {
  return (
    <section className="py-16 bg-jp-black text-white overflow-hidden">
      <div className="jp-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="section-tag text-jp-gold">
              <IndianRupee className="w-3 h-3" />
              Sell Your Car
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Ready to Sell<br />
              <span className="text-jp-gold">Your Car?</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
              Get a fair evaluation for your vehicle. Share your car details and our team will get back to you promptly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sell-your-car" className="btn btn-gold px-6">
                Get My Car Evaluated
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919751882320?text=Hi%2C%20I%20want%20to%20sell%20my%20car"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp px-6"
              >
                WhatsApp Us
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "Free", label: "Car Evaluation" },
                { value: "Fast", label: "Response Time" },
                { value: "Fair", label: "Market Price" },
                { value: "Simple", label: "Process" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl font-black text-jp-gold mb-1">{item.value}</div>
                  <div className="text-sm text-white/60">{item.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
