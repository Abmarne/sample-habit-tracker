const express = require("express");
const cors = require("cors");
const path = require("path");
const { addHabit, getHabits, getHabit, markDone, deleteHabit } = require("./habits");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ── API Routes ──────────────────────────────────────────────────────────────

// List all habits
app.get("/api/habits", (_req, res) => {
  res.json(getHabits());
});

// Get a single habit
app.get("/api/habits/:id", (req, res) => {
  const habit = getHabit(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  res.json(habit);
});

// Create a new habit
app.post("/api/habits", (req, res) => {
  try {
    const habit = addHabit(req.body.name);
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark a habit as done for today
app.post("/api/habits/:id/done", (req, res) => {
  try {
    const habit = markDone(req.params.id);
    res.json(habit);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Delete a habit
app.delete("/api/habits/:id", (req, res) => {
  const deleted = deleteHabit(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Habit not found" });
  }
  res.status(204).send();
});

// ── Start ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Habit Tracker running at http://localhost:${PORT}`);
  });
}

module.exports = app; // export for testing
