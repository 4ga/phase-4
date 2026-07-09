import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createBookRecord,
  updateBookRecord,
  getAllBooks,
  getBookById,
  resetBooks,
  deleteBookRecord,
} from "../src/data/bookStore.js";

beforeEach(() => {
  resetBooks();
});

test("getAllBooks return the initial book collection", () => {
  const books = getAllBooks();

  assert.equal(books.length, 7);

  assert.deepEqual(
    books.map((book) => book.id),
    [1, 2, 3, 4, 5, 6, 7],
  );
});

test("getAllBooks does not expose the store internal state", () => {
  const returnedBooks = getAllBooks();

  returnedBooks.pop();
  returnedBooks[0].title = "Changed outside the store";

  const storedBooks = getAllBooks();

  assert.equal(storedBooks.length, 7);
  assert.equal(storedBooks[0].title, "The Great Gatsby");
});

test("getBookById returns a copy of the requested book", () => {
  const returnedBook = getBookById(1);

  const { updatedAt, createdAt, ...returnedBookNoTimestamps } = returnedBook;

  assert.deepEqual(returnedBookNoTimestamps, {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });
  returnedBook.title = "Changed outside the store";

  const storedBook = getBookById(1);

  assert.equal(storedBook.title, "The Great Gatsby");
});

test("getBookById returns undefined when the book is missing", () => {
  const book = getBookById(999);

  assert.equal(book, undefined);
});

test("createBookRecord creates and stores a book", () => {
  const createdBook = createBookRecord({
    title: "Test the book store",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  assert.equal(createdBook.id, 8);
  assert.equal(createdBook.title, "Test the book store");
  assert.equal(createdBook.author, "Author Test");
  assert.equal(createdBook.publicationYear, 2020);
  assert.equal(createdBook.format, "book");
  assert.equal(createdBook.genre, "fiction");
  assert.equal(createdBook.audience, "adult");
  assert.equal(createdBook.availability, "available");

  assert.ok(createdBook.createdAt instanceof Date);
  assert.ok(createdBook.updatedAt instanceof Date);
  assert.deepEqual(createdBook.updatedAt, createdBook.createdAt);

  assert.deepEqual(getBookById(8), createdBook);
});

test("createBookRecord sets timestamps when the book is created", () => {
  const beforeCreate = new Date();

  const createdBook = createBookRecord({
    title: "Test the book store",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  const afterCreate = new Date();

  assert.ok(createdBook.createdAt instanceof Date);
  assert.ok(createdBook.updatedAt instanceof Date);

  assert.ok(createdBook.createdAt >= beforeCreate);
  assert.ok(createdBook.createdAt <= afterCreate);

  assert.deepEqual(createdBook.updatedAt, createdBook.createdAt);
});

test("craeteBookRecord assigns increasing IDs", () => {
  const firstBook = createBookRecord({
    title: "First created Book",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  const secondBook = createBookRecord({
    title: "Second created Book",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  assert.equal(firstBook.id, 8);
  assert.equal(secondBook.id, 9);
});

test("updateBookRecord updates and returns the requested book", () => {
  const updatedBook = updateBookRecord(1, {
    title: "The Greatest Gatsby",
  });

  assert.deepEqual(getBookById(1), updatedBook);

  assert.equal(updateBookRecord(999, { format: "e-book" }), undefined);
});

test("deleteBookRecord reports whether deletion occurred", () => {
  assert.equal(deleteBookRecord(2), true);
  assert.equal(getBookById(2), undefined);

  assert.equal(deleteBookRecord(2), false);

  assert.deepEqual(
    getAllBooks().map((book) => book.id),
    [1, 3, 4, 5, 6, 7],
  );
});

test("resetBooks restores records and ID generation", () => {
  deleteBookRecord(2);

  createBookRecord({
    title: "Test the book store",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  createBookRecord({
    title: "Another Test the book store",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  resetBooks();

  assert.deepEqual(
    getAllBooks().map((book) => book.id),
    [1, 2, 3, 4, 5, 6, 7],
  );

  const createdBook = createBookRecord({
    title: "Test the book store",
    author: "Author Test",
    publicationYear: 2020,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
  });

  assert.equal(createdBook.id, 8);
});
