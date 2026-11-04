---
name: dev-team
description: Runs the billing dev-team pipeline in order — Planner, Coder, Tester, then read-only Reviewer — using pipeline/request.md. Use when the user asks to run the dev team, the pipeline, or the nightly backlog.
---

# Dev team

Run four subagents one after another in this repo. Do not start the next until the previous one has finished and its pipeline file is no longer the stub. Do not edit application source yourself; the Coder and Tester do that.

Use only model `grok-4.7-high` for every stage. Spawn each agent with the Task tool, `subagent_type` `generalPurpose`. The prompt must tell the agent to read and follow its skill file exactly, and include the repo path.

## Nightly backlog

When this run is the nightly job, or the user asked to take the next backlog item:

1. If `gh pr list --state open --json headRefName` shows a branch starting with `agent/`, stop. Do not open another PR.
2. Open `pipeline/backlog.md`. Copy the first section whose line is `status: todo` into `pipeline/request.md` under `## Yêu cầu`. If none, stop.
3. After the gate below, set that section to `status: done` when the PR merges, or `status: blocked` plus one sentence when the run stops.

## Stages

1. Planner — model `grok-4.7-high` — skill `.cursor/skills/planner/SKILL.md` — done when `pipeline/01-plan.md` has Phạm vi, File, Bước, Rủi ro, and Done khi.
2. Coder — model `grok-4.7-high` — skill `.cursor/skills/coder/SKILL.md` — done when `pipeline/02-implementation.md` lists what changed.
3. Tester — model `grok-4.7-high` — skill `.cursor/skills/tester/SKILL.md` — done when `pipeline/03-test-report.md` says `PASS` or `FAIL`.
4. Reviewer — model `grok-4.7-high` — skill `.cursor/skills/reviewer/SKILL.md` — the prompt must say the agent may only write `pipeline/04-review.md`. Done when Verdict is `APPROVE` or `CHANGES`.

## Gate

Read `pipeline/03-test-report.md` and `pipeline/04-review.md`.

Stop with no branch, no push, and no merge when the test result is not `PASS` or the verdict is not `APPROVE`. On a nightly run, mark the backlog item `blocked` and include the reason. Tell the user the verdict and the four pipeline paths.

When both are good:

1. Create branch `agent/<slug>` from `main`. Slug is a few words from the request.
2. Commit only the files for this feature plus the pipeline files this run changed. No secrets. No `--no-verify`, no amend, no force.
3. `git push -u origin HEAD`
4. `gh pr create` against `main` with a short summary and the verdict.
5. `gh pr merge --merge` that PR. Do not force-push `main`.

Then tell the user the PR URL. Production updates only if Vercel deploys `main`.
