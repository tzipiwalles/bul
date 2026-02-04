# בול (Bul) - Haredi Professionals Marketplace

A high-performance, mobile-first marketplace for the Haredi (Ultra-Orthodox) community in Israel.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bul-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file located at `supabase/migrations/001_initial_schema.sql`

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with RTL support
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── (auth)/            # Auth routes (login, register)
├── components/
│   ├── ui/                # Shadcn/UI components
│   ├── layout/            # Layout components
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types for Supabase
└── supabase/
    └── migrations/        # SQL migration files
```

## Features

- 🌐 Full RTL (Right-to-Left) Hebrew support
- 📱 Mobile-first responsive design
- 🔒 Gender-based media upload rules (Tzniut compliance)
- ⭐ Star ratings (1-5, no text reviews)
- 📍 Location-based search
- 🚀 4 service types with dynamic CTAs:
  - Appointment (תורים)
  - Project (פרויקטים)
  - Emergency (חירום)
  - Retail (חנות/מסעדה)

## Service Types & CTAs

| Service Type | CTA Button | Action |
|--------------|------------|--------|
| Appointment | קביעת תור | Opens time picker modal |
| Project | תיאום פגישה | Opens lead form |
| Emergency | התקשר עכשיו | Direct call/WhatsApp |
| Retail | נווט לעסק | Opens Waze navigation |

## License

Private - All rights reserved
