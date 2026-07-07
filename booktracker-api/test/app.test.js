import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import { resetBooks } from "../src/routes/bookRoutes.js";

beforeEach(() => {
  resetBooks();
});

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

test("POST /api/books creates a new book", async () => {
  const response = await request(app).post("/api/books").send({
    title: "The JavaScript Journey",
    author: "Jane Coder",
    publicationYear: 2025,
    format: "e-book",
    genre: "Information & Science",
    audience: "adult",
    availability: "available",
  });

  assert.equal(response.status, 201);
  assert.match(response.headers["content-type"], /json/);
  assert.deepEqual(response.body, {
    success: true,
    book: {
      id: 8,
      title: "The JavaScript Journey",
      author: "Jane Coder",
      publicationYear: 2025,
      format: "e-book",
      genre: "Information & Science",
      audience: "adult",
      availability: "available",
    },
  });

  const getResponse = await request(app).get("/api/books/8");

  assert.equal(getResponse.status, 200);
  assert.deepEqual(getResponse.body, response.body);
});

test("POST /api/books trims the book title", async () => {
  const response = await request(app).post("/api/books").send({
    title: "       The JavaScript Journey       ",
    author: "Jane Coder",
    publicationYear: 2025,
    format: "e-book",
    genre: "Information & Science",
    audience: "adult",
    availability: "available",
  });

  assert.equal(response.status, 201);
  assert.match(response.headers["content-type"], /json/);
  assert.deepEqual(response.body, {
    success: true,
    book: {
      id: 8,
      title: "The JavaScript Journey",
      author: "Jane Coder",
      publicationYear: 2025,
      format: "e-book",
      genre: "Information & Science",
      audience: "adult",
      availability: "available",
    },
  });

  const getResponse = await request(app).get("/api/books/8");

  assert.equal(getResponse.status, 200);
  assert.deepEqual(getResponse.body, response.body);
});

test("POST /api/books returns 400 when title is missing", async () => {
  const response = await request(app).post("/api/books").send({
    author: "Jane Coder",
    publicationYear: 2025,
    format: "e-book",
    genre: "Information & Science",
    audience: "adult",
    availability: "available",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    error: "Title is required",
  });
});

test("POST /api/books returns 400 when title is blank", async () => {
  const response = await request(app).post("/api/books").send({
    title: "   ",
    author: "Jane Coder",
    publicationYear: 2025,
    format: "e-book",
    genre: "Information & Science",
    audience: "adult",
    availability: "available",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    error: "Title is required",
  });
});

test("POST /api/books returns 400 when title is not a string", async () => {
  const response = await request(app).post("/api/books").send({
    title: 123,
    author: "Jane Coder",
    publicationYear: 2025,
    format: "e-book",
    genre: "Information & Science",
    audience: "adult",
    availability: "available",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    error: "Title must be a string",
  });
});

test("PATCH /api/books/:id updates the task title", async () => {
  const response = await request(app)
    .patch("/api/books/1")
    .send({ title: "    The Great Gatsby & Friends  " });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    book: {
      id: 1,
      title: "The Great Gatsby & Friends",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
      format: "book",
      genre: "fiction",
      audience: "adult",
      availability: "available",
    },
  });

  const getResponse = await request(app).get("/api/books/1");

  assert.equal(getResponse.status, 200);
  assert.deepEqual(getResponse.body, response.body);
});

test("PATCH /api/books/:id updates availability status", async () => {
  const response = await request(app)
    .patch("/api/books/1")
    .send({ availability: "Checked Out" });

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
      availability: "Checked Out",
    },
  });
});

test("PATCH /api/books/:id updates title and availability together", async () => {
  const response = await request(app).patch("/api/books/1").send({
    title: "The Great Gatsby & Friends ",
    availability: "Checked Out",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    book: {
      id: 1,
      title: "The Great Gatsby & Friends",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
      format: "book",
      genre: "fiction",
      audience: "adult",
      availability: "Checked Out",
    },
  });
});

test("PATCH /api/books/:id returns 404 when the book is missing", async () => {
  const response = await request(app)
    .patch("/api/books/999")
    .send({ title: "The Great Gatsby & Friends" });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { success: false, error: "Book not found" });
});

test("PATCH /api/books/:id returns 400 when title is blank", async () => {
  const response = await request(app)
    .patch("/api/books/1")
    .send({ title: "  " });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    error: "Title cannot be empty",
  });
});

test("PATCH /api/books/:id returns 400 when title is not a string", async () => {
  const response = await request(app)
    .patch("/api/books/1")
    .send({ title: 123 });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    error: "Title must be a string",
  });
});

test("PATCH /api/books/:id returns 400 when no update fields are provided", async () => {
  const response = await request(app).patch("/api/books/1").send({});

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "At least one field is required",
  });
});

test("DELETE /api/books/:id returns 204 with no resppnse body", async () => {
  const response = await request(app).delete("/api/books/2");

  assert.equal(response.status, 204);
  assert.equal(response.text, "");
});

test("DELETE /api/books/:id removes the requested book", async () => {
  const deleteResponse = await request(app).delete("/api/books/2");

  assert.equal(deleteResponse.status, 204);

  const deletedTaskResponse = await request(app).get("/api/books/2");

  assert.equal(deletedTaskResponse.status, 404);
  assert.deepEqual(deletedTaskResponse.body, {
    success: false,
    error: "Book not found",
  });

  const remainingTaskResponse = await request(app).get("/api/books/1");

  assert.equal(remainingTaskResponse.status, 200);
  assert.equal(remainingTaskResponse.body.book.id, 1);
});

test("DELETE /api/books/:id removes the book from the collection", async () => {
  const deleteResponse = await request(app).delete("/api/books/2");

  assert.equal(deleteResponse.status, 204);

  const collectionResponse = await request(app).get("/api/books");

  assert.equal(collectionResponse.status, 200);
  assert.equal(collectionResponse.body.books.length, 6);

  assert.equal(
    collectionResponse.body.books.some((task) => task.id === 2),
    false,
  );
});

test("DELETE /api/books/:id returns 404 when the book is missing", async () => {
  const response = await request(app).delete("/api/books/999");

  assert.equal(response.status, 404);

  assert.deepEqual(response.body, {
    success: false,
    error: "Book not found",
  });
});

test("GET /api/books filters available books", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "available",
    sortBy: "title-asc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [6, 7, 1, 3],
  );

  assert.ok(
    response.body.books.every((book) => book.availability === "available"),
  );
});

test("GET /api/books filters checked out books", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "checked-out",
    sortBy: "title-asc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [2],
  );

  assert.ok(
    response.body.books.every((book) => book.availability === "checked-out"),
  );
});

test("GET /api/books filters available books without case sensitivity", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "AVAILABLE",
    sortBy: "title-asc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [6, 7, 1, 3],
  );

  assert.ok(
    response.body.books.every((book) => book.availability === "available"),
  );
});

test("GET /api/books combines availability and search filters", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "available",
    searchTerm: "great",
    sortBy: "title-asc",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [1],
  );
});

test("GET /api/books filtering does not modify the book collection", async () => {
  const filteredResponse = await request(app)
    .get("/api/books")
    .query({ availability: "checked-out", sortBy: "title-asc" });

  assert.equal(filteredResponse.status, 200);
  assert.equal(filteredResponse.body.books.length, 1);

  const collectionResponse = await request(app).get("/api/books");

  assert.equal(collectionResponse.status, 200);

  assert.deepEqual(
    collectionResponse.body.books.map((book) => book.id),
    [2, 6, 7, 1, 3, 4, 5],
  );
});

test("GET /api/books returns 400 for an invalid availability filter", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "maybe",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Invalid availability filter",
  });
});

test("GET /api/books rejects multiple availability filter values", async () => {
  const response = await request(app).get(
    "/api/books?availability=available&availability=on-hold",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Availability filter must be a string",
  });
});

test("GET /api/books trims and normalizes the search filter", async () => {
  const response = await request(app).get("/api/books").query({
    searchTerm: "   GREAT   ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [1],
  );
});

test("GET /api/books rejects multiple search filter values", async () => {
  const response = await request(app).get(
    "/api/books?searchTerm=http&searchTerm=express",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Search filter must be a string",
  });
});

test("GET /api/books treats a blank search as no search filter", async () => {
  const response = await request(app).get("/api/books").query({
    searchTerm: "   ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [2, 6, 7, 1, 3, 4, 5],
  );
});

test("GET /api/books rejects an invalid sort field", async () => {
  const response = await request(app).get("/api/books").query({
    sortBy: "id",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Invalid sortBy filter",
  });
});

test("GET /api/books rejects multiple search filter values", async () => {
  const response = await request(app).get(
    "/api/books?sortBy=http&sortBy=express",
  );

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "SortBy filter must be a string",
  });
});

test("GET /api/books sorting does not modify task collection order", async () => {
  const sortedResponse = await request(app).get("/api/books").query({
    sortBy: "title-desc",
  });

  assert.equal(sortedResponse.status, 200);

  const collectionResponse = await request(app).get("/api/books");

  assert.equal(collectionResponse.status, 200);

  assert.deepEqual(
    collectionResponse.body.books.map((book) => book.id),
    [2, 6, 7, 1, 3, 4, 5],
  );
});

test("GET /api/books returns default pagination metadata", async () => {
  const response = await request(app).get("/api/books");

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [2, 6, 7, 1, 3, 4, 5],
  );

  assert.deepEqual(response.body.pagination, {
    page: 1,
    limit: 10,
    totalItems: 7,
    totalPages: 1,
  });
});

test("GET /api/books returns the first requested page", async () => {
  const response = await request(app).get("/api/books").query({
    page: "1",
    limit: "2",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [2, 6],
  );

  assert.deepEqual(response.body.pagination, {
    page: 1,
    limit: 2,
    totalItems: 7,
    totalPages: 4,
  });
});

test("GET /api/books returns the second requested page", async () => {
  const response = await request(app).get("/api/books").query({
    page: "2",
    limit: "2",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [7, 1],
  );

  assert.deepEqual(response.body.pagination, {
    page: 2,
    limit: 2,
    totalItems: 7,
    totalPages: 4,
  });
});

test("GET /api/books applies filtering and sorting before pagination", async () => {
  const response = await request(app).get("/api/books").query({
    availability: "available",
    sortBy: "title-asc",
    page: "2",
    limit: "1",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(
    response.body.books.map((book) => book.id),
    [7],
  );

  assert.deepEqual(response.body.pagination, {
    page: 2,
    limit: 1,
    totalItems: 4,
    totalPages: 4,
  });
});

test("GET /api/books paginates books", async () => {
  const response = await request(app).get("/api/books").query({
    page: "2",
    limit: "3",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.books.length, 3);

  assert.deepEqual(response.body.pagination, {
    page: 2,
    limit: 3,
    totalItems: 7,
    totalPages: 3,
  });
});

test("GET /api/books returns an empty array for a page beyond the result", async () => {
  const response = await request(app).get("/api/books").query({
    page: "5",
    limit: "2",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.books, []);

  assert.deepEqual(response.body.pagination, {
    page: 5,
    limit: 2,
    totalItems: 7,
    totalPages: 4,
  });
});

test("GET /api/books rejects an invalid page", async () => {
  const response = await request(app).get("/api/books").query({
    page: "0",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Page must be a positive integer",
  });
});

test("GET /api/books rejects multiple page filter values", async () => {
  const response = await request(app).get("/api/books?page=2&page=3");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Page filter must be a string",
  });
});

test("GET /api/books rejects multiple limit filter values", async () => {
  const response = await request(app).get("/api/books?limit=2&limit=3");

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Limit filter must be a string",
  });
});

test("GET /api/books rejects an invalid limit", async () => {
  const response = await request(app).get("/api/books").query({
    limit: "0",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Limit must be a positive integer",
  });
});

test("GET /api/books rejects a limit above the maximum", async () => {
  const response = await request(app).get("/api/books").query({
    limit: "101",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    error: "Limit cannot exceed 100",
  });
});
