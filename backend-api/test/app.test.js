import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

test("GET /health returns API health information", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /json/);

  assert.deepEqual(response.body, {
    status: "ok",
    phase: 4,
    milestone: 102,
  });
});

test("GET /api/tasks returns a tasks array", async () => {
  const response = await request(app).get("/api/tasks");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /json/);
  assert.ok(Array.isArray(response.body.tasks));
  assert.ok(response.body.tasks.length > 0);
});

test("GET /api/tasks/:id returns the requested task", async () => {
  const response = await request(app).get("/api/tasks/1");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    task: { id: 1, title: "Learn HTTP basics", completed: false },
  });
});

test("GET /api/tasks/:id returns 404 when the task is missing", async () => {
  const response = await request(app).get("/api/tasks/999");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    error: "Task not found",
  });
});

test("an unknown endpoint returns a JSON 404 response", async () => {
  const response = await request(app).get("/api/unknown");

  assert.equal(response.status, 404);
  assert.match(response.headers["content-type"], /json/);

  assert.deepEqual(response.body, {
    error: "Route not found",
    method: "GET",
    path: "/api/unknown",
  });
});
