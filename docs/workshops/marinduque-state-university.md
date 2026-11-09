# Marinduque State University: frontend challenges

This university edition starts with two unfinished exercises. First remove the insects that keep returning to the card; then redesign the entire card layout in your own style. Suggested beginner timings are 10–15 minutes and 30–45 minutes respectively. These are guides, not deadlines.

The site remains a read-only React/TypeScript frontend. These exercises require no wallet, gas, new Move deployment, or on-chain write. The [main workshop README](../../README.md) still describes the existing Mainnet CLI workflow if you also need to create your own BuilderCard. See [edition references](editions.md) for earlier workshops.

## Start from the Marinduque State University starter

The repository's `main` branch contains the Marinduque State University starter. Follow the README's fork instructions (copying only `main` is enough), then clone your fork. Replace the two placeholders below with your account and fork name. If you forked before this edition was published, sync your fork's `main` with upstream first.

```bash
git clone --branch main https://github.com/YOUR_GITHUB_USERNAME/YOUR_FORK_NAME.git
cd YOUR_FORK_NAME
git branch --show-current
```

Expected branch: `main`. The starter includes bugs and the original card design. Work on your fork's `main` so the README's push and hosting instructions apply directly.

For local practice without a fork, clone the upstream repository directly:

```bash
git clone --branch main https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026.git
cd CRYPTITAPLAYS_BuilderWorkshop2026
```

Use a fork if you want to push your work to your own GitHub repository or deploy it through the workshop's hosting flow.

Install the locked dependencies from `web/`:

```bash
cd web
npm ci
```

The repository includes `web/.env`. Clear `VITE_PORTFOLIO_OBJECT_ID` to begin with placeholders, and keep the network setting.

Run:

```bash
npm run dev
```

Open the local URL printed by Vite. Placeholder data is enough to begin both challenges. To check real values, clipboard controls, and image export, later use your existing BuilderCard object ID on the matching network, or an object supplied by the facilitator. Restart Vite after changing `.env`. Camera export requires a successful data fetch; do not enable it artificially or substitute fake data for a failed request.

## Challenge 1: remove the returning bugs

**Your task:** permanently remove the decorative insect component and its unused wiring, while keeping the card working.

Before editing, reproduce the problem: wait for insects to land, start spinning the card, and watch them scatter. Stop the spin, allow the card to settle, and wait for them to return. This is intentional starter behavior. Making the bugs briefly disappear by spinning or hiding them with a CSS rule does not complete the challenge.

Find the component responsible, trace where it is rendered, and remove the feature cleanly. Keep the spin animation, flip control, data display, and existing accessibility behavior. Reduced-motion preferences suppress insect animation in the starter; use the normal-motion setting when observing the flying behavior.

<details>
<summary>Hint 1: find the owner</summary>

Inspect [ProfileCard.tsx](../../web/src/components/ProfileCard.tsx). Which child adds insects, and which state describes whether the card is moving?

</details>

<details>
<summary>Hint 2: follow the component boundary</summary>

Search `web/src` for `WorkshopBugs`. Follow its import, JSX usage, and stylesheet dependency. Decide which code exists only for insects and which code still powers card motion.

</details>

<details>
<summary>Hint 3: clean up and verify</summary>

Removing the rendered child is only part of the cleanup. Remove unused imports and feature-only files or references, then run lint and build. Keep shared orbit state and styles needed by other card behavior. Search again to check for leftover feature references.

</details>

Completion checks:

- No insects appear on initial load, after repeated spin/stop cycles, or after a reload and waiting for their former return delay.
- The insects component is no longer mounted; the solution does not merely hide it.
- Card spin, pointer flip, keyboard flip, and populated-data copy controls still work.
- Lint and build pass without unused feature imports.

## Challenge 2: redesign the entire card

**Your task:** make the card your own. You may change the front and back composition, photo placement, typography, colors, materials, borders, and decorative elements. You are not limited to a frame-color change. Sketch a layout first, then implement it in small steps. There is no required visual style.

| Area | Starting point |
| --- | --- |
| Front/back markup, profile fields, and partner content | [ProfileCardFaces.tsx](../../web/src/components/ProfileCardFaces.tsx): `CardFrontFace`, `CardBackFace` |
| Card appearance and content layout | [profile-card.css](../../web/src/styles/profile-card.css): `.card-side`, `.card-main`, `.profile-details`, `.info-grid`, `.card-bottom`, `.back-content` |
| Live flip, keyboard, clipboard, and motion wiring | [ProfileCard.tsx](../../web/src/components/ProfileCard.tsx) |
| Viewport fitting and card design dimensions | [App.tsx](../../web/src/App.tsx): `CARD_WIDTH`, `CARD_ASPECT`, `useCardLayout` |
| Shared faces in the exported image | [BuilderCardExport.tsx](../../web/src/components/BuilderCardExport.tsx) |
| Export composition and dimensions | [card-photo-export.css](../../web/src/styles/card-photo-export.css), [cardPhotoExport.ts](../../web/src/lib/cardPhotoExport.ts) |
| Local profile image | [profile.png](../../web/public/assets/profile.png) |

Begin with the shared faces and card CSS so the same design reaches both the live card and export. `.profile-card` is a live wrapper, while the export uses `.builder-card-export__card-shell`; styling only the live wrapper will not necessarily change the exported faces. Preserve the outer design dimensions for the simplest route. If you choose a different card aspect ratio, update the live sizing assumptions and export composition together and check both faces fit. The exported PNG must remain **1080 × 1350**.

Your redesign must preserve:

- Existing displayed profile fields, builder number, skills, credentials, and network-correct explorer links. Keep `about` off the card and display `issued` as stored. Read values from the existing portfolio data rather than hardcoding them.
- A local profile photo from `/assets/profile.png`, with readable fallback behavior when the image is missing.
- Empty, loading, error, and successful data states. An error must remain visible and must not be replaced with invented profile data.
- Front/back flip, keyboard-operable controls, copy feedback, and the distinction between a card click and a link/button click. Back-face links must retain their hidden-face focus handling.
- A card that fits the existing single-viewport experience on narrow and desktop screens, with readable text and visible focus indicators.
- The Marinduque State University partner lineup: CJC Race, Blockchain4Youth, Grantix, Kamiyon Studio, and Blockchain4Her. Preserve asset proportions and the existing verified destinations.
- Shared live/export content, both faces visible in the exported composition, and Camera disabled until the profile successfully loads.

<details>
<summary>Design hint: separate layout from behavior</summary>

Try a new grid or flex composition within the faces first. Move existing field markup with its data bindings intact. Keep the flip/orbit transforms on their existing wrappers, and adjust typography and spacing after the content fits.

</details>

## Validate and share your work

From `web/`, run:

```bash
npm run lint
npm run test
npm run build
```

Build includes TypeScript checking. These commands check code; they do not prove the design or animation works.

Manually check the following and record what you actually verified:

1. At desktop and narrow/mobile viewport sizes, inspect both faces for clipped text, overlaps, missing logos, and inaccessible controls. Try long populated field values when available.
2. Spin, stop, flip with pointer, and use Tab plus Enter/Space on the Flip button. Confirm insects stay removed and links/copy controls still behave correctly.
3. With an empty object ID, confirm placeholders and disabled Camera. With a valid configured card, check loading then success. In browser developer tools, block the Sui GraphQL request and reload to confirm the error is visible; the app fetches on mount, so blocking a request after success alone does not change the card. Keep localhost unblocked so Vite can load. Unblock the request and reload to recover, then restore any changed configuration.
4. After a successful fetch, copy object ID and owner; export an image and inspect its actual **1080 × 1350** dimensions, both card faces, logo proportions, readable fields, and absence of insects. Check that a missing photo has a usable fallback. If no successful fetch is available, mark export and populated-data checks as pending rather than claiming they passed.
5. Keep `.env` out of Git. Review your diff, commit your solution on your own branch, and push that branch to your fork if submitting through GitHub. Share front/back screenshots, the exported image when available, and a short description of your design choices and checks.

If you deploy your solution from your fork's `main`, the README's hosting branch instructions apply directly. If you choose another solution branch, select that branch in your hosting settings. The original CLI and network instructions still apply to any optional on-chain work.
