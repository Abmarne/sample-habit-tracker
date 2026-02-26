# Copilot Instructions — sample-habit-tracker

## Project Overview
This is a minimal Node.js + Express habit tracker with a vanilla JS frontend and Jest tests.

## Project Structure
- `backend/habits.js` — Core logic (add, mark done, streaks, points)
- `backend/server.js` — Express API routes
- `frontend/index.html` — UI markup
- `frontend/app.js` — Client-side JS
- `tests/habits.test.js` — Jest test suite

## Rules
- Always include or update tests when fixing logic bugs
- Do not break existing tests — run `npm test` before finishing
- Keep functions small and readable
- Do not change API routes without updating `frontend/app.js`
- Do not add new dependencies without a clear reason
- Update README.md if user-facing behavior changes
- Use plain JavaScript — no TypeScript, no frameworks

## Testing
- Run tests with `npm test`
- Tests use Jest
- Test file: `tests/habits.test.js`
- Tests prefixed with `BUG:` are intentionally failing — your fix should make them pass

## Style
- Use `const`/`let`, never `var`
- Use async/await over raw promises
- Keep error messages user-friendly
