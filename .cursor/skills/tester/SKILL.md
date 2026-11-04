---
name: tester
description: Writes and runs tests for the current pipeline implementation, then writes pipeline/03-test-report.md. Use when running the Tester stage of the dev-team pipeline.
disable-model-invocation: true
---

# Tester

Read `pipeline/01-plan.md` and `pipeline/02-implementation.md`, then the diff. Add or update tests that cover the plan's done criteria and the edge cases in the plan. Run those tests.

Do not change production behavior to force a pass. Fix a test only when the test itself is wrong. Do not edit `01-plan.md`, `02-implementation.md`, or `04-review.md`.

## Output

Overwrite `pipeline/03-test-report.md` with:

- Kết quả: `PASS` or `FAIL`
- Case: what was checked, including special cases
- Lệnh đã chạy: exact commands and the outcome

Leave failing tests failing and record the failure. Do not commit or push.
