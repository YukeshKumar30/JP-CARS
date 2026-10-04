"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Send, CheckCircle, Upload, IndianRupee, X } from "lucide-react";
import { PageTransition, Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { track } from "@/lib/analytics";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  brand: z.string().min(1, "Brand required"),
  model: z.string().min(1, "Model required"),
  variant: z.string().optional(),
  year: z.coerce.number().min(2000).max(new Date().getFullYear()),
  kilometres: z.coerce.number().min(0),
  fuel_type: z.string().min(1, "Fuel type required"),
  transmission: z.string().min(1, "Transmission required"),
  owners: z.coerce.number().min(1).max(5),
  expected_price: z.coerce.number().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function SellYourCarPage() {
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = new window.FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") payload.set(key, String(value));
      });
      images.forEach((image) => payload.append("images", image));

      const response = await fetch("/api/sell-requests", { method: "POST", body: payload });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not submit your request.");
      }

      track("sell_car_submit");
      setSubmitted(true);
      toast.success("Request submitted! We'll contact you soon.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your request.");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          <Reveal className="max-w-2xl mx-auto text-center mb-10">
            <span className="section-tag justify-center">
              <IndianRupee className="w-3 h-3" />
              Sell Your Car
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-jp-text dark:text-white mb-3">
              Ready to Sell Your Car?
            </h1>
            <p className="text-jp-muted leading-relaxed">
              Fill in your car details and our team will evaluate it and contact you with a fair offer.
            </p>
          </Reveal>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center p-10 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark shadow-lg">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-jp-text dark:text-white mb-2">Request Submitted!</h2>
              <p className="text-jp-muted text-sm">Our team will review your car details and contact you within 24 hours.</p>
            </motion.div>
          ) : (
            <Reveal className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark shadow-sm space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Full Name *</label>
                    <input {...register("name")} className="jp-input" placeholder="Your name" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Phone *</label>
                    <input {...register("phone")} className="jp-input" placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Email</label>
                    <input {...register("email")} className="jp-input" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">City</label>
                    <input {...register("city")} className="jp-input" placeholder="Your city" />
                  </div>
                </div>

                <div className="border-t border-jp-border dark:border-jp-border-dark pt-4">
                  <p className="text-sm font-semibold text-jp-text dark:text-white mb-4">Car Details</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Brand *</label>
                      <input {...register("brand")} className="jp-input" placeholder="e.g. Maruti Suzuki" />
                      {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Model *</label>
                      <input {...register("model")} className="jp-input" placeholder="e.g. Swift" />
                      {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Variant</label>
                      <input {...register("variant")} className="jp-input" placeholder="e.g. VXI" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Year *</label>
                      <input {...register("year")} type="number" className="jp-input" placeholder="2020" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Kilometres *</label>
                      <input {...register("kilometres")} type="number" className="jp-input" placeholder="45000" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">No. of Owners *</label>
                      <input {...register("owners")} type="number" min={1} max={5} className="jp-input" placeholder="1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Fuel Type *</label>
                      <select {...register("fuel_type")} className="jp-input">
                        <option value="">Select</option>
                        {["Petrol","Diesel","CNG","Electric","Hybrid"].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Transmission *</label>
                      <select {...register("transmission")} className="jp-input">
                        <option value="">Select</option>
                        {["Manual","Automatic","AMT","CVT","DCT"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Expected Price (₹)</label>
                      <input {...register("expected_price")} type="number" className="jp-input" placeholder="500000" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="car-images" className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Car Photos (up to 6)</label>
                      <label htmlFor="car-images" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-jp-border dark:border-jp-border-dark px-4 py-5 text-center cursor-pointer hover:border-jp-gold transition-colors">
                        <Upload className="w-5 h-5 text-jp-gold" />
                        <span className="text-sm font-medium text-jp-text dark:text-white">Choose photos from your device</span>
                        <span className="text-xs text-jp-muted">JPG, PNG or WebP, up to 8 MB each</span>
                      </label>
                      <input
                        id="car-images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          const selected = Array.from(event.target.files || []);
                          event.target.value = "";
                          if (selected.some((image) => image.size > 8 * 1024 * 1024)) {
                            toast.error("Each image must be 8 MB or smaller.");
                            return;
                          }
                          if (selected.some((image) => !["image/jpeg", "image/png", "image/webp"].includes(image.type))) {
                            toast.error("Use JPG, PNG, or WebP images only.");
                            return;
                          }
                          if (images.length + selected.length > 6) {
                            toast.error("Upload up to 6 images.");
                            return;
                          }
                          setImages((current) => [...current, ...selected]);
                        }}
                      />
                      {images.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {images.map((image, index) => (
                            <li key={`${image.name}-${image.lastModified}-${index}`} className="flex items-center justify-between gap-2 rounded-md bg-jp-bg dark:bg-jp-black px-3 py-2 text-xs text-jp-text dark:text-white">
                              <span className="min-w-0 truncate">{image.name}</span>
                              <button type="button" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove ${image.name}`} className="shrink-0 rounded p-1 text-jp-muted hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Additional Message</label>
                      <textarea {...register("message")} rows={3} className="jp-input resize-none" placeholder="Any additional details about your car…" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
                  {isSubmitting ? "Submitting…" : (
                    <>
                      <Send className="w-4 h-4" />
                      Get My Car Evaluated
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
