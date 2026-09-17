# Frontend

- Work in `web/`: React 19, TypeScript, Vite, Oxlint, plain CSS, `@mysten/sui`, `ogl`, and `html-to-image`. Use the existing npm manifests and lockfiles.
- Follow adjacent formatting and `web/.oxlintrc.json`; ESLint, Black, and a formatter command are not configured here.
- Preserve the single-route, single-viewport layout, local React state, and existing card scaling. Do not add a router, global state library, UI kit, wallet integration, or backend without a task requiring it.
- Keep network configuration in `src/config.ts` and the GraphQL client in `src/lib/suiClient.ts`. Follow the installed SDK usage in `usePortfolio`; older specs show obsolete RPC response shapes.
- Preserve loading, empty, success, and error behavior, including protection against updates after effect cleanup. Do not substitute fabricated profile data when a fetch fails.
- Keep `about` out of rendered card content. Split comma-separated skills through the mapper; display `issued` as stored rather than parsing it as a date.
- Use `/assets/profile.png` for the local profile photo. The contract's `photo_url` serves explorers and is not the site's profile-image source.
- Preserve card flip, keyboard interaction, copy feedback, and network-correct explorer links when changing the card.
- For Camera changes, inspect `BuilderCardExport.tsx`, `useCardPhotoExport.ts`, and `lib/cardPhotoExport.ts`. Reuse the live card data and shared faces in the off-screen export; preserve 1080x1350 output and disable export unless the portfolio loaded successfully.
