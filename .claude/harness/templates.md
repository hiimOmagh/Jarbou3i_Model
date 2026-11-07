# Delegate templates

Children get no parent history. Brief by file path, never paste file contents.
Return cap: 40 lines.

## Implementer
`delegate_task`: role implementation, isolation worktree,
target codex / gpt-6.1-sol, reasoningEffort medium (high for hard bugs).

```
ROLE: implementer. Do not commit, push, or open PRs. Work only in this worktree.
GOAL: <one sentence>
FILES IN SCOPE: <paths>   OUT OF SCOPE: everything else
READ FIRST: <paths>
CONSTRAINTS: <project rules, e.g. i18n AR/EN/FR, no new deps>
DONE WHEN: <command> exits 0 and <behavior>
RETURN (<=40 lines): changed files; `git diff` saved to a patch file;
  exact test command + last 15 lines of output; anything NOT verified.
```

## Verifier (read-only, different model from the implementer)
`delegate_task`: role review, isolation shared,
target codex / gpt-6-astra, reasoningEffort high.

```
ROLE: verifier. Do not edit. Try to falsify the claim.
CLAIM: <summary>   PATCH: <path>   CRITERIA: <numbered list>
Per criterion: evidence (command + output) and PASS / FAIL / UNVERIFIED.
Also check: unrequested changes, missing tests, other call sites of changed code.
RETURN (<=40 lines).
```

## Researcher (read-only)
`delegate_task`: role research, isolation shared, runtimeMode auto-accept-edits,
target antigravity / gemini-3.8-flash, thinking_level medium.

```
ROLE: researcher. Read-only except writing one findings file.
QUESTION: <one question>
ALREADY KNOWN: <memory/ADR paths>, do not repeat
RETURN (<=40 lines): findings, tradeoffs, one recommendation, risks, sources.
```

## Recovery
- Tests fail: re-brief with only the failure output, one retry.
- Second failure: stop; read it myself, raise effort once, or ask the user.
- Out-of-scope hunks: reject those hunks, never merge the whole patch.
- Stuck: `task_cancel` with a reason, start a new task.
- Provider unavailable: say so; never switch silently.
