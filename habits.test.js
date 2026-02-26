const {
  addHabit,
  getHabits,
  getHabit,
  markDone,
  calculateStreak,
  resetAll,
} = require("../backend/habits");

beforeEach(() => {
  resetAll();
});

// ─── addHabit ───────────────────────────────────────────────────────────────

describe("addHabit", () => {
  test("creates a habit with correct defaults", () => {
    const h = addHabit("Meditate");
    expect(h).toMatchObject({
      name: "Meditate",
      completions: [],
      points: 0,
      streak: 0,
    });
    expect(h.id).toBeDefined();
  });

  test("trims whitespace from name", () => {
    const h = addHabit("  Run  ");
    expect(h.name).toBe("Run");
  });

  test("throws on empty name", () => {
    expect(() => addHabit("")).toThrow("Habit name is required");
    expect(() => addHabit("   ")).toThrow("Habit name is required");
  });
});

// ─── getHabits / getHabit ───────────────────────────────────────────────────

describe("getHabits / getHabit", () => {
  test("returns all habits", () => {
    addHabit("A");
    addHabit("B");
    expect(getHabits()).toHaveLength(2);
  });

  test("returns null for unknown id", () => {
    expect(getHabit("999")).toBeNull();
  });
});

// ─── markDone ───────────────────────────────────────────────────────────────

describe("markDone", () => {
  test("awards 10 points on completion", () => {
    const h = addHabit("Read");
    const updated = markDone(h.id);
    expect(updated.points).toBe(10);
    expect(updated.completions).toHaveLength(1);
  });

  test("throws for unknown habit", () => {
    expect(() => markDone("999")).toThrow("Habit not found");
  });

  /**
   * BUG #1 — This test EXPOSES the double-done bug.
   * Calling markDone twice on the same day should NOT award points twice,
   * but the current implementation does.  The test is written to document
   * the *expected correct* behaviour so it will FAIL until the bug is fixed.
   */
  test("BUG: should not award points twice for same day", () => {
    const h = addHabit("Exercise");
    markDone(h.id);
    markDone(h.id); // second call same day
    // Expected: still 10 points (deduplicated)
    // Actual:   20 points (bug)
    expect(h.points).toBe(10);
  });
});

// ─── calculateStreak ────────────────────────────────────────────────────────

describe("calculateStreak", () => {
  test("returns 0 for no completions", () => {
    expect(calculateStreak([])).toBe(0);
  });

  test("returns 1 for a single completion", () => {
    expect(calculateStreak([new Date().toISOString()])).toBe(1);
  });

  test("calculates consecutive days", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);

    // Using noon times to reduce timezone flakiness
    const completions = [
      dayBefore.toISOString(),
      yesterday.toISOString(),
      today.toISOString(),
    ];

    expect(calculateStreak(completions)).toBe(3);
  });

  /**
   * BUG #2 — This test EXPOSES the timezone / date-normalisation bug.
   * Completions near midnight can produce incorrect streak values because
   * the code compares raw timestamps instead of calendar dates.
   */
  test("BUG: streak should handle completions near midnight correctly", () => {
    // Day 1 at 23:59 UTC, Day 2 at 00:01 UTC — should be a 2-day streak
    const day1 = "2025-01-15T23:59:00.000Z";
    const day2 = "2025-01-16T00:01:00.000Z";

    const streak = calculateStreak([day1, day2]);

    // The diff is ~2 minutes, which the buggy code treats as < 0.8 days
    // (i.e. "same day"), so it collapses the streak to 1 instead of 2.
    expect(streak).toBe(2);
  });
});

// ─── Data persistence (documents BUG #3) ────────────────────────────────────

describe("data persistence", () => {
  /**
   * BUG #3 — This test documents the in-memory limitation.
   * After resetAll() (simulating a server restart), all data is gone.
   */
  test("BUG: data is lost after reset (simulating server restart)", () => {
    addHabit("Journal");
    expect(getHabits()).toHaveLength(1);

    resetAll(); // simulate restart

    expect(getHabits()).toHaveLength(0);
  });
});
