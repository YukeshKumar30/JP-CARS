import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EMIResult } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatKM(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)} L km`;
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${km} km`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateEMI(
  vehiclePrice: number,
  downPayment: number,
  interestRate: number,
  tenureMonths: number
): EMIResult {
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  let monthlyEMI = 0;

  if (monthlyRate === 0) {
    monthlyEMI = loanAmount / tenureMonths;
  } else {
    monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayable = monthlyEMI * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  return {
    loanAmount: Math.round(loanAmount),
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
  };
}

export function getVehicleTitle(vehicle: {
  brand: string;
  model: string;
  variant?: string;
  year: number;
}): string {
  return [vehicle.year, vehicle.brand, vehicle.model, vehicle.variant]
    .filter(Boolean)
    .join(" ");
}

export function estimateEMI(price: number): number {
  // Rough estimate: 20% down, 9% interest, 60 months
  const result = calculateEMI(price, price * 0.2, 9, 60);
  return result.monthlyEMI;
}
