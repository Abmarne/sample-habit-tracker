# 🏆 Habit Tracker Demo

A minimal full-stack habit tracker built for **testing AI engineering agents**. The app contains several **intentional bugs** so you can practice agent workflows like triaging issues, opening PRs, and reviewing code.

## Quick Start

```bash
npm install
npm start          # → http://localhost:3000
npm test           # run Jest test suite
```

## Features

| Feature | Status |
|---------|--------|
| Add a habit | ✅ Working |
| Mark a habit done | ⚠️ Buggy — double-click awards points twice |
| See streak count | ⚠️ Buggy — timezone edge cases |
| Earn points | ✅ Working (but affected by double-done bug) |
| Persistent storage | ❌ In-memory only — data lost on restart |

## Project Structure

```
habit-tracker-demo/
├── backend/
│   ├── server.js        # Express server + API routes
│   └── habits.js        # Core logic (bugs live here)
├── frontend/
│   ├── index.html       # UI
│   └── app.js           # Client-side JS (no debounce on Done btn)
├── tests/
│   └── habits.test.js   # Jest tests — some fail by design
├── package.json
└── README.md
```

## Intentional Bugs

### Bug #1 — Double-Done Awards Points Twice
**File:** `backend/habits.js` → `markDone()`, `frontend/app.js`
`markDone()` has no duplicate check for the same calendar day. The frontend Done button has no debounce or disable-on-click. Rapidly clicking "Done" fires multiple requests and awards 10 points each time.

### Bug #2 — Streak Calculation Timezone Issue
**File:** `backend/habits.js` → `calculateStreak()`
Streak logic compares raw ISO timestamps instead of normalising dates to UTC midnight. Completions near midnight (e.g. 23:59 vs 00:01 the next day) may be counted as the same day, breaking the streak count.

### Bug #3 — In-Memory Data Store
**File:** `backend/habits.js`
All data is stored in a plain JS object. Restarting the server wipes everything. There is no file or database persistence.

## Test Suite

```bash
npm test
```

Tests are labelled with `BUG:` prefix when they document an intentional failure. Out of the box you should see **2 failing tests** that correspond to Bug #1 and Bug #2.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/habits` | List all habits |
| `GET` | `/api/habits/:id` | Get one habit |
| `POST` | `/api/habits` | Create habit (`{ "name": "..." }`) |
| `POST` | `/api/habits/:id/done` | Mark habit done for today |

## License

MIT
