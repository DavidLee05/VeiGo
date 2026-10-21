# VeiGo

VeiGo is a Vietnamese motorcycle marketplace concept for discovering used bikes
to buy or rent. This first slice is a responsive Next.js storefront with sample
listing data; authentication, listing details, booking, payments, and persistence
are not implemented yet.

## Design direction

- **Typography:** Be Vietnam Pro, chosen for legible Vietnamese diacritics and a
  contemporary, approachable marketplace feel.
- **Palette:** deep teal for confidence and primary actions; warm ivory for the
  canvas; muted amber for small accents and emphasis.
- **Layout:** editorial hero, focused search panel, photo-led listing cards, and
  a restrained information hierarchy across desktop and mobile.
- **Interaction:** buy/rent switch, text/brand/location/category/budget filters,
  saved-listing toggles, and an explicit no-results state.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>.

## Checks

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

## Deploy to Vercel

Import `DavidLee05/VeiGo` in Vercel and deploy the repository root. No environment
variables are needed for this static sample-data storefront.

## Current scope

- Frontend scaffold: Next.js App Router, React, and TypeScript.
- Listing content is local demonstration data in `src/lib/vehicles.ts`.
- Motorcycle imagery is served from Unsplash and optimized with `next/image`.
- The repository is linked locally to `https://github.com/DavidLee05/VeiGo.git`.
- No commit has been created and no code has been pushed to GitHub.
