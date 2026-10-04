"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    // Check session storage — only show once per session
    const seen = sessionStorage.getItem("jp-intro-seen");
    // Check reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || prefersReduced) {
      onComplete();
      return;
    }

    setVisible(true);
    setShow(true);

    const timer = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      setShow(false);
      sessionStorage.setItem("jp-intro-seen", "1");
      setTimeout(onComplete, 600);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          {/* JP CARS text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                letterSpacing: "-0.04em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              JP CARS
            </span>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.55 }}
              style={{
                height: "1.5px",
                width: "100%",
                background: "linear-gradient(90deg, transparent, #B8860B, transparent)",
                transformOrigin: "center",
              }}
            />

            {/* KALLAKURICHI */}
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#9a9a9a",
              }}
            >
              KALLAKURICHI
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
