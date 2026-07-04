import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app, { resetTasks } from "../src/app.js";

beforeEach(() => {
  resetTasks();
});

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

test("POST /api/tasks creates a new task", async () => {
  const response = await request(app).post("/api/tasks").send({
    title: "Automate POST route tests",
  });

  assert.equal(response.status, 201);
  assert.match(response.headers["content-type"], /json/);

  assert.deepEqual(response.body, {
    task: {
      id: 4,
      title: "Automate POST route tests",
      completed: false,
    },
  });

  const getResponse = await request(app).get("/api/tasks/4");

  assert.equal(getResponse.status, 200);
  assert.deepEqual(getResponse.body, response.body);
});

test("POST /api/tasks trims the task title", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "    Trim this title   " });

  assert.equal(response.status, 201);

  assert.deepEqual(response.body, {
    task: { id: 4, title: "Trim this title", completed: false },
  });
});

test("POST /api/tasks returns 400 when title is missing", async () => {
  const response = await request(app).post("/api/tasks").send({});

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Title is required" });
});

test("POST /api/tasks returns 400 when title is blank", async () => {
  const response = await request(app).post("/api/tasks").send({ title: "   " });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, { error: "Title is required" });
});

test("POST /api/tasks return 400 when title is not a string", async () => {
  const response = await request(app).post("/api/tasks").send({ title: 123 });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Title must be a string" });
});

test("PATCH /api/tasks/:id updates the task title", async () => {
  const response = await request(app).patch("/api/tasks/1").send({
    title: "    Test PATCH title updates  ",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    task: { id: 1, title: "Test PATCH title updates", completed: false },
  });

  const getResponse = await request(app).get("/api/tasks/1");
  assert.equal(getResponse.status, 200);
  assert.deepEqual(getResponse.body, response.body);
});

test("PATCH /api/tasks/:id updates completed status", async () => {
  const response = await request(app)
    .patch("/api/tasks/1")
    .send({ completed: true });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    task: { id: 1, title: "Learn HTTP basics", completed: true },
  });
});

test("PATCH /api/tasks/:id updates title and completed together", async () => {
  const response = await request(app)
    .patch("/api/tasks/2")
    .send({ title: "Test multiple PATCH fields", completed: true });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    task: { id: 2, title: "Test multiple PATCH fields", completed: true },
  });
});

test("PATCH /api/tasks/:id returns 404 when the task is missing", async () => {
  const response = await request(app)
    .patch("/api/tasks/999")
    .send({ completed: true });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "Task not found" });
});

test("PATCH /api/tasks/:id returns 400 when title is blank", async () => {
  const response = await request(app)
    .patch("/api/tasks/1")
    .send({ title: "  " });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Title cannot be empty" });
});

test("PATCH /api/tasks/:id returns 400 when title is not a string", async () => {
  const response = await request(app)
    .patch("/api/tasks/1")
    .send({ title: 123 });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Title must be a string" });
});

test("PATCH /api/tasks/:id returns 400 when completed is not a boolean", async () => {
  const response = await request(app).patch("/api/tasks/1").send({
    completed: "true",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Completed must be a boolean",
  });
});

test("PATCH /api/tasks/:id returns 400 when no update fields are provided", async () => {
  const response = await request(app).patch("/api/tasks/1").send({});

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "At least one field is required",
  });
});
