import express from "express";
import {
  normalizeBookBody,
  validateBookBody,
} from "../middleware/bookValidation.js";

const bookRouter = express.Router();

const initialBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    format: "book",
    genre: "fiction",
    audience: "adult",
    availability: "available",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    publicationYear: 2018,
    format: "audiobook",
    genre: "information-science",
    audience: "adult",
    availability: "checked-out",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publicationYear: 1937,
    format: "e-book",
    genre: "sci-fi-fantasy",
    audience: "young-adult",
    availability: "available",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 4,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    publicationYear: 2008,
    format: "book",
    genre: "sci-fi-fantasy",
    audience: "young-adult",
    availability: "on-hold",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 5,
    title: "I Know Why the Caged Bird Sings",
    author: "Maya Angelou",
    publicationYear: 1969,
    format: "book",
    genre: "biography-history",
    audience: "adult",
    availability: "on-hold",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 6,
    title: "The Cat in the Hat",
    author: "Dr. Seuss",
    publicationYear: 1957,
    format: "book",
    genre: "childrens-picture-book",
    audience: "children",
    availability: "available",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 7,
    title: "Gone Girl",
    author: "Gillian Flynn",
    publicationYear: 2012,
    format: "e-book",
    genre: "mystery-thriller",
    audience: "adult",
    availability: "available",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const createInitialBooks = () => initialBooks.map((book) => ({ ...book }));
const books = createInitialBooks();

const calculateNextBookId = () =>
  books.reduce((highestId, book) => Math.max(highestId, book.id), 0) + 1;

let nextBookId = calculateNextBookId();

export const resetBooks = () => {
  books.splice(0, books.length, ...createInitialBooks());
  nextBookId = calculateNextBookId();
};

const findBookById = (req, res, next) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  req.bookIndex = bookIndex;
  req.book = books[bookIndex];

  next();
};

const normalizeQueryValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  return value.trim().replace(/\s+/g, " ").toLowerCase();
};

bookRouter.get("/", (req, res) => {
  const {
    searchTerm,
    genre,
    format,
    audience,
    availability,
    sortBy = "title-asc",
  } = req.query;

  const normalizedSearchTerm = normalizeQueryValue(searchTerm);
  const normalizedGenre = normalizeQueryValue(genre);
  const normalizedFormat = normalizeQueryValue(format);
  const normalizedAudience = normalizeQueryValue(audience);
  const normalizedAvailability = normalizeQueryValue(availability);
  const normalizedSortBy = normalizeQueryValue(sortBy);

  let filteredBooks = [...books];

  if (normalizedSearchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedSearchTerm) ||
        book.author.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }

  if (normalizedGenre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre === normalizedGenre,
    );
  }

  if (normalizedFormat) {
    filteredBooks = filteredBooks.filter(
      (book) => book.format === normalizedFormat,
    );
  }

  if (normalizedAudience) {
    filteredBooks = filteredBooks.filter(
      (book) => book.audience === normalizedAudience,
    );
  }

  if (normalizedAvailability) {
    filteredBooks = filteredBooks.filter(
      (book) => book.availability === normalizedAvailability,
    );
  }

  const stripArticles = (str) => str.replace(/^(a |an |the )/i, "");

  let sortedBooks = [...filteredBooks];

  if (normalizedSortBy === "title-asc") {
    sortedBooks.sort((a, b) =>
      stripArticles(a.title).localeCompare(stripArticles(b.title)),
    );
  } else if (normalizedSortBy === "title-desc") {
    sortedBooks.sort((a, b) =>
      stripArticles(b.title).localeCompare(stripArticles(a.title)),
    );
  } else if (normalizedSortBy === "author-asc") {
    sortedBooks = [...filteredBooks].sort((a, b) =>
      a.author.localeCompare(b.author),
    );
  } else if (normalizedSortBy === "author-desc") {
    sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
  } else if (normalizedSortBy === "year-asc") {
    sortedBooks.sort(
      (a, b) => Number(a.publicationYear) - Number(b.publicationYear),
    );
  } else if (normalizedSortBy === "year-desc") {
    sortedBooks.sort(
      (a, b) => Number(b.publicationYear) - Number(a.publicationYear),
    );
  }

  res.json({ success: true, books: sortedBooks });
});

bookRouter.get("/:id", findBookById, (req, res) => {
  const { createdAt, updatedAt, ...bookWithoutTimestamps } = req.book;
  res.json({ success: true, book: bookWithoutTimestamps });
});

bookRouter.post("/", normalizeBookBody, validateBookBody(), (req, res) => {
  const {
    title,
    author,
    publicationYear,
    format,
    genre,
    audience,
    availability,
  } = req.body;

  const timestamp = Date.now();

  const newBook = {
    id: nextBookId,
    title,
    author,
    publicationYear: Number(publicationYear),
    format,
    genre,
    audience,
    availability,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  nextBookId += 1;
  books.push(newBook);

  const { createdAt, updatedAt, ...bookWithoutTimestamps } = newBook;

  res.status(201).json({ success: true, book: bookWithoutTimestamps });
});

bookRouter.patch(
  "/:id",
  findBookById,
  normalizeBookBody,
  validateBookBody({ partial: true }),
  (req, res) => {
    const updates = { ...req.body };

    if (updates.publicationYear !== undefined) {
      updates.publicationYear = Number(updates.publicationYear);
    }

    books[req.bookIndex] = {
      ...books[req.bookIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    const { createdAt, updatedAt, ...bookWithoutTimestamps } =
      books[req.bookIndex];

    return res.json({ success: true, book: bookWithoutTimestamps });
  },
);

bookRouter.delete("/:id", findBookById, (req, res) => {
  books.splice(req.bookIndex, 1);

  res.status(204).send();
});

export default bookRouter;
