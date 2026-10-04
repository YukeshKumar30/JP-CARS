/**
 * JP CARS - Central Business Configuration
 * All business details are managed here. Do not duplicate in components.
 */
export const business = {
  name: "JP CARS",
  tagline: "Premium Pre-Owned Cars",
  locationName: "Kallakurichi",
  fullName: "JP CARS Kallakurichi",

  // Contact
  phone: "+91 99438 82320",
  phoneRaw: "+919943882320",
  whatsapp: "+91 97518 82320",
  whatsappInternational: "919751882320",

  // Social & Links
  googleMaps: "https://maps.app.goo.gl/rbqMaVbvSzqXwjzk9",
  instagram: "https://www.instagram.com/jp_cars_kallakurichi_/",
  youtube: "https://youtube.com/@jpcarskallakurichi",
  whatsappCatalog: "https://wa.me/c/919751882320",
  whatsappCommunity: "https://chat.whatsapp.com/CC1299Sh5ia1z42NeJ3mBb?mode=ac_t",

  // WhatsApp base
  whatsappBase: "https://wa.me/919751882320",

  // SEO
  siteTitle: "JP CARS | Pre-Owned Cars in Kallakurichi",
  siteDescription:
    "Explore quality pre-owned cars with a simple, transparent buying experience. JP CARS Kallakurichi — your trusted destination for certified used cars.",

  // Business Hours (display only)
  hours: "Mon – Sat: 9:00 AM – 7:00 PM",

  // Stats for trust section
  stats: {
    carsSold: "500+",
    happyCustomers: "450+",
    yearsOfExperience: "5+",
    brandsAvailable: "20+",
  },
} as const;

/**
 * Generate a WhatsApp link with a pre-filled message for a vehicle enquiry.
 */
export function getVehicleWhatsAppLink(vehicle: {
  title: string;
  price?: number;
  year?: number;
  kilometres?: number;
}) {
  const price = vehicle.price
    ? `₹${vehicle.price.toLocaleString("en-IN")}`
    : "Price on request";
  const km = vehicle.kilometres
    ? `${vehicle.kilometres.toLocaleString("en-IN")} km`
    : "-";

  const message = `Hello JP CARS,

I am interested in this vehicle:
*${vehicle.title}*

Price: ${price}
Year: ${vehicle.year ?? "-"}
Kilometres: ${km}

Please share more details.`;

  return `${business.whatsappBase}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a generic WhatsApp link.
 */
export function getWhatsAppLink(message?: string) {
  if (message) {
    return `${business.whatsappBase}?text=${encodeURIComponent(message)}`;
  }
  return business.whatsappBase;
}
