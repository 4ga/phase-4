import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import { resetTasks } from "../src/data/taskStore.js";

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

test("DELETE /api/tasks/:id returns 204 with no resppnse body", async () => {
  const response = await request(app).delete("/api/tasks/2");

  assert.equal(response.status, 204);
  assert.equal(response.text, "");
});

test("DELETE /api/tasks/:id removes the requested task", async () => {
  const deleteResponse = await request(app).delete("/api/tasks/2");

  assert.equal(deleteResponse.status, 204);

  const deletedTaskResponse = await request(app).get("/api/tasks/2");

  assert.equal(deletedTaskResponse.status, 404);
  assert.deepEqual(deletedTaskResponse.body, {
    error: "Task not found",
  });

  const remainingTaskResponse = await request(app).get("/api/tasks/1");

  assert.equal(remainingTaskResponse.status, 200);
  assert.equal(remainingTaskResponse.body.task.id, 1);
});

test("DELETE /api/tasks/:id removes the task from the collection", async () => {
  const deleteResponse = await request(app).delete("/api/tasks/2");

  assert.equal(deleteResponse.status, 204);

  const collectionResponse = await request(app).get("/api/tasks");

  assert.equal(collectionResponse.status, 200);
  assert.equal(collectionResponse.body.tasks.length, 2);

  assert.equal(
    collectionResponse.body.tasks.some((task) => task.id === 2),
    false,
  );
});

test("DELETE /api/tasks/:id returns 404 when the task is missing", async () => {
  const response = await request(app).delete("/api/tasks/999");

  assert.equal(response.status, 404);

  assert.deepEqual(response.body, {
    error: "Task not found",
  });
});

test("GET /api/tasks filters completed tasks", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .query({ completed: "true" });

  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [3],
  );

  assert.ok(response.body.tasks.every((task) => task.completed === true));
});

test("GET /api/tasks filters incomplete tasks", async () => {
  const response = await request(app).get("/api/tasks").query({
    completed: "false",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [1, 2],
  );

  assert.ok(response.body.tasks.every((task) => task.completed === false));
});

test("GET /api/tasks searches titles without case sensitivity", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .query({ search: "EXPRESS" });

  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [2],
  );
  assert.equal(response.body.tasks[0].title, "Practice Express routes");
});

test("GET /api/tasks combines completed and search filters", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .query({ completed: "false", search: "express" });

  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [2],
  );
});

test("GET /api/tasks filtering does not modify the task collection", async () => {
  const filteredResponse = await request(app)
    .get("/api/tasks")
    .query({ completed: "true" });

  assert.equal(filteredResponse.status, 200);
  assert.equal(filteredResponse.body.tasks.length, 1);

  const collectionResponse = await request(app).get("/api/tasks");

  assert.equal(collectionResponse.status, 200);

  assert.deepEqual(
    collectionResponse.body.tasks.map((task) => task.id),
    [1, 2, 3],
  );
});

test("GET /api/tasks returns 400 for an invalid completed filter", async () => {
  const response = await request(app).get("/api/tasks").query({
    completed: "maybe",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Completed filter must be true or false",
  });
});

test("GET /api/tasks rejects multiple completed filter values", async () => {
  const response = await request(app).get(
    "/api/tasks?completed=true&completed=false",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Completed filter must be true or false",
  });
});

test("GET /api/tasks trims and normalizes the search filter", async () => {
  const response = await request(app).get("/api/tasks").query({
    search: "   EXPRESS   ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [2],
  );
});

test("GET /api/tasks rejects multiple search filter values", async () => {
  const response = await request(app).get(
    "/api/tasks?search=http&search=express",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Search filter must be a string",
  });
});

test("GET /api/tasks treats a blank search as no search filter", async () => {
  const response = await request(app).get("/api/tasks").query({
    search: "   ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [1, 2, 3],
  );
});

test("GET /api/tasks sorts titles in ascending order by default", async () => {
  const response = await request(app).get("/api/tasks").query({
    sortBy: "title",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [3, 1, 2],
  );
});

test("GET /api/tasks normalizes sorting values", async () => {
  const response = await request(app).get("/api/tasks").query({
    sortBy: "   TITLE   ",
    order: "   DESC   ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [2, 1, 3],
  );
});

test("GET /api/tasks sorts IDs in descending order", async () => {
  const response = await request(app).get("/api/tasks").query({
    sortBy: "id",
    order: "desc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [3, 2, 1],
  );
});

test("GET /api/tasks applies filters before sorting", async () => {
  const response = await request(app).get("/api/tasks").query({
    completed: "false",
    sortBy: "title",
    order: "desc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [2, 1],
  );
});

test("GET /api/tasks sorting does not modify task collection order", async () => {
  const sortedResponse = await request(app).get("/api/tasks").query({
    sortBy: "id",
    order: "desc",
  });

  assert.equal(sortedResponse.status, 200);

  const collectionResponse = await request(app).get("/api/tasks");

  assert.equal(collectionResponse.status, 200);

  assert.deepEqual(
    collectionResponse.body.tasks.map((task) => task.id),
    [1, 2, 3],
  );
});

test("GET /api/tasks rejects an invalid sort field", async () => {
  const response = await request(app).get("/api/tasks").query({
    sortBy: "createdAt",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Sort field must be id or title",
  });
});

test("GET /api/tasks rejects multiple sort field values", async () => {
  const response = await request(app).get("/api/tasks?sortBy=id&sortBy=title");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Sort field must be a string",
  });
});

test("GET /api/tasks rejects an invalid sort order", async () => {
  const response = await request(app).get("/api/tasks").query({
    sortBy: "id",
    order: "sideways",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Sort order must be asc or desc",
  });
});

test("GET /api/tasks rejects multiple sort order values", async () => {
  const response = await request(app).get(
    "/api/tasks?sortBy=id&order=asc&order=desc",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Sort order must be a string",
  });
});

test("GET /api/tasks rejects sort order without a sort field", async () => {
  const response = await request(app).get("/api/tasks").query({
    order: "desc",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Sort field is required when sort order is provided",
  });
});

test("GET /api/tasks returns default pagination metadata", async () => {
  const response = await request(app).get("/api/tasks");

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [1, 2, 3],
  );

  assert.deepEqual(response.body.pagination, {
    page: 1,
    limit: 10,
    totalItems: 3,
    totalPages: 1,
  });
});

test("GET /api/tasks returns the first requested page", async () => {
  const response = await request(app).get("/api/tasks").query({
    page: "1",
    limit: "2",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [1, 2],
  );

  assert.deepEqual(response.body.pagination, {
    page: 1,
    limit: 2,
    totalItems: 3,
    totalPages: 2,
  });
});

test("GET /api/tasks returns the second requested page", async () => {
  const response = await request(app).get("/api/tasks").query({
    page: "2",
    limit: "2",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [3],
  );

  assert.deepEqual(response.body.pagination, {
    page: 2,
    limit: 2,
    totalItems: 3,
    totalPages: 2,
  });
});

test("GET /api/tasks applies filtering and sorting before pagination", async () => {
  const response = await request(app).get("/api/tasks").query({
    completed: "false",
    sortBy: "title",
    order: "desc",
    page: "2",
    limit: "1",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.tasks.map((task) => task.id),
    [1],
  );

  assert.deepEqual(response.body.pagination, {
    page: 2,
    limit: 1,
    totalItems: 2,
    totalPages: 2,
  });
});

test("GET /api/tasks returns an empty array for a page beyond the result", async () => {
  const response = await request(app).get("/api/tasks").query({
    page: "5",
    limit: "2",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.tasks, []);

  assert.deepEqual(response.body.pagination, {
    page: 5,
    limit: 2,
    totalItems: 3,
    totalPages: 2,
  });
});

test("GET /api/tasks rejects an invalid page", async () => {
  const response = await request(app).get("/api/tasks").query({
    page: "0",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Page must be a positive integer",
  });
});

test("GET /api/tasks rejects multiple page values", async () => {
  const response = await request(app).get("/api/tasks?page=1&page=2");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Page must be a positive integer",
  });
});

test("GET /api/tasks rejects an invalid limit", async () => {
  const response = await request(app).get("/api/tasks").query({
    limit: "0",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Limit must be a positive integer",
  });
});

test("GET /api/tasks rejects multiple limit values", async () => {
  const response = await request(app).get("/api/tasks?limit=1&limit=2");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Limit must be a positive integer",
  });
});

test("GET /api/tasks rejects a limit above the maximum", async () => {
  const response = await request(app).get("/api/tasks").query({
    limit: "101",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Limit must be 100 or less",
  });
});

test("GET /api/tasks/:id returns 400 for a non-numeric task ID", async () => {
  const response = await request(app).get("/api/tasks/abc");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Task id must be a positive integer",
  });
});

test("GET /api/tasks/:id returns 400 for task ID zero", async () => {
  const response = await request(app).get("/api/tasks/0");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Task id must be a positive integer",
  });
});

test("PATCH /api/tasks/:id returns 400 for a decimal task ID", async () => {
  const response = await request(app).patch("/api/tasks/1.5").send({
    completed: true,
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Task id must be a positive integer",
  });
});

test("DELETE /api/tasks/:id returns 400 for a negative task ID", async () => {
  const response = await request(app).delete("/api/tasks/-1");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    error: "Task id must be a positive integer",
  });
});
