# Cryptita Plays — Builder Workshop (frontend)

Read-only Vite + React homepage for the workshop `BuilderCard`.

This folder is the **static site**. On-chain writes happen with the **Sui CLI** in `../move/`, not in the browser.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run test     # mapper and GIF export checks
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve dist/
```

## Configure

The repository includes `.env` with these settings:

```env
VITE_PORTFOLIO_OBJECT_ID=<your BuilderCard object ID>
VITE_SUI_NETWORK=mainnet
VITE_CHAIN=sui
```

- Clear `VITE_PORTFOLIO_OBJECT_ID` to show the placeholder card and grey status dot.
- After `create_builder_card`, paste the **created object ID** and rebuild. Vite inlines `VITE_*` at build time.
- Replace `public/assets/profile.png` with your portrait (keep the filename).

## Deploy

Vercel: **Root Directory** `web`, **Build** `npm run build`, **Output** `dist`.

Full workshop loop (photo → deploy site → publish Move → create card → point env → rebuild): see the [root README](../README.md).
