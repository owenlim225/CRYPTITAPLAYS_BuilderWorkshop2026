# University editions

Each university edition lives in this repository. An annotated tag freezes its committed source; development and facilitator branches can continue independently.

| Edition / purpose | Git reference | Notes |
| --- | --- | --- |
| COMMUNITY-1-BFCBINAN | Tag `COMMUNITY-1-BFCBINAN` | Preserved source at `725d201b9ac1ced4144d49d7b20ee45ca2bf6d7f`. |
| COMMUNITY-2-MMCL student starter | Branch `codex/archive-community-2-mmcl`; release tag `COMMUNITY-2-MMCL` | The archive branch preserves the final MMCL source from `main` before the next university edition. The tag preserves the original released starter; `codex/community-2-mmcl` retains its development history. |
| MMCL facilitator solutions | Branch `codex/community-2-mmcl-facilitator` | Contains bug removal and one example redesign. It is a teaching reference, not a private answer key. |
| Marinduque State University student starter | Branches `main` and `codex/marinduque-state-university` | Current edition with the same two unfinished frontend challenges and a new school seal and community partner lineup. |

See the [Marinduque State University student guide](marinduque-state-university.md) for setup, exercises, and completion criteria. The MMCL guide and validation record remain on the archive branch. The [README](../../README.md) remains the main guide for the existing Sui Mainnet CLI workflow.

## Recover the original edition

From a clone with access to the published tags:

```bash
git fetch origin --tags
git show --no-patch COMMUNITY-1-BFCBINAN
git worktree add --detach ../community-1-bfcbinan COMMUNITY-1-BFCBINAN
```

Choose an unused destination directory. This creates a separate checkout without switching your current working tree. To intentionally develop changes from the original edition instead, create a new branch from that tag. Do not move or overwrite an edition tag to contain later work; create a new release reference when needed.

Preservation covers **committed source and Git history only**. Tags do not preserve other ignored environment files, installed dependencies, hosting settings, a live website, Sui account keys, or off-repository assets. Follow the preserved edition's setup guide and provide the appropriate local configuration when rebuilding. Nothing about this source checkpoint deletes or modifies on-chain objects.

## MMCL delivery

The MMCL starter changes frontend partner branding and adds the two exercises. The contract and CLI workflow remain the existing ones. Participants may begin with an empty card and complete local frontend work without creating new on-chain objects. Successful data and export checks need an existing valid BuilderCard on the configured network.

Keep facilitator fixes on the facilitator branch; merging them into the student starter would remove the first exercise and pre-complete the second. The redesign solution illustrates an acceptable approach rather than setting a required visual style.
