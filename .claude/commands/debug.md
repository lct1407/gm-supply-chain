# Debug an issue

Debug the following issue: $ARGUMENTS

## Step 1: Reproduce
1. Understand the error message or unexpected behavior
2. Check relevant logs: `docker compose logs backend --tail 100`
3. If frontend issue: check browser console via chrome-devtools MCP
4. Search codebase for related code (Grep/Glob)

## Step 2: Trace
1. Trace the execution path from entry point to error
2. Check recent git changes: `git log --oneline -10` and `git diff HEAD~3`
3. If DB related: check schema and data
4. If API related: test endpoint with curl or httpx

## Step 3: Fix
1. Write a failing test that reproduces the bug (if possible)
2. Implement the fix — minimal changes only
3. Verify the test passes

## Step 4: Verify
1. Run related tests: `cd backend && pytest -v -k "<related>"`
2. Run full test suite if the fix touches shared code
3. Check for regressions
4. Use `/simplify` to clean up if needed
