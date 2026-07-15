# Ethiopidia

A TripAdvisor-style hotel discovery marketplace for Ethiopia. Travelers search, compare, and read reviews for hotels across Ethiopia's top destinations; booking always happens on the hotel's own website — Ethiopidia never handles availability, cart, or payment.

## Stack

- Next.js 14 (pages router) + TypeScript
- Tailwind CSS (custom teal / coral / navy brand theme)
- Client-side state via React context + localStorage (language, favorites, compare list, viewed history, mock auth)
- Mock data only — no backend/API

## What is included

- Homepage with hero search, destination rows, hotel carousels, and reviews strip
- Search results with filters (price, stars, traveler rating, amenities, property type), sort, list/map toggle, pagination
- Hotel detail pages (SSG) with categorized photo gallery, room types, amenities, rating breakdown, reviews, and a "Book / Check availability" redirect
- Redirect interstitial that hands off to each hotel's own external site
- Destination pages, hotel comparison view, reviews feed, and light guest account (favorites/history)
- Full English / Amharic (አማ) bilingual content, including all mock hotel/destination copy

## Run locally

```bash
npm install
npm run dev
```

Open the displayed local URL in your browser.

## Build

```bash
npm run build
```

## Database design

The production PostgreSQL design is documented in [`docs/database-schema.md`](docs/database-schema.md), with a dedicated [`docs/database-er-diagram.md`](docs/database-er-diagram.md). The executable DDL is in [`database/schema.sql`](database/schema.sql).

## Notes

This app uses mock data only and is designed as a frontend prototype for Ethiopidia.
