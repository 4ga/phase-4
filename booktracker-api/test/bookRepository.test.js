import test from "node:test";
import assert from "node:assert/strict";

import { createApplicationDatabase } from "../src/database/createApplicationDatabase.js";
import { createBookRepository } from "../src/repositories/bookRepository.js";

test("getAllBooks returns all database books as application book objects", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const bookRepository = createBookRepository(database);

    assert.deepEqual(bookRepository.getAllBooks(), [
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
