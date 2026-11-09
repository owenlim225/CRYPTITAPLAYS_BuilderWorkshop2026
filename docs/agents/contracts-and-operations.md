# Contracts, configuration, and operations

- Keep on-chain behavior in `move/sources/builder_card.move` (Move edition 2024). The owned `BuilderCard` is transferred to the creator; its registry dependency is a separate shared object.
- Preserve the current create signature: shared registry object followed by twelve strings, with `website_url` last. `builder_no` is a registry-assigned `u64`; `photo_url` derives from the website URL. Preserve Display metadata unless explicitly changing that contract.
- Use the current README for CLI arguments and setup. Older specs describe manual builder numbers, thirteen strings, no Display initialization, and different photo handling; do not reintroduce those behaviors.
- Put environment-specific settings in configuration; never hardcode credentials or commit keystores, private keys, or tokens. The tracked `web/.env` contains only public `VITE_*` browser configuration; never put secrets in it.
- The tracked `web/.env` may contain a public BuilderCard object ID. Use the created BuilderCard object ID, not the package ID, for `VITE_PORTFOLIO_OBJECT_ID`; match its network with `VITE_SUI_NETWORK`.
- Rebuild after production environment changes. Hosting uses root `web/`, build command `npm run build`, and output `dist/`.
- Before an authorized publish or transaction, verify the intended network, active address, target objects, and gas requirements. Routine validation does not require publishing or creating on-chain objects.
- Do not blindly retry a publish or create after an uncertain response: inspect transaction effects first. Repeated creation produces another object and consumes gas; on-chain history cannot be rolled back by deleting local files.
- Preserve `move/Move.lock`. The registry dependency currently follows `main` in `Move.toml`; do not describe it as an immutable pin or change its revision incidentally.
