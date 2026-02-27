const request = require("supertest");
const app = require("../backend/server");
const { addHabit, resetAll } = require("../backend/habits");

beforeEach(() => {
  resetAll();
});

describe("DELETE /api/habits/:id", () => {
  test("deletes a habit and returns 204", async () => {
    const h = addHabit("Run");
    
    const res = await request(app).delete(`/api/habits/${h.id}`);
    
    expect(res.status).toBe(204);
  });

  test("returns 404 for unknown habit", async () => {
    const res = await request(app).delete("/api/habits/999");
    
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Habit not found");
  });

  test("deleted habit no longer appears in list", async () => {
    const h = addHabit("Read");
    addHabit("Run");
    
    await request(app).delete(`/api/habits/${h.id}`);
    
    const habits = await request(app).get("/api/habits");
    expect(habits.body).toHaveLength(1);
    expect(habits.body[0].name).toBe("Run");
  });
});
