# COMMUNITY-2-MMCL facilitator solutions

This branch (`codex/community-2-mmcl-facilitator`) contains completed examples. Start participants on `codex/community-2-mmcl`, where both challenges are unfinished. See the [student instructions](community-2-mmcl.md) and [edition index](editions.md).

## Challenge 1: remove the component

Suggested time: 10–15 minutes. Spinning only changes the component's animation state; it does not remove the component. The insects return by design.

The complete solution in `web/src/components/ProfileCard.tsx` is:

1. Delete `import { WorkshopBugs } from './WorkshopBugs';`.
2. Delete `<WorkshopBugs motionLocked={motionLocked} />`.
3. Remove `workshop-bugs-host` from the wrapper class, leaving `card-scale__inner`.
4. Delete `web/src/components/WorkshopBugs.tsx` and `web/src/styles/workshop-bugs.css`, which are now unused.

Keep `motionLocked`, `useCardOrbit`, flip state, and the shared faces: those implement real card behavior. Hiding the bugs with CSS or extending their return delay does not satisfy component removal. After the fix, wait at least five seconds, spin and stop, and wait again: no insects should appear. The shared export never included the insect component.

## Challenge 2: one possible redesign

Suggested time: 30–45 minutes. This is a reference example, not the required appearance.

The example adds `facilitator-card` to both shared face containers in `ProfileCardFaces.tsx` and imports `web/src/styles/facilitator-card.css` there. The scoped stylesheet places the identity and details on the left, moves the portrait to the right in an asymmetric frame, and turns credentials into a bottom strip. The back replaces the large emblem with a brand header, Sui badge, and six partner tiles. Navy, teal, and warm gold provide the palette.

All profile values still come from the existing bindings. The original markup order is retained for reading and keyboard navigation; CSS grid changes visual placement. Both live and exported faces share these changes. The original canvas size, scale calculations, flip transforms, copy actions, explorer URLs, and 1080×1350 export studio are unchanged. The stylesheet uses fixed canvas typography so the same composition scales consistently on mobile and in exports.

Accept other layouts when they meet these requirements:

- Identity, profession, program, country, specialization, building-since value, focus, community, skills, and credentials remain readable.
- Loading, empty, error, success, and missing-photo states remain meaningful; no fabricated profile data is inserted.
- Flip, spin, copy, outbound links, and keyboard controls keep working.
- All six partner logos remain in the agreed order: CJC Race, Blockchain4Youth, Grantix, Kamiyon Studio, Blockchain4Her, Lbank Academy.
- The desktop and narrow-screen card fits its available space, and export stays 1080×1350 with both redesigned faces.
- The student can explain their layout changes and any tradeoffs. They need not reproduce this example.

## Verification

From the repository root:

```powershell
cd web
npm ci
npm run lint
npm run build
npm run dev
```

Run the install only when dependencies are missing. Then check desktop and narrow viewports, all four portfolio states, missing photo, flip, spin/stop, copy feedback, keyboard controls, partner order, and successful image export with configured or mocked success data. Export must remain disabled outside success. Wait five seconds before and after spin to confirm the insects are permanently gone.

These commands are the verification procedure, not a claim that every environment passes. No Move changes are needed for either challenge; on-chain writes remain CLI-only.
