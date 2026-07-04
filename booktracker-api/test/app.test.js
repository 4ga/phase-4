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
    milestone: "Backend API implementation for the book tracker app",
  });
});

test("GET /api/books", async () => {
  const response = await request(app).get("/api/books");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /json/);
  assert.ok(Array.isArray(response.body.books));
  assert.ok(response.body.books.length > 0);
});

test("GET /api/books/:id returns the requested book", async () => {
  const response = await request(app).get("/api/books/1");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    book: {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
      format: "book",
      genre: "fiction",
      audience: "adult",
      availability: "available",
    },
  });
});

test("GET /api/books/:id returns 404 when the book is missing", async () => {
  const response = await request(app).get("/api/books/999");

  assert.equal(response.status, 404);
  assert.match(response.headers["content-type"], /json/);
  assert.deepEqual(response.body, { success: false, error: "Book not found" });
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
