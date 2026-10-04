"use client";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./theme-provider";

export function ToasterProvider() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: resolvedTheme === "dark" ? "#151518" : "#ffffff",
          color: resolvedTheme === "dark" ? "#f0f0ee" : "#111111",
          border: resolvedTheme === "dark" ? "1px solid #2a2a2e" : "1px solid #e5e5e3",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  );
}
