# Verification and completion

Run the smallest relevant checks first; broaden them when the change affects additional surfaces.

| Change | Working directory | Checks |
| --- | --- | --- |
| Frontend code | `web/` | `npm run test`, `npm run lint`, then `npm run build` |
| Move code or dependencies | `move/` | `sui move build`, then `sui move test` |
| Documentation only | Repository root | Check local links, commands against manifests, and `git diff --check` |

- `web` build runs `tsc -b && vite build`; there is no separate typecheck script or root npm package.
- Use `npm ci` in `web/` when installing the locked frontend dependencies. Avoid incidental dependency upgrades.
- The frontend uses Node's built-in test runner for focused mapper tests. There is no coverage threshold, formatter script, or CI workflow. The Move package has a photo URL unit test; it does not cover registry assignment because the registry dependency does not expose a test constructor. Do not claim these tests demonstrate full behavioral coverage.
- When writing isolated tests, mock external services. For integration work, verify the relevant adapter's success and failure contracts without depending on funded wallets or live chain writes in routine tests.
- For frontend behavior changes, check relevant empty/loading/error/success states. For layout changes, check narrow and desktop viewports, scaling, flip, and copy controls. For export changes, verify dimensions, enabled states, and failure handling.
- Use [the existing verification checklist](../../spec/07-testing-and-verification-spec.md) only where consistent with current code and README; correct its obsolete CLI and photo assumptions when planning checks.
- Before deployment, run the frontend build; before merging code, run applicable lint, build, and tests. If CI is configured later, require its applicable checks before merge.
- Report commands actually run, their results, manual checks, and any checks skipped or blocked with reasons. Never equate an unavailable check with a passing check.

Test breadth and mandatory formatter/CI setup remain pending in [the review](../agent-guidance-review.md).
