# Cryptita Plays — Builder Workshop: Project Context

> Durable context for contributors, maintainers, and AI assistants. This document describes the repository as observed on 2026-10-02. When it conflicts with source code or the current root `README.md`, inspect the repository and treat current code and the root README as authoritative.

## 1. What this project is

Cryptita Plays — Builder Workshop is an educational Web3 project that teaches participants to:

1. publish a Sui Move package,
2. create an owned on-chain `BuilderCard` object,
3. point a read-only React site at that object, and
4. deploy the site so the card can be shared and verified.

The repository pairs two deliberately separate deliverables:

- `move/` — a Sui Move 2024 package named `builder_card`.
- `web/` — a static Vite + React profile site that reads one Sui object through Sui GraphQL and renders a visual BuilderCard.

The project is a workshop companion for people who have previously joined Base Build and ChainTalk. It is intended to move learners from Web3 concepts to a complete publish/read/deploy loop.

## 2. Core product boundary

The most important architectural rule is:

> On-chain writes happen through the Sui CLI in the terminal. The browser only reads and displays an already-created object.

There is intentionally:

- no browser wallet integration;
- no connect-wallet flow;
- no create/edit form;
- no browser transaction signing;
- no backend or server-side API in this repository;
- no site-side mutation of the `BuilderCard`.

The participant creates the package and card with `sui client publish` and `sui client call`, then configures the frontend with the resulting **BuilderCard Object ID**. The site fetches that object from the selected Sui GraphQL endpoint.

## 3. Source-of-truth and instruction precedence

Use this order when resolving ambiguity:

1. Current source code and package manifests.
2. The current root `README.md`, especially its Mainnet workshop path and CLI examples.
3. `AGENTS.md` and the focused instructions in `docs/agents/`.
4. `PROJECT_CONTEXT.md` as a consolidated map of the project.
5. Older or ignored planning/specification material only when it agrees with the above.

The repository guidance explicitly says that current code and the root README supersede outdated implementation details in `spec/`. The root `.gitignore` ignores `spec/`, and that directory may not be present in a fresh checkout. Do not reintroduce behaviors merely because an older specification describes them.

Known documentation drift:

- `web/README.md` is a short frontend README and still shows `VITE_SUI_NETWORK=testnet` in its example. The production workshop path in the root README and the tracked `web/.env.example` use `mainnet`.
- Some historical specs describe manual builder numbers, a different argument count, no Display initialization, or different photo handling. Those are obsolete for the current code.
- Before changing behavior, inspect `move/sources/builder_card.move`, `web/src/`, `web/.env.example`, and the root README together.

## 4. Repository map

```text
.
├── AGENTS.md                         Repository-specific agent rules
├── README.md                         Full workshop guide; current operational source of truth
├── PROJECT_CONTEXT.md                This consolidated LLM/contributor context
├── .gitignore                        Shared ignores, including env/build/spec paths
├── docs/
│   ├── agents/                       Development, frontend, operations, verification, Git guidance
│   ├── forms/                        Workshop header artwork and related assets
│   └── readme/                       Screenshots and diagrams embedded by README.md
├── move/
│   ├── Move.toml                     Move package and registry dependency declaration
│   ├── Move.lock                     Generated dependency lockfile; preserve it
│   └── sources/builder_card.move     On-chain package source
└── web/
    ├── package.json                  Frontend scripts and dependencies
    ├── package-lock.json             Locked frontend dependencies
    ├── .env.example                  Public build-time configuration template
    ├── index.html                    Vite HTML entry
    ├── public/assets/                Static logos, icons, and profile.png
    └── src/
        ├── App.tsx                   Page composition and responsive card layout
        ├── components/               Card, export, branding, header/footer, effects
        ├── hooks/                    Portfolio loading, card orbit, photo export
        ├── lib/                      Sui mapping, client, theme, icons, export helpers
        ├── styles/                   Global, card, and export CSS
        ├── config.ts                 Network/object-ID configuration
        ├── main.tsx                  React entry and theme initialization
        └── types.ts                  Frontend data contracts
```

Generated or local-only material that should not be committed includes `web/.env`, `web/dist/`, `move/build/`, `move/.move/`, and dependency folders.

## 5. On-chain package

### Package configuration

`move/Move.toml` declares:

- package name: `builder_card`;
- version: `0.1.0`;
- Move edition: `2024`;
- dependency: `builder_registry` from `https://github.com/Cryptita-Plays/cryptita-builder-registry.git`, subdirectory `builder_registry`, revision `main`.

The registry revision follows `main`; it is not an immutable commit pin. Do not describe it as pinned or change it incidentally.

### Module and types

The module is `builder_card::builder_card` in `move/sources/builder_card.move`.

It defines:

- `BUILDER_CARD` — a one-time witness used during package initialization.
- `BuilderCard` — an owned, transferable object with `key` and `store` abilities.

`BuilderCard` fields, in order, are:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `UID` | Sui object identity |
| `builder_name` | `String` | Participant display name |
| `builder_no` | `u64` | Chronological workshop-wide number assigned by the shared registry |
| `profession` | `String` | Participant profession |
| `program` | `String` | Program or course |
| `country` | `String` | Country code or name |
| `specialization` | `String` | Area of specialization |
| `building_since` | `String` | Participant-supplied year/text |
| `focus` | `String` | Current focus |
| `community` | `String` | Community or organization |
| `skills` | `String` | Comma-separated skills stored on-chain |
| `issued` | `String` | Cohort/issue text, currently `August 2026` in the workshop path |
| `about` | `String` | On-chain description; intentionally not rendered by the site |
| `website_url` | `String` | Deployed public site URL; used as the Display link |
| `photo_url` | `String` | Derived as `{website_url}/assets/profile.png` for explorers |

### Package initialization and Display metadata

`init` runs once per published package. It claims the publisher, creates Sui `Display<BuilderCard>` metadata, updates its version, and transfers both the publisher and Display object to the publishing sender.

Display keys currently include:

`name`, `description`, `creator`, `image_url`, `builder_no`, `profession`, `program`, `country`, `specialization`, `building_since`, `focus`, `community`, `skills`, `issued`, and `link`.

The Display templates make explorer presentation human-readable:

- name: `Cryptita Builder #{builder_no} — {builder_name}`
- creator: `{builder_name}`
- image URL: `{photo_url}`
- link: `{website_url}`
- description: a fixed Proof of Learning & Building description
- the remaining listed fields map to the corresponding `BuilderCard` fields.

The frontend does **not** use `photo_url` as its profile image source. It uses the deployed site’s local `/assets/profile.png`. `photo_url` exists so explorers such as Suiscan can show the public image URL.

### Create function contract

The public entry point is:

```text
create_builder_card(
  registry: &mut BuilderRegistry,
  builder_name: String,
  profession: String,
  program: String,
  country: String,
  specialization: String,
  building_since: String,
  focus: String,
  community: String,
  skills: String,
  issued: String,
  about: String,
  website_url: String,
  ctx: &mut TxContext,
)
```

The CLI supplies `ctx`; the user supplies one shared registry object followed by **twelve strings**. The function:

1. calls `claim_builder_number(registry)`;
2. derives `photo_url` by appending `/assets/profile.png` to `website_url`;
3. constructs the `BuilderCard`;
4. transfers the card to `tx_context::sender(ctx)`.

The registry object is not embedded in the card. It is a separate shared object used only to allocate the builder number.

The exact current Mainnet workshop registry object is:

```text
0x297cb610c0c47edc1e12008812f28cd8a1f35f95bb406d45f4b76fa9fda2e04c
```

The README also documents this Testnet practice registry:

```text
0x2995095d1e6fda52afde3649a74be5fc2b1dc8b57bfc9f60d5ff708afdcdc923
```

Use the registry matching the active network. Do not pass a manually chosen `builder_no`; the registry assigns it.

## 6. ID vocabulary and lifecycle

These identifiers have different roles and must never be substituted for one another:

| Identifier | Obtained from | Used for |
| --- | --- | --- |
| Package ID | `sui client publish` output under `Published Objects` as `PackageID` | CLI `--package` when calling `create_builder_card` |
| Registry object ID | Fixed shared workshop registry | First value after `--args`; passed as the mutable registry object |
| BuilderCard Object ID | Successful `create_builder_card` transaction, `Created Object ID` | `VITE_PORTFOLIO_OBJECT_ID` in the frontend |
| Site URL | Successful Vercel deployment | Last `create_builder_card` argument as `website_url` |

The website reads the **created BuilderCard object**, not the package and not the registry.

End-to-end lifecycle:

```text
replace web/public/assets/profile.png
        ↓
deploy web/ and obtain an HTTPS URL
        ↓
sui move build && sui move test
        ↓
sui client publish → Package ID
        ↓
sui client call create_builder_card → BuilderCard Object ID
        ↓
set VITE_PORTFOLIO_OBJECT_ID to that object ID
        ↓
rebuild/redeploy web/ → browser reads the object from Sui GraphQL
```

On-chain objects cannot be deleted by clearing local files. A “reset” means pointing the site to a different object or clearing the displayed object ID; it does not erase chain history.

## 7. Frontend stack and runtime architecture

The frontend is a single-route, single-viewport React application using:

- React 19 and React DOM;
- TypeScript 6;
- Vite 8;
- `@mysten/sui` GraphQL client;
- `html-to-image` for client-side PNG export;
- `simple-icons` for brand icons;
- Oxlint for linting;
- plain CSS, with no UI kit or router.

### Configuration

`web/src/config.ts` reads Vite build-time environment variables:

```env
VITE_PORTFOLIO_OBJECT_ID=
VITE_SUI_NETWORK=mainnet
VITE_CHAIN=sui
```

Behavior:

- `VITE_PORTFOLIO_OBJECT_ID` is trimmed. Empty means no object is configured.
- `VITE_SUI_NETWORK` is normalized to `mainnet`, `testnet`, or `devnet`. Unknown values become `testnet`.
- If `VITE_SUI_NETWORK` is omitted entirely, the source fallback is `testnet`; the tracked `.env.example` explicitly sets `mainnet` for the workshop production path.
- `VITE_CHAIN` selects the visual chain theme. The current supported chain is `sui`; unknown values fall back to Sui styling.
- GraphQL endpoints are selected in code:
  - Mainnet: `https://graphql.mainnet.sui.io/graphql`
  - Testnet: `https://graphql.testnet.sui.io/graphql`
  - Devnet: `https://graphql.devnet.sui.io/graphql`
- Vite inlines `VITE_*` variables at build time. Any production environment change requires a rebuild/redeploy.

`web/src/lib/suiClient.ts` creates one `SuiGraphQLClient` using the configured URL and network.

### Data flow and trust boundary

`usePortfolio` is the only portfolio-loading hook. Its flow is:

1. If there is no configured object ID, return `empty` and do not make a network request.
2. Otherwise request the object with `getObject({ objectId, include: { json: true } })`.
3. Reject a missing object.
4. Reject an object whose type does not end with `::builder_card::BuilderCard`.
5. Reject an object without readable JSON fields.
6. Map raw values through `mapBuilderCard`.
7. Publish `success` with the view model, or `error` with a human-readable message.

The effect protects against state updates after cleanup with a cancellation flag. Fetch failures are not replaced with fabricated profile data.

The frontend status model is:

```text
idle | loading | empty | success | error
```

The initial status is `loading` when an object ID is configured and `empty` otherwise. The current hook’s effect runs once for the module-level configuration; changing `.env` requires restarting/rebuilding the app rather than expecting hot runtime reconfiguration.

`mapBuilderCard` is the adapter between untrusted GraphQL JSON and typed UI data:

- all raw field values become strings, with nullish values becoming empty strings;
- `skills` is split on commas, trimmed, and filtered for empty items;
- owner values are normalized from string, `AddressOwner`, `ObjectOwner`, `Shared`, `Immutable`, or JSON fallback forms;
- the mapper preserves `about` in the typed data but the card intentionally does not render it.

The main frontend contracts live in `web/src/types.ts`:

- `BuilderCardFields` mirrors the on-chain string fields as strings;
- `BuilderCardView` adds parsed skills, object ID, owner, and network label;
- `UsePortfolioResult` contains status, nullable view data, and nullable error.

### Page composition

`web/src/main.tsx` applies the active Sui chain theme, imports global styles, and mounts `<App />` inside React Strict Mode.

`App.tsx` composes:

- pointer-responsive campus image background with reduced-motion support;
- `Header` — Cryptita Plays link and workshop GitHub link;
- `ProfileCard` — interactive card front/back and on-chain metadata;
- `SocialActions` — Camera export, Spin toggle, and Cryptita Plays social links;
- `Footer` — Proof of Learning & Building explanation and public-data consent language.

The card uses a measured layout. `useCardLayout` observes header/footer/stage/card sizes, calculates a fit scale, and keeps the card plus social actions within the available viewport. Preserve this responsive scaling logic when changing layout.

### Card behavior

`ProfileCard` and `ProfileCardFaces` implement:

- front/back flip on card interaction;
- keyboard activation and accessible labels;
- copy controls for object ID and owner with temporary feedback;
- network-correct Suiscan object links;
- placeholder, loading, success, and error rendering;
- local `/assets/profile.png` display with a broken-image fallback;
- optional continuous 3D orbit/spin through `useCardOrbit`;
- reduced-motion handling in the orbit/background effects.

The front face displays name, builder number, profession, program, country, specialization, building-since value, focus, community, parsed skills, issued value, network, object ID, owner, and Sui branding. `about` is deliberately omitted. Empty/error credential rows use `Not configured`, `Unavailable`, or `—` according to state.

The status dot is based on whether `VITE_PORTFOLIO_OBJECT_ID` is configured, not on whether the latest fetch succeeded. The field content and error message still distinguish loading, empty, success, and error states.

### Photo export

The Camera action is enabled only after the portfolio reaches `success`.

`BuilderCardExport` renders an off-screen export composition using the same front and back face components and the same live portfolio data. `useCardPhotoExport`:

1. waits for paint, images, and fonts;
2. captures the export node with `html-to-image` at a 2x supersampled scale;
3. downsamples to a 1080×1350 PNG (4:5 social format);
4. downloads `cryptita-builder-{builder-name}.png` with a sanitized filename;
5. shows an error toast and downloads a readable fallback error PNG if capture fails.

The shared export constants are in `web/src/lib/cardPhotoExport.ts`. Preserve the 1080×1350 dimensions, enabled-state rule, live card data, and failure handling when modifying export behavior.

## 8. Static assets and branding

The participant replaces `web/public/assets/profile.png` with a portrait and keeps that exact filename. The card crops it to its frame. The image is served at `/assets/profile.png` both locally and from the deployed site.

Other public assets include Cryptita Plays, Sui, and partner logos under `web/public/assets/icon/`, plus `favicon.svg` and `icons.svg`.

The visual system is Sui-themed today:

- primary color `#4DA2FF`;
- molten background colors `#0B3D7A`, `#4DA2FF`, and `#D6EBFF`;
- `VITE_CHAIN=sui` drives CSS variables and theme-color metadata.

Do not add a second chain abstraction unless the task explicitly expands the product scope. The existing types and theme registry are intentionally narrow.

## 9. Workshop operations

### Prerequisites

- Node.js LTS;
- Sui CLI with Move edition 2024 support;
- a GitHub account;
- a Vercel account for hosting;
- a funded Sui address for the selected network.

For the production workshop path, the active Sui environment is Mainnet and the address needs Mainnet SUI for gas. Testnet is only an optional practice path.

### Install and local setup

From the repository root:

```text
cd web
npm ci
```

Copy `web/.env.example` to `web/.env` using the platform’s normal file-copy command. Keep `VITE_PORTFOLIO_OBJECT_ID` empty until a card has been created. Never commit `.env` values, keystores, private keys, tokens, or credentials.

Check the Sui CLI and active environment:

```text
sui --version
sui client active-env
sui client active-address
sui client balance
```

For production, switch to Mainnet and verify again before publishing or calling a transaction.

### Frontend development and deployment

Local development from `web/`:

```text
npm run dev
npm run lint
npm run build
npm run preview
```

Vercel settings:

| Setting | Value |
| --- | --- |
| Root directory | `web` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Required production configuration | `VITE_SUI_NETWORK`, then `VITE_PORTFOLIO_OBJECT_ID` after creation |

Deploy the site before creating the on-chain card so its HTTPS URL can be passed as `website_url`. After changing Vercel environment variables, redeploy; the browser bundle already contains the old values until rebuilt.

### Move validation, publish, and create

From `move/`:

```text
sui move build
sui move test
```

Publish on the intended network:

```text
sui client publish
```

Copy `PackageID` from the publish output under `Published Objects`, not the transaction digest. Then call `create_builder_card` with:

- the correct shared registry ID first;
- the twelve strings in the exact signature order;
- `website_url` as the final string, preferably an HTTPS URL with no trailing slash;
- an appropriate gas budget.

After success, copy the new `Created Object ID` into `web/.env` and the matching Vercel variable. Rebuild/redeploy and verify the fields, green status indication, object/owner/network rows, profile image, and Suiscan links.

Do not blindly retry a publish or create transaction after an uncertain response. Inspect transaction effects first. Retrying creation creates another card and consumes gas; it is not idempotent.

## 10. Validation policy and known limitations

The project’s verification guidance says to run the smallest relevant checks first:

| Change | Directory | Checks |
| --- | --- | --- |
| Frontend code or styling | `web/` | `npm run lint`, then `npm run build` |
| Move code/dependencies | `move/` | `sui move build`, then `sui move test` |
| Documentation only | repository root | Check local links and commands against manifests; run `git diff --check` |

Important limitations:

- `npm run build` already performs TypeScript checking via `tsc -b` before `vite build`.
- There is no separate frontend test runner, coverage threshold, formatter script, or CI workflow in the tracked project.
- The repository currently has no Move test files, even though the documented command is `sui move test`; an empty test run is not behavioral coverage.
- Routine validation must not require funded wallets, live writes, publishing, or creating on-chain objects.
- For frontend behavior changes, manually consider empty/loading/error/success states. For UI/layout changes, check narrow and desktop viewports, scaling, flip, copy controls, reduced motion, and export dimensions/disabled states.
- Report commands actually run and distinguish passed, skipped, blocked, and unavailable checks. Never claim an unavailable check passed.

For a documentation-only update, the minimum useful verification is:

```text
git diff --check
```

Then inspect relative Markdown links and make sure commands match `web/package.json`, `move/Move.toml`, and the current README.

## 11. Safety rules and invariants

Preserve these invariants unless the task explicitly changes the product:

1. The frontend remains read-only.
2. `BuilderCard` remains an owned object transferred to the creator.
3. The registry remains a separate shared object.
4. `create_builder_card` keeps the registry-first, twelve-string signature with `website_url` last.
5. `builder_no` remains registry-assigned; callers do not provide it.
6. `photo_url` remains derived from the deployed site URL and is for explorer metadata.
7. The frontend profile source remains `/assets/profile.png`.
8. `about` stays out of rendered card content.
9. `VITE_PORTFOLIO_OBJECT_ID` means BuilderCard Object ID, never Package ID.
10. The configured network must match the network where the object exists.
11. Environment-specific values belong in configuration; no secrets belong in the frontend or repository.
12. Preserve `move/Move.lock` and do not casually mutate the registry revision.
13. Preserve loading, empty, success, error, cancellation, accessibility, reduced-motion, and export failure behavior.

## 12. Change guide for future agents

Before editing:

1. Read `AGENTS.md` and only the relevant files under `docs/agents/`.
2. Inspect `git status --short --branch` and preserve unrelated user changes.
3. Read the nearest source files and manifests, not only an older spec.
4. Decide whether the change is Move, frontend, styling/image export, operations, or documentation.

When changing a contract or field, update all affected layers together:

```text
Move struct/signature
  → frontend types
  → GraphQL mapper and validation
  → hooks/consumers/components
  → CLI examples and README
  → relevant verification/documentation
```

When changing frontend behavior, keep external/network details behind the existing config/client/mapper boundaries. Do not introduce a router, global state library, UI kit, wallet, backend, or competing architecture without an explicit scope change.

When changing deployment/operations, verify network, address, target IDs, and gas requirements before any authorized transaction. Treat uncertain transaction responses as an inspection problem, not a reason to blindly retry.

When making a documentation-only change, avoid rewriting unrelated user edits. Check links, commands, code fences, and `git diff --check`.

## 13. Useful references

- Main workshop guide: [`README.md`](README.md)
- Frontend guide: [`web/README.md`](web/README.md)
- Contract source: [`move/sources/builder_card.move`](move/sources/builder_card.move)
- Move package manifest: [`move/Move.toml`](move/Move.toml)
- Frontend environment template: [`web/.env.example`](web/.env.example)
- Frontend types: [`web/src/types.ts`](web/src/types.ts)
- Sui configuration: [`web/src/config.ts`](web/src/config.ts)
- Sui GraphQL client: [`web/src/lib/suiClient.ts`](web/src/lib/suiClient.ts)
- Portfolio hook: [`web/src/hooks/usePortfolio.ts`](web/src/hooks/usePortfolio.ts)
- Raw-to-view mapper: [`web/src/lib/mapBuilderCard.ts`](web/src/lib/mapBuilderCard.ts)
- Export constants: [`web/src/lib/cardPhotoExport.ts`](web/src/lib/cardPhotoExport.ts)
- Development guidance: [`docs/agents/development.md`](docs/agents/development.md)
- Frontend guidance: [`docs/agents/frontend.md`](docs/agents/frontend.md)
- Contract/operations guidance: [`docs/agents/contracts-and-operations.md`](docs/agents/contracts-and-operations.md)
- Verification guidance: [`docs/agents/verification.md`](docs/agents/verification.md)
- Git guidance: [`docs/agents/git-workflow.md`](docs/agents/git-workflow.md)

External project resources are linked from the root README, including the Sui documentation, Suiscan, the shared Builder Registry repository, the upstream workshop repository, Vercel, and the optional Testnet faucet.

