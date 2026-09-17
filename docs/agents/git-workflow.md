# Git workflow

## Isolate each task

- Before editing, inspect status, the current branch, and existing worktrees. Preserve unrelated changes, including staged work in the main checkout.
- Create or reuse a dedicated worktree and task-specific branch for each coding task. Use `codex/<task-name>` for new branches unless the user specifies another name; never reuse another task's branch or worktree.
- Perform all implementation in that task worktree. Never switch the branch of the user's main local working directory.
- Never commit, push, merge, reset, or otherwise modify unrelated branches. Worktree isolation allows concurrent agents but cannot guarantee conflict-free integration.

## Review and request publication

- Run the appropriate [checks](verification.md), then review the complete task diff, including new files, for scope and accidental changes.
- When implementation and checks are complete, report that the task is ready, summarize what changed and why briefly, and state actual validation results and any limitations.
- Provide the proposed commit message, exact task branch to push, and remote. Ask for final confirmation to commit and push; do not perform either action before that approval.
- If the user rejects the result or requests changes, continue in the same task worktree and branch, rerun affected checks, and repeat the completion review.

## After approval

- Treat “yes,” “proceed,” or equivalent approval of the proposed commit/push as authorization for both actions. Do not ask for additional Git confirmation for those approved actions.
- Review and stage only the completed task's explicit paths, commit using the proposed message, and push that exact task branch to the stated remote, setting its upstream when needed.
- Use a descriptive imperative commit message, such as `docs: add progressive agent guidance`. Never include unrelated work.
- If publication fails, report the actual state and blocker. Do not force-push, overwrite remote work, or claim a successful push. If the commit succeeded, retry only the pending push after resolving its cause.
- Report the commit hash and pushed branch after success. Never automatically merge into main, dev, or another integration branch; merging requires an explicit request.
- If later integration conflicts with another task, report the conflict rather than modifying another agent's branch without authorization.
