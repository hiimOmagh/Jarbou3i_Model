# Multi-agent rules

Templates: `.claude/harness/templates.md`

1. Delegate only complex or project-wide work. Trivial and moderate work is done directly.
2. Children never commit, push, open PRs, or deploy. Output comes back as a patch; the user lands it.
3. The verifier is a different model run from the implementer.
4. Briefs use file paths, not pasted contents. Results are 40 lines or fewer.
5. Two tasks never touch the same file at once.
6. One retry per task, then ask the user.
