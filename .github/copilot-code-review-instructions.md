# PR Review Rules

When reviewing pull requests, enforce these rules strictly:

## Must Pass
- All existing tests must still pass
- Bug fixes must include new or updated tests
- No unused variables or dead code
- Functions should be small and focused (under 40 lines)
- API route changes must have matching frontend updates in frontend/app.js
- README.md must be updated if user-facing behavior changes
- No new dependencies without a clear justification in the PR description

## Check For
- Proper error handling (no silent failures)
- Input validation on API endpoints
- Consistent code style (const/let, async/await, no var)
- Edge cases (empty strings, null values, duplicate entries)

## Output Format
- Leave inline comments on specific lines where issues are found
- Provide a summary comment with PASS or REQUEST CHANGES
- If requesting changes, list each issue as an actionable item
