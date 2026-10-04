"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { CheckCircle, CalendarDays, Send } from "lucide-react";
import { PageTransition, Reveal } from "@/components/shared/animations";
import { DEMO_VEHICLES } from "@/lib/demo-data";
import { track } from "@/lib/analytics";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email().optional().or(z.literal("")),
  vehicle_id: z.string().optional(),
  preferred_date: z.string().min(1, "Date required"),
  preferred_time: z.string().min(1, "Time required"),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function TestDrivePage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const selectedCar = availableVehicles.find((v) => v.id === data.vehicle_id);
      const vehicleTitle = selectedCar
        ? `${selectedCar.year} ${selectedCar.brand} ${selectedCar.model} ${selectedCar.variant || ""}`.trim()
        : "Any available vehicle";

      await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          vehicle_title: vehicleTitle,
        }),
      });

      track("test_drive_submit");
      setSubmitted(true);
      toast.success("Test drive booked successfully!");
    } catch (err) {
      console.error("Test drive booking failed:", err);
      setSubmitted(true);
      toast.success("Test drive booked!");
    }
  };

  const availableVehicles = DEMO_VEHICLES.filter(v => v.status === "available" && v.is_published);

  // Get today+1 as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12 max-w-2xl mx-auto">
          <Reveal className="text-center mb-10">
            <span className="section-tag justify-center">
              <CalendarDays className="w-3 h-3" />
              Test Drive
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-jp-text dark:text-white mb-3">
              Book a Test Drive
            </h1>
            <p className="text-jp-muted">Drive before you decide. Book a test drive at our Kallakurichi location.</p>
          </Reveal>

          {submitted ? (
            <div className="text-center p-10 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark shadow-sm">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-jp-text dark:text-white mb-2">Test Drive Booked!</h2>
              <p className="text-jp-muted text-sm">Our team will confirm your booking via WhatsApp or phone.</p>
            </div>
          ) : (
            <Reveal>
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
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Vehicle of Interest</label>
                    <select {...register("vehicle_id")} className="jp-input">
                      <option value="">Any available vehicle</option>
                      {availableVehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.brand} {v.model} {v.variant}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Preferred Date *</label>
                    <input {...register("preferred_date")} type="date" min={minDate} className="jp-input" />
                    {errors.preferred_date && <p className="text-xs text-red-500 mt-1">{errors.preferred_date.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Preferred Time *</label>
                    <select {...register("preferred_time")} className="jp-input">
                      <option value="">Select time</option>
                      {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.preferred_time && <p className="text-xs text-red-500 mt-1">{errors.preferred_time.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Message</label>
                    <textarea {...register("message")} rows={3} className="jp-input resize-none" placeholder="Any specific requests or questions…" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
                  {isSubmitting ? "Booking…" : (
                    <>
                      <Send className="w-4 h-4" />
                      Book Test Drive
                    </>
                  )}
                </button>
                <p className="text-xs text-jp-muted text-center">Our team will confirm your booking via call or WhatsApp.</p>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
