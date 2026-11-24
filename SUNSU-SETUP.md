# Sunsu setup

The storefront is a responsive Next.js site with a local product bag and manual WhatsApp enquiries. No database or order backend is needed for this flow. The customer must send the WhatsApp draft; opening it does not submit an order. Prices, availability, delivery and payment are confirmed manually.

## Enable WhatsApp
Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business WhatsApp number in international format: country code followed by number, digits only (no plus). Restart the development server after changing it. For a deployed site, rebuild and redeploy because this public setting is included at build time.

Until a valid number is configured, the website disables WhatsApp checkout and shows an honest contact-availability message. No placeholder recipient is used.

## Run
`npm run dev` serves port 3010. `npm run build` exports the static website to `dist/`. Upload that folder to Netlify, or connect the repository using the included `netlify.toml` (build command `npm run build`, publish directory `dist`). No application backend is required. `npm start` is not used for this static export; preview `dist/` with a static web server. Avoid starting a second development server on the same port.

## Product details and prices
Edit `site/sunsu.ts` for product names, ingredients, pack sizes and colours. Images are in `public/images/sunsu`. Four products use the public Sunsu catalogue, verified 19 October 2026 at https://sunsu.vercel.app/ and https://sunsunature-3.onrender.com/api/products?limit=50: Mango, Berry, Pineapple and Natural Choco have 100 g / 250 g / 500 g price and MRP variants. Digest and Nannari were absent from that catalogue and remain enquiry-only at the supplied artwork pack weights. Packaging artwork may show a different weight; selected catalogue size is clearly shown in the UI and order. No API stock or health claims are imported. Confirm complete ingredient lists, preparation directions, storage, shelf life and report/product identity before publication. Lab reports are not published. Front-of-pack imagery is supplied brand artwork; review its printed claims separately before launch.

## Privacy and limitations
Only validated product-plus-variant IDs and quantities are saved in localStorage. Customer details are held in page memory and included in a WhatsApp URL only when the customer opens the enquiry. WhatsApp then handles the message under its own terms. There is no server-side lead capture, order tracking, online payment, automatic notification or stock management. Those features require a backend or commerce service if introduced later.

Pure helpers `cleanCart` and `orderMessage` are exported from `site/sunsu.ts` for testing. The enquiry form uses browser validation and quantity limits (1–99 packs per product/variant).

## Restored motion
`site/components/SunsuMotion.tsx` adapts the existing repository's `BottleWallHero.tsx` opposing diagonal product travel, drift, headline entrance and pointer tilt; `PressMarquee.tsx` scroll-velocity direction/speed/skew; and `ProductWheel.tsx` / `FlavourStage.tsx` sticky flavour progression, colour disc and packet wipe. They mount directly without loader events. Desktop has a sticky six-flavour showcase; mobile uses tabs, previous/next and swipe without a long pinned section. Card and preparation entries reveal on scroll. Existing original files are preserved for reference.

The visible bottom-left **Pause motion / Enable motion** control pauses continuous motion. OS reduced-motion defaults to paused; explicit enable opts in for this page session. `?static=1` forces deterministic static mode and disables the toggle. Content is readable before JavaScript and every product remains available without animation. Motion tickers skip offscreen updates and clean up on disable/unmount.

Cart storage schema version 2 keeps separate lines for each weight and migrates old product-only quantities to the first available variant. Prices and line/subtotals appear in the enquiry draft. Enquiry-only items remain explicitly additional to the known subtotal. Customer personal details are never persisted.

## Mix, stir and sip scene
`site/components/MixSipScene.tsx` adds the illustrated preparation sequence at `#mix`. Pour, Stir and Sip buttons select still frames; Replay opts into the site's motion setting. The sequence runs only while visible, pauses with global motion, and remains manually navigable in reduced-motion and `?static=1` previews. Benefits describe convenience, flavour choice and preparation rather than health outcomes.

## Flavour universe and pack landing pages
`/universe` is the optional six-world flavour explorer. Every world has featured ingredients, preparation guidance, current pack choices and links back to the relevant shop card. The homepage includes an entrance without removing its existing animations.

`/play` lists the six pack experiences. Stable pack destinations are `/play/mango`, `/play/berry`, `/play/digest`, `/play/pineapple`, `/play/choco` and `/play/nannari`. They reuse the preparation scene, show serving inspiration and include a three-round ingredient game. No account, database, external service or backend API is used. Device-only best scores and discovery stamps are stored under `sunsu-explorer-v1`; no customer details are stored. Storage failures leave the game usable in memory, and progress can be cleared with an inline confirmation. Scores are cosmetic, with no prize or redemption value.

The shared game/progress helpers are in `site/explore.ts`; UI is in `FlavourUniverse.tsx` and `FlavourPlay.tsx`, with scoped styles in `site/explore.css`. Product information and prices still come from `site/sunsu.ts`. Serving ideas are not verified measured recipes; follow the directions on the pack.

Before printing QR labels, deploy these routes to the final domain and confirm the full destination URLs. Set optional `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin (no path/query); it supplies canonical flavour URLs. Leave it blank during local development. The copy-link action shares the current page's real browser origin. No fake or localhost printable QR artwork is generated. Final pack QR codes should encode `https://YOUR-CONFIRMED-DOMAIN/play/FLAVOUR`; moving to another domain later would invalidate printed codes unless redirects are kept. Website hosting is still required, and game progress does not sync across devices or form a public leaderboard.
