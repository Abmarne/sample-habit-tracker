const API = "/api/habits";

const listEl = document.getElementById("habit-list");
const nameInput = document.getElementById("habit-name");
const addBtn = document.getElementById("add-btn");
const totalPointsEl = document.getElementById("total-points");

// ── Render ──────────────────────────────────────────────────────────────────

async function fetchAndRender() {
  const res = await fetch(API);
  const habits = await res.json();
  renderHabits(habits);
}

function renderHabits(habits) {
  listEl.innerHTML = "";

  let totalPoints = 0;

  habits.forEach((h) => {
    totalPoints += h.points;

    const li = document.createElement("li");
    li.className = "habit-item";
    li.innerHTML = `
      <div class="habit-info">
        <h3>${escapeHtml(h.name)}</h3>
        <div class="habit-meta">
          🔥 Streak: ${h.streak} day${h.streak !== 1 ? "s" : ""} &nbsp;|&nbsp;
          ⭐ Points: ${h.points}
        </div>
      </div>
    `;

    const btn = document.createElement("button");
    btn.className = "done-btn";
    btn.textContent = "Done ✓";

    // Disable button immediately to prevent double-click duplicate submissions
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await markDone(h.id);
      } catch (e) {
        btn.disabled = false;
      }
    });

    li.appendChild(btn);
    listEl.appendChild(li);
  });

  totalPointsEl.textContent = `Total Points: ${totalPoints}`;
}

// ── Actions ─────────────────────────────────────────────────────────────────

async function addHabit() {
  const name = nameInput.value.trim();
  if (!name) return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  nameInput.value = "";
  fetchAndRender();
}

async function markDone(id) {
  const res = await fetch(`${API}/${id}/done`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  fetchAndRender();
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Init ────────────────────────────────────────────────────────────────────

addBtn.addEventListener("click", addHabit);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addHabit();
});

fetchAndRender();
