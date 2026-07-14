import test from "node:test";
import assert from "node:assert/strict";

import { openDatabase } from "../src/database/connection.js";
import { initializeDatabase } from "../src/database/initializeDatabase.js";
import { seedInitialBooks } from "../src/database/seedInitialBooks.js";

test("seedInitialTasks inserts the starter books", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);
    seedInitialBooks(database);

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
