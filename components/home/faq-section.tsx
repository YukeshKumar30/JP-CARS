"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/shared/animations";
import { DEMO_FAQS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);
  const faqs = DEMO_FAQS.filter((f) => f.is_published);

  return (
    <section className="py-16 bg-white dark:bg-jp-dark">
      <div className="jp-container max-w-3xl">
        <Reveal className="text-center mb-10">
          <span className="section-tag justify-center">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <Reveal key={faq.id} delay={i * 0.05}>
              <div className="border border-jp-border dark:border-jp-border-dark rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-jp-bg dark:hover:bg-jp-black/50 transition-colors"
                  aria-expanded={open === faq.id}
                >
                  <span className="font-medium text-jp-text dark:text-white text-sm pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: open === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-jp-muted" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {open === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-5 pb-4 text-sm text-jp-muted leading-relaxed border-t border-jp-border dark:border-jp-border-dark pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
