# Lana Nova Beats — Claude Project Context

## What this is
A beat store for selling beats online. Owner is a single producer selling Lana Nova style beats (dark, moody, trap/R&B). Think BeatStars but custom-built and hosted on Railway.

## Tech Stack
- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (`app/api/`)
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe Checkout + webhooks
- **Hosting**: Railway (workspace: salomon26, user: salli/salli94)
- **Local DB**: Docker (`docker-compose up -d`)

## Project Structure
```
app/
  page.tsx              — Homepage (hero + featured beats)
  beats/page.tsx        — Full catalog with filters
  beats/[slug]/         — Beat detail + license picker
  cart/page.tsx         — Cart review
  checkout/page.tsx     — Checkout trigger
  success/page.tsx      — Post-payment success
  cancel/page.tsx       — Cancelled payment
  api/checkout/         — Creates Stripe Checkout session
  api/webhooks/stripe/  — Fulfills orders after payment
components/
  beats/                — BeatCard, BeatGrid, BeatFilters, FeaturedBeats
  audio/PlayerBar.tsx   — Floating audio player
  layout/               — SiteHeader, SiteFooter, CartLink
  ui/                   — Button, Badge, Input
context/
  CartContext.tsx        — Cart state (items, add, remove, subtotal)
  AudioPlayerContext.tsx — Audio preview player state
data/                   — Static fallback data (migrating to DB)
lib/
  db.ts                 — Prisma client singleton
  stripe.ts             — Stripe client singleton
prisma/
  schema.prisma          — DB schema (Beat, Order, OrderItem, License)
  seed.ts               — Seeds DB with initial beats + licenses
```

## Design System
- Dark aesthetic: black/near-black backgrounds
- Brand colors: orange accent (`lana-accent`), purple (`lana-purple-dark`)
- Utility classes: `card-surface`, `section`, `page-container`, `section-title`, `section-subtitle`
- Gradients: radial orange + purple for hero sections

## Environment Variables
See `.env.local` — needs real Stripe keys to test payments.
Local DB: `postgresql://postgres:postgres@localhost:5432/lana_nova_beats`

## Current State (as of 2026-03-08)
- Frontend: fully built (homepage, catalog, beat detail, cart, checkout flow)
- Backend: Stripe checkout API route working
- Stripe webhook: built, needs `STRIPE_WEBHOOK_SECRET` env var
- Database: schema created, Docker compose ready, NOT yet migrated
- Hosting: not yet deployed to Railway

## Next Steps
1. User installs Homebrew → then install Docker, gh, railway, stripe CLIs
2. Run `docker-compose up -d` to start local PostgreSQL
3. Run `npx prisma migrate dev --name init` to create DB tables
4. Run `npm run db:seed` to populate beats + licenses
5. Add real Stripe keys to `.env.local`
6. Test full purchase flow locally with `stripe listen`
7. Deploy to Railway

## Rules for Claude working on this project
- Think like a senior fullstack dev at all times
- Keep frontend dark and premium — this is a music brand
- Never expose Stripe secret key or DB credentials
- Always recalculate prices server-side (never trust client)
- Verify Stripe webhook signatures — always
- When context is ~80% full, run /strategic-compact automatically
