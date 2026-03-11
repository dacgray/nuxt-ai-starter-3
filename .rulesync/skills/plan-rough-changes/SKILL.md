---
name: plan-rough-changes
description: Produces a rough plan outline by invoking the rough-changes-planner agent, which writes a single rough-goals.md in .plan/YYYY-MM-DD/<slug>/. Presents the outline to the user for review. Use before plan-changes to align on goal, scope, and strategy.
targets:
  - '*'
---

# Skill: Plan Rough Changes

This skill produces a high-level plan outline to align the team on goal, scope, rough strategy, and broad acceptance criteria before detailed task planning begins. It does not write implementation tasks and does not produce anything executable.

## Usage

```
/plan-rough-changes <change description>
```

Example: `/plan-rough-changes "Add user profile settings page"`

---

## Phase 1 — Invoke Rough Changes Planner

Invoke the **rough-changes-planner** agent, passing:

- The change description

The rough-changes-planner will derive its own slug, analyse the codebase at a high level, and write `.plan/YYYY-MM-DD/<slug>/rough-goals.md`.

---

## Phase 2 — User Review

Once the agent completes, present the outline to the user. Show:

1. The goal and scope from `rough-goals.md`
2. The rough strategy
3. The broad acceptance criteria

Ask explicitly:

1. Is the goal statement accurate?
2. Is the scope correct? Anything to add or remove?
3. Does the rough strategy reflect the right approach?
4. Are the acceptance criteria broad enough to cover the intent without over-specifying?
5. Any open questions or risks that should be noted?

**Do not proceed further.** If the user approves, tell them to run `/plan-changes <slug>` (using the slug the agent reported) to produce a detailed implementation plan.

If the user requests changes, update `rough-goals.md` and re-present the affected sections.
