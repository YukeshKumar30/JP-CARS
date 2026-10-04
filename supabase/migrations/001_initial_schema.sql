-- JP CARS Supabase Database Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Vehicles ────────────────────────────────────────────────────────────
create table if not exists public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  brand text not null,
  model text not null,
  variant text,
  year integer not null,
  registration_year integer,
  fuel_type text not null check (fuel_type in ('Petrol','Diesel','CNG','Electric','Hybrid','LPG')),
  transmission text not null check (transmission in ('Manual','Automatic','AMT','DCT','CVT')),
  body_type text,
  kilometres integer not null default 0,
  owners integer not null default 1,
  price numeric not null,
  engine text,
  mileage text,
  power text,
  torque text,
  seating integer,
  insurance text,
  service_history boolean default false,
  condition text check (condition in ('Excellent','Good','Fair')),
  description text,
  color text,
  registration_state text,
  is_featured boolean default false,
  is_published boolean default false,
  status text not null default 'available' check (status in ('available','reserved','sold')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists vehicles_brand_idx on public.vehicles(brand);
create index if not exists vehicles_status_idx on public.vehicles(status);
create index if not exists vehicles_is_published_idx on public.vehicles(is_published);
create index if not exists vehicles_price_idx on public.vehicles(price);

-- ─── Vehicle Images ────────────────────────────────────────────────────
create table if not exists public.vehicle_images (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  is_cover boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists vehicle_images_vehicle_id_idx on public.vehicle_images(vehicle_id);

-- ─── Vehicle Features ─────────────────────────────────────────────────
create table if not exists public.vehicle_features (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  feature text not null,
  category text
);

-- ─── Leads ────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('vehicle_enquiry','general','test_drive','sell_car','finance')),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id),
  vehicle_title text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','follow_up','completed','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_type_idx on public.leads(type);

-- ─── Test Drive Requests ───────────────────────────────────────────────
create table if not exists public.test_drive_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id),
  vehicle_title text,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','confirmed','completed','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Sell Car Requests ─────────────────────────────────────────────────
create table if not exists public.sell_car_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  brand text not null,
  model text not null,
  variant text,
  year integer not null,
  kilometres integer not null,
  fuel_type text not null,
  transmission text not null,
  owners integer not null default 1,
  expected_price numeric,
  city text,
  message text,
  image_urls text[],
  status text not null default 'new' check (status in ('new','contacted','evaluated','completed','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Finance Requests ──────────────────────────────────────────────────
create table if not exists public.finance_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id),
  vehicle_title text,
  loan_amount numeric,
  tenure_months integer,
  employment_type text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','processing','completed','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Reviews ──────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  vehicle_id uuid references public.vehicles(id),
  vehicle_title text,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- ─── FAQs ─────────────────────────────────────────────────────────────
create table if not exists public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- ─── Site Settings ─────────────────────────────────────────────────────
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Admin Notes ───────────────────────────────────────────────────────
create table if not exists public.admin_notes (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  note text not null,
  created_at timestamptz default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.vehicle_features enable row level security;
alter table public.leads enable row level security;
alter table public.test_drive_requests enable row level security;
alter table public.sell_car_requests enable row level security;
alter table public.finance_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;

-- Public read access for published vehicles
create policy "Public read published vehicles" on public.vehicles
  for select using (is_published = true);

create policy "Public read vehicle images" on public.vehicle_images
  for select using (true);

create policy "Public read vehicle features" on public.vehicle_features
  for select using (true);

create policy "Public read published reviews" on public.reviews
  for select using (is_published = true);

create policy "Public read published faqs" on public.faqs
  for select using (is_published = true);

-- Anyone can insert requests
create policy "Anyone can create leads" on public.leads
  for insert with check (true);

create policy "Anyone can create test drive requests" on public.test_drive_requests
  for insert with check (true);

create policy "Anyone can create sell car requests" on public.sell_car_requests
  for insert with check (true);

create policy "Anyone can create finance requests" on public.finance_requests
  for insert with check (true);

-- Storage bucket for vehicle images
insert into storage.buckets (id, name, public)
  values ('vehicle-images', 'vehicle-images', true)
  on conflict (id) do nothing;

create policy "Public read vehicle images storage" on storage.objects
  for select using (bucket_id = 'vehicle-images');

create policy "Authenticated upload vehicle images" on storage.objects
  for insert with check (bucket_id = 'vehicle-images' and auth.role() = 'authenticated');
