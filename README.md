# Lana Nova Beats – MVP Beat Store

This is a Next.js App Router project for the Lana Nova Beats single-producer beat store. It uses Tailwind CSS for styling and simple custom UI components.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Stripe Checkout (via API route)

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

## Environment variables

Create a `.env.local` file in the project root and add:

- `STRIPE_SECRET_KEY` – your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – your Stripe publishable key
- `NEXT_PUBLIC_SITE_URL` – the canonical URL of the deployed site (used for metadata and Stripe redirects)

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – build for production
- `npm run start` – start the production server
- `npm run lint` – run ESLint

