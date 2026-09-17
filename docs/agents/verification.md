# Verification and completion

Run the smallest relevant checks first; broaden them when the change affects additional surfaces.

| Change | Working directory | Checks |
| --- | --- | --- |
| Frontend code | `web/` | `npm run lint`, then `npm run build` |
| Move code or dependencies | `move/` | `sui move build`, then `sui move test` |
| Documentation only | Repository root | Check local links, commands against manifests, and `git diff --check` |

- `web` build runs `tsc -b && vite build`; there is no separate typecheck script. The root package has no build, lint, or test scripts.
- Use `npm ci` in `web/` when installing the locked frontend dependencies. Avoid incidental dependency upgrades.
- The repository currently has no frontend test runner, coverage threshold, formatter script, or CI workflow, and no Move test files. Do not invent `npm test`, an 80% coverage requirement, or claim that an empty test run demonstrates behavioral coverage.
- Add or update automated tests in proportion to changed behavior and risk, prioritizing regressions, contract changes, and failure paths. Do not require comprehensive unit tests for every change or tests that merely mirror implementation. Where a required test lacks a runner, identify that gap and scope the minimum suitable setup explicitly.
- Use existing checks. Add formatter or CI tooling as a separate scoped change when appropriate; their current absence does not block unrelated work.
- When writing isolated tests, mock external services. For integration work, verify the relevant adapter's success and failure contracts without depending on funded wallets or live chain writes in routine tests.
- For frontend behavior changes, check relevant empty/loading/error/success states. For layout changes, check narrow and desktop viewports, scaling, flip, and copy controls. For export changes, verify dimensions, enabled states, and failure handling.
- Use the README's workshop verification steps for relevant manual checks. If local `spec/` checklists are available, reconcile their CLI and photo assumptions with current code before using them; they are not shipped in clean checkouts.
- Before deployment, run the frontend build; before merging code, run applicable lint, build, and tests. If CI is configured later, require its applicable checks before merge.
- Report commands actually run, their results, manual checks, and any checks skipped or blocked with reasons. Never equate an unavailable check with a passing check.
