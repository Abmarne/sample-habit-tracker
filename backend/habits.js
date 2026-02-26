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
 * A habit can only be marked done once per calendar day.
 */
function markDone(id) {
  const habit = habits[id];
  if (!habit) {
    throw new Error("Habit not found");
  }

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Deduplicate: skip if already completed today
  const alreadyDone = habit.completions.some(
    (c) => c.slice(0, 10) === todayStr
  );
  if (alreadyDone) {
    return habit;
  }

  habit.completions.push(new Date().toISOString());
  habit.points += 10;
  habit.streak = calculateStreak(habit.completions);

  return habit;
}

/**
 * Calculate the current streak of consecutive days.
 * Dates are normalised to UTC calendar days to avoid timezone issues.
 */
function calculateStreak(completions) {
  if (completions.length === 0) return 0;

  // Normalise each completion to a UTC calendar day string "YYYY-MM-DD"
  const uniqueDays = [
    ...new Set(completions.map((c) => c.slice(0, 10))),
  ].sort((a, b) => (a > b ? -1 : 1)); // descending

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1] + "T00:00:00Z");
    const curr = new Date(uniqueDays[i] + "T00:00:00Z");
    const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
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
