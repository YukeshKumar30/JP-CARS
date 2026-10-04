import { business } from "@/config/business";
import { Reveal } from "@/components/shared/animations";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from "lucide-react";

export function LocationSection() {
  const hasApiKey = !!process.env.GOOGLE_MAPS_API_KEY;

  return (
    <section className="py-16 bg-jp-bg dark:bg-jp-black">
      <div className="jp-container">
        <Reveal className="text-center mb-10">
          <span className="section-tag justify-center">
            <MapPin className="w-3 h-3" />
            Visit Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Find JP CARS in Kallakurichi
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map / Location Card */}
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-jp-border dark:border-jp-border-dark shadow-sm h-72 lg:h-96 relative">
              {hasApiKey ? (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=Kallakurichi,Tamil+Nadu`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JP CARS Location"
                />
              ) : (
                /* Fallback location card */
                <div className="w-full h-full bg-white dark:bg-jp-dark flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="w-16 h-16 bg-jp-gold/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-jp-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-jp-text dark:text-white text-lg mb-1">JP CARS</h3>
                    <p className="text-jp-muted text-sm mb-4">Kallakurichi, Tamil Nadu</p>
                    <a
                      href={business.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary px-6 text-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <MapPin className="w-4 h-4 text-jp-gold flex-shrink-0" />
                  <span className="font-semibold text-jp-text dark:text-white text-sm">Location</span>
                </div>
                <p className="text-jp-muted text-sm ml-7">Kallakurichi, Tamil Nadu, India</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <Clock className="w-4 h-4 text-jp-gold flex-shrink-0" />
                  <span className="font-semibold text-jp-text dark:text-white text-sm">Business Hours</span>
                </div>
                <p className="text-jp-muted text-sm ml-7">{business.hours}</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <Phone className="w-4 h-4 text-jp-gold flex-shrink-0" />
                  <span className="font-semibold text-jp-text dark:text-white text-sm">Phone</span>
                </div>
                <a href={`tel:${business.phoneRaw}`} className="text-jp-blue-light text-sm ml-7 hover:underline">
                  {business.phone}
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <MessageCircle className="w-4 h-4 text-jp-gold flex-shrink-0" />
                  <span className="font-semibold text-jp-text dark:text-white text-sm">WhatsApp</span>
                </div>
                <a href={business.whatsappBase} target="_blank" rel="noopener noreferrer" className="text-jp-blue-light text-sm ml-7 hover:underline">
                  {business.whatsapp}
                </a>
              </div>

              <a
                href={business.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
