// ────────────────────────────────────────────────────────────────────────────
// JP CARS – Shared TypeScript Types
// ────────────────────────────────────────────────────────────────────────────

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid" | "LPG";
export type TransmissionType = "Manual" | "Automatic" | "AMT" | "DCT" | "CVT";
export type BodyType = "Sedan" | "Hatchback" | "SUV" | "MUV" | "Coupe" | "Convertible" | "Pickup" | "Van" | "Wagon";
export type VehicleStatus = "available" | "reserved" | "sold";
export type ConditionType = "Excellent" | "Good" | "Fair";

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  registration_year?: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type?: BodyType;
  kilometres: number;
  owners: number;
  price: number;
  engine?: string;
  mileage?: string;
  power?: string;
  torque?: string;
  seating?: number;
  insurance?: string;
  service_history?: boolean;
  condition?: ConditionType;
  description?: string;
  is_featured: boolean;
  is_published: boolean;
  status: VehicleStatus;
  color?: string;
  registration_state?: string;
  instagram_link?: string;
  created_at: string;
  updated_at: string;
  // joined
  images?: VehicleImage[];
  features?: VehicleFeature[];
  cover_image?: string;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  feature: string;
  category?: string;
}

export interface Lead {
  id: string;
  type: "vehicle_enquiry" | "general" | "test_drive" | "sell_car" | "finance";
  name: string;
  phone: string;
  email?: string;
  vehicle_id?: string;
  vehicle_title?: string;
  message?: string;
  status: "new" | "contacted" | "follow_up" | "completed" | "closed";
  created_at: string;
  updated_at: string;
}

export interface TestDriveRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_id?: string;
  vehicle_title?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface SellCarRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  kilometres: number;
  fuel_type: string;
  transmission: string;
  owners: number;
  expected_price?: number;
  city?: string;
  message?: string;
  image_urls?: string[];
  status: "new" | "contacted" | "evaluated" | "completed" | "closed";
  created_at: string;
  updated_at: string;
}

export interface FinanceRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_id?: string;
  vehicle_title?: string;
  loan_amount?: number;
  tenure_months?: number;
  employment_type?: string;
  message?: string;
  status: "new" | "contacted" | "processing" | "completed" | "closed";
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  vehicle_id?: string;
  vehicle_title?: string;
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sort_order: number;
  is_published: boolean;
}

// Search / Filter params
export interface VehicleFilters {
  brand?: string;
  model?: string;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  max_km?: number;
  owners?: number;
  status?: VehicleStatus;
  search?: string;
  sort?: "recommended" | "price_asc" | "price_desc" | "newest" | "km_asc";
  page?: number;
  limit?: number;
}

// EMI calculation
export interface EMIResult {
  loanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
}
