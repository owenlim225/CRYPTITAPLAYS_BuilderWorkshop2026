# Agent guidance review

This is an editorial record, not additional coding policy. No existing AGENTS.md was present. Existing README, specifications, and code were preserved.

## Decisions confirmed by the user

| Topic | Conflicting alternatives | Accepted policy |
| --- | --- | --- |
| Tests | Comprehensive unit tests for every feature/fix versus proportionate automated tests | Proportionate tests based on changed behavior and risk |
| Architecture | Strict separation of all business logic from I/O versus separation where it provides value | Pragmatic boundaries; no interfaces, DTOs, factories, or layers solely to satisfy a pattern |
| Tooling | Mandatory automated formatting and pre-main CI versus the workshop's existing checks and no required additional CI | Keep existing tooling; scope new tooling separately |
| Git (clarification) | “Git tree per chat” and automatic commit/push needed an explicit operational interpretation | Dedicated worktree and branch per coding task; review and request final confirmation, then commit and push once approved; never automatically merge |

These choices are implemented in the linked topic guidance. Preserve the main checkout's branch and unrelated work; continue requested revisions in the same task worktree.

## Contradictions already resolved by repository guidance

At the initial review, the README explicitly gave current code and README precedence over older specs. Preserve current behavior for registry-assigned builder numbers, twelve string create arguments, local profile images, and GraphQL reads. Current Move code also creates Display metadata despite an older spec prohibiting it. The task's current base ignores `spec/`, so the agent guidance does not require those local files or link to them.

“Preserve existing instructions” and “keep the root minimal” are compatible here: no existing AGENTS.md needs moving, and existing project documents remain intact.

## Remove or replace from the supplied boilerplate

- Remove generic claims about consistency, quality, maintainability, and “write clean/readable code”; they add no checkable project constraint.
- Replace “small reusable modules” and “robust logging/standard metrics” with explicit boundary and diagnostic rules; avoid arbitrary module sizes or an unsolicited monitoring platform.
- Replace Jest/Pytest, ESLint/Black, and `npm run ... or equivalent` examples with verified project tooling and working directories.
- Remove the example 80% coverage number as a purported existing threshold; none is configured. Introducing one requires a separate decision and measurement setup.
- Keep dependencies in package manifests/lockfiles and external setup in README, rather than duplicating a full dependency inventory in AGENTS.md.
- Consolidate repeated architecture, code-style, build, and validation instructions into their linked topic files.
- Replace “there shouldn't be conflict” with isolation, synchronization, and conflict-resolution rules; no workflow can promise zero conflicts.
- Replace generic deployment-platform and database rules with this project's browser/GraphQL/Move boundaries; do not invent a server or database layer.

## Root essentials and folder structure

The root needs project purpose, global scope/source precedence, unusual command locations, and links selected by task. npm is the existing default and needs no special package-manager warning. A short isolation/approval rule belongs in the root because it applies before every coding task; the full workflow lives in Git guidance.

```text
AGENTS.md
docs/
  readme/                       # existing workshop screenshots
  agent-guidance-review.md      # editorial decisions; not coding policy
  agents/
    development.md              # AI-assisted development and boundaries
    frontend.md                 # React, styling, data presentation, export
    contracts-and-operations.md # Move, configuration, deployment
    verification.md             # checks and honest completion reporting
    git-workflow.md             # isolation, commits, integration
spec/                          # optional ignored local planning documents
```
