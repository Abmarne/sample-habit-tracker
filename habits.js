/**
 * Habit Tracker - Core Module
 *
 * Known issues for agent testing:
 * - BUG #1: markDone() does not prevent double-completion on the same day,
 *           so calling it twice awards points twice.
 * - BUG #2: Streak calculation uses bare Date() comparisons without
 *           normalising to UTC midnight, causing timezone-dependent failures.
 * - BUG #3: All data lives in a plain JS object (in-memory). Restarting the
 *           server loses everything.
 */

const habits = {}; // In-memory store — intentional limitation (BUG #3)
let nextId = 1;

function addHabit(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new Error("Habit name is required");
  }
  const id = String(nextId++);
  habits[id] = {
    id,
    name: name.trim(),
    completions: [],  // Array of ISO date strings
    points: 0,
    streak: 0,
  };
  return habits[id];
}

function getHabits() {
  return Object.values(habits);
}

function getHabit(id) {
  return habits[id] || null;
}

/**
 * Mark a habit as done for today.
 *
 * BUG #1: There is no guard against marking the same habit done more than
 * once on the same calendar day.  Every call pushes a new completion and
 * awards 10 points, so a rapid double-click in the UI will award 20 points.
 */
function markDone(id) {
  const habit = habits[id];
  if (!habit) {
    throw new Error("Habit not found");
  }

  const today = new Date().toISOString();

  // BUG #1 — no duplicate check; points are always awarded
  habit.completions.push(today);
  habit.points += 10;
  habit.streak = calculateStreak(habit.completions);

  return habit;
}

/**
 * Calculate the current streak of consecutive days.
 *
 * BUG #2: Dates are compared using the full ISO string (which includes the
 * time component) rather than normalising each date to UTC midnight.  This
 * means that a completion recorded at 23:59 UTC and one recorded at 00:01 UTC
 * the next day may be treated as the same calendar day *or* may be seen as
 * two days apart, depending on the runtime timezone offset.
 */
function calculateStreak(completions) {
  if (completions.length === 0) return 0;

  // Sort descending — newest first
  const sorted = [...completions].sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);

    // BUG #2 — raw diff without stripping time; timezone can skew this
    const diffMs = prev - curr;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays >= 0.8 && diffDays <= 1.2) {
      streak++;
    } else if (diffDays < 0.8) {
      // Same day — continue (but this heuristic is fragile)
      continue;
    } else {
      break;
    }
  }

  return streak;
}

function resetAll() {
  for (const key of Object.keys(habits)) {
    delete habits[key];
  }
  nextId = 1;
}

module.exports = {
  addHabit,
  getHabits,
  getHabit,
  markDone,
  calculateStreak,
  resetAll,
};
