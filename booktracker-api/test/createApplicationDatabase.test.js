import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createApplicationDatabase } from "../src/database/createApplicationDatabase.js";

test("createApplicationDatabase opens and initializes a database", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const table = database
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'books'
      `,
      )
      .get();

    assert.deepEqual(
      { ...table },
      {
        name: "books",
      },
    );
  } finally {
    database.close();
  }
});

test("createApplicationDatabase creates a file-backed database and its parent directory", () => {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), "backend-api-database-"),
  );

  const databasePath = join(temporaryDirectory, "nested", "books.sqlite");

  let database;

  try {
    database = createApplicationDatabase(databasePath);

    assert.equal(existsSync(databasePath), true);

    const table = database
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'books'
      `,
      )
      .get();

    assert.deepEqual(
      { ...table },
      {
        name: "books",
      },
    );
  } finally {
    database?.close();

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
});

test("createApplicationDatabase seeds a new database with starter books", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const books = database
      .prepare(
        `
        SELECT id, title, author, publicationYear, format, genre, audience, availability
        FROM books
        ORDER BY id
      `,
      )
      .all()
      .map((book) => ({ ...book }));

    assert.deepEqual(books, [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publicationYear: 1925,
        format: "hardcover",
        genre: "fiction",
        audience: "adult",
        availability: "available",
      },
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        publicationYear: 2018,
        format: "paperback",
        genre: "science",
        audience: "adult",
        availability: "checked-out",
      },
      {
        id: 3,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        publicationYear: 1937,
        format: "ebook",
        genre: "sci-fi",
        audience: "young-adult",
        availability: "available",
      },
      {
        id: 4,
        title: "The Hunger Games",
        author: "Suzanne Collins",
        publicationYear: 2008,
        format: "hardcover",
        genre: "sci-fi-fantasy",
        audience: "young-adult",
        availability: "library-use-only",
      },
      {
        id: 5,
        title: "I Know Why the Caged Bird Sings",
        author: "Maya Angelou",
        publicationYear: 1969,
        format: "paperback",
        genre: "biography",
        audience: "adult",
        availability: "library-use-only",
      },
      {
        id: 6,
        title: "The Cat in the Hat",
        author: "Dr. Seuss",
        publicationYear: 1957,
        format: "audiobook",
        genre: "fiction",
        audience: "children",
        availability: "available",
      },
      {
        id: 7,
        title: "Gone Girl",
        author: "Gillian Flynn",
        publicationYear: 2012,
        format: "ebook",
        genre: "mystery",
        audience: "adult",
        availability: "available",
      },
    ]);
  } finally {
    database.close();
  }
});

test("createApplicationDatabase preserves books when reopening an existing database", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "backend-api-reopen-"));

  const databasePath = join(temporaryDirectory, "books.sqlite");

  let database;

  try {
    database = createApplicationDatabase(databasePath);

    database
      .prepare(
        `
        UPDATE books
        SET title = ?
        WHERE id = ?
      `,
      )
      .run("Preserved database task", 1);

    database.close();
    database = undefined;

    database = createApplicationDatabase(databasePath);

    const books = database
      .prepare(
        `
        SELECT id, title, author, publicationYear, format, genre, audience, availability
        FROM books
        ORDER BY id
      `,
      )
      .all()
      .map((book) => ({ ...book }));

    assert.equal(books.length, 7);

    assert.deepEqual(books[0], {
      id: 1,
      title: "Preserved database task",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
      format: "hardcover",
      genre: "fiction",
      audience: "adult",
      availability: "available",
    });
  } finally {
    database?.close();

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
});
