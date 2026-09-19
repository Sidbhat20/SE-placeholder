# Suchetana Electricals

React + Vite portfolio with a Three.js kinetic sculpture, Rive interactions, expandable project placeholders, and a client-logo marquee.

## Development

Use Node.js 22.12+ (Node 22 LTS recommended).

```sh
npm ci
npm run dev -- --port 3000
```

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The static build is written to `dist/`. No environment variables or backend are required for the current preview.

## Vercel

Import this repository into Vercel with:

- Framework preset: **Vite**
- Root directory: repository root
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: **22.x**

Vercel does not need the Rive CLI. Compiled `.riv` assets and fallback images are committed in `public/`; the Rive WASM runtime is bundled locally by Vite.

## Source and assets

- `src/App.jsx`: page content and sections
- `src/KineticMobile.jsx`: interactive WebGL sculpture
- `src/ServiceAnimation.jsx`: viewport-aware Rive service loops
- `src/EnquiryAnimation.jsx`: demo enquiry interaction
- `src/ProjectStory.jsx`: accessible expanded image view
- `public/`: logos, portrait, Rive assets and static fallbacks
- `rive/`: editable animation sources and Python generators

Rive regeneration requires a separately installed Rive CLI; some image generation steps require Python/Pillow. Generated `rive/**/build/` folders are excluded from Git. Updated runtime assets must be copied into `public/` before deployment.

## Before public launch

- The enquiry form is a **demo** and does not send or store submissions. Connect a backend before enabling real enquiries.
- Client names are mock data; project images are placeholders. Verify project facts, testimonials, licensing details, contact information, and marketing/metadata claims before public release.
- Confirm permission to publish the supplied logo and portrait.
- Browser viewport checks are not a substitute for physical iOS/Safari device testing.
- Three.js is lazy-loaded; its production chunk currently triggers Vite's bundle-size advisory.

Do not commit `.env` files, credentials, `node_modules`, local tool state, or `dist`.
