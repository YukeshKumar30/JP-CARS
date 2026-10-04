# JP CARS — Premium Pre-Owned Car Dealership Platform

> A production-ready full-stack automotive dealership website for JP CARS Kallakurichi, built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## ✨ Features

- **Cinematic intro animation** — shown once per session, respects reduced-motion
- **Premium homepage** — hero, search, trust, featured cars, brand/budget browse, how it works, sell, finance, social, FAQ, location, CTA
- **Cars marketplace** — sidebar/drawer filters, sort, filter chips, skeleton loaders
- **Vehicle detail page** — image gallery, thumbnails, spec grid, WhatsApp enquiry, mobile sticky CTA
- **Working EMI calculator** — reducing-balance formula
- **Sell Your Car** — validated form with all required fields
- **Test Drive booking** — date/time picker, vehicle selector
- **Finance page** — calculator + enquiry form
- **Services, About, Contact** — complete pages
- **Compare cars** — up to 3 vehicles side-by-side
- **Saved cars** — localStorage wishlist
- **Admin dashboard** — vehicle/lead management (requires Supabase)
- **Dark mode** — premium automotive showroom feel
- **Fully responsive** — mobile-first design
- **SEO** — metadata, sitemap, robots, Open Graph
- **Analytics abstraction** — plug in your preferred SDK

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## 📁 Project Structure

```
jp-cars/
├── app/
│   ├── (public)/          # Public pages (homepage, cars, about, etc.)
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── home/              # Homepage sections
│   ├── cars/              # Vehicle card, skeleton
│   ├── shared/            # IntroScreen, animations
│   └── providers/         # Theme, toast
├── config/
│   └── business.ts        # Central business config
├── lib/
│   ├── utils.ts           # EMI calc, formatters
│   ├── analytics.ts       # Analytics abstraction
│   ├── demo-data.ts       # Demo inventory (12 cars)
│   └── supabase/          # Client + server clients
├── types/
│   └── index.ts           # Shared TypeScript types
├── supabase/
│   └── migrations/        # SQL migration files
├── .env.example           # Environment template
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# 1. Clone or download the project
cd jp-cars

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **The site works immediately without Supabase** using demo data. Configure Supabase for live data.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Required for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Business contact (pre-filled with JP CARS details)
NEXT_PUBLIC_PHONE_NUMBER=+919943882320
NEXT_PUBLIC_WHATSAPP_NUMBER=919751882320
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.app.goo.gl/rbqMaVbvSzqXwjzk9
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/jp_cars_kallakurichi_/
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@jpcarskallakurichi
NEXT_PUBLIC_WHATSAPP_CATALOG_URL=https://wa.me/c/919751882320
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/CC1299Sh5ia1z42NeJ3mBb?mode=ac_t

# Supabase (optional — enables live database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Maps embed (optional)
GOOGLE_MAPS_API_KEY=
```

---

## 🗄️ Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` *(server-side only, never expose in browser)*
5. Create a storage bucket called `vehicle-images` (public)

## Admin Login

Set these server-side variables in `.env.local` before opening `/admin`:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-unique-long-password
ADMIN_SESSION_SECRET=your-random-secret-at-least-32-characters-long
```

Generate a session secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Admin routes require a signed, HTTP-only session cookie; there is no default username or password.

Vehicle images uploaded from the admin inventory form are stored locally in `data/uploads/cars/`. Use persistent object storage for deployments with an ephemeral filesystem.

Sell-car enquiry photos and request records are stored locally in `data/uploads/sell-requests/` and `data/sell-car-requests.json`; the admin Sell Requests page displays the submitted photos. Use persistent object storage and a database for deployments with an ephemeral filesystem.

---

## 🐙 GitHub Deployment

```bash
# Initialize git
git init
git add .
git commit -m "Initial JP CARS website"
git branch -M main

# Create a repo on GitHub, then:
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

---

## ▲ Vercel Deployment

### Step 1 — Login to Vercel
Go to [vercel.com](https://vercel.com) and sign in.

### Step 2 — Import Repository
Click **Add New Project** → Import your GitHub repository.

### Step 3 — Framework Detection
Vercel automatically detects Next.js. No configuration needed.

### Step 4 — Add Environment Variables
In Vercel project settings, add all variables from `.env.example`.

### Step 5 — Deploy
Click **Deploy**. Your site will be live in ~2 minutes.

### Step 6 — Set Your Domain
Copy the Vercel URL and set `NEXT_PUBLIC_SITE_URL` to it.

---

### 🔄 Future Updates

After any code change:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel automatically redeploys from GitHub.

---

## ✅ Production Checklist

- [ ] Supabase project created and migration run
- [ ] All environment variables set in Vercel
- [ ] Demo data removed or kept (clearly marked)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] Google Maps API key configured (optional)
- [ ] Instagram and YouTube accounts verified
- [ ] Site tested on mobile and desktop
- [ ] Favicon confirmed in browser tab
- [ ] Contact details verified (phone, WhatsApp, maps)

---

## 📞 Business Contact

- **Phone:** +91 99438 82320
- **WhatsApp:** +91 97518 82320
- **Instagram:** [@jp_cars_kallakurichi_](https://www.instagram.com/jp_cars_kallakurichi_/)
- **YouTube:** [@jpcarskallakurichi](https://youtube.com/@jpcarskallakurichi)
- **Location:** Kallakurichi, Tamil Nadu

---

*Built with ❤️ for JP CARS Kallakurichi*
