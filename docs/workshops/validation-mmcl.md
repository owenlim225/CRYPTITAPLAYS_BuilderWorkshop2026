# MMCL edition validation

Validated on 2026-10-05 (Asia/Manila). Student code: `5dcedbe`; facilitator code: `642dcf7`. Subsequent release documentation does not alter the tested frontend.

## Results

- `npm run lint` in each branch's `web/`: passed with the same six existing React/hooks warnings. No new warnings were introduced.
- `npm run build` in each branch's `web/`: passed, including TypeScript checking and Vite production builds.
- Browser checks used headless Microsoft Edge through Playwright against local Vite servers. Portfolio responses were replaced with explicit test fixtures at the browser boundary; no mock data or test-mode switch was added to the application.
- Empty, loading, error, and successful profile rendering and Camera eligibility passed on both branches.
- The starter's three insects landed, scattered during spin, stayed away through return motion, and landed again. Reduced motion disabled insect animation and hid insects during motion. The facilitator contained no insect component, including after spin/stop and a return-delay wait.
- Pointer flip on both faces, Enter/Space flip, object-ID clipboard copy, and spin/stop passed. Card and controls fit at 1440×1000, 1024×768, 768×1024, and 390×844.
- All six supplied logos loaded in the requested order. Desktop front/back, mobile front/back, and both generated exports were visually inspected.
- Both branches generated actual 1080×1350 PNG downloads containing both card faces and no insects. The facilitator's exported layout matched its shared face design.
- Missing-photo fallback passed. Forced export failure showed a dismissible error, restored Camera availability, and allowed dismissal above the mobile footer.
- Local documentation links, partner asset references, and `git diff --check` passed.

## Scope and limitations

These checks validate local frontend behavior with controlled data, not current Sui GraphQL availability or a production deployment. No on-chain writes were performed. Move was unchanged, so Move build/test was not rerun. The six existing lint warnings remain outside this edition's changes.

The fixed-size card canvas continues to scale down on phones; desktop remains the most readable environment for editing the card. Mobile fit checks do not establish a full accessibility audit or real-device browser coverage.

During validation, existing control defects were corrected: viewport fitting now includes action controls, Flip sits outside rotating faces, and export errors use a portal so the footer cannot obscure their dismiss button.
