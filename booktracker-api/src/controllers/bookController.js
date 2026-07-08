import {
  createBookRecord,
  deleteTaskRecord,
  getAllBooks,
  getBookById,
  updateBookRecord,
} from "../data/bookStore.js";

export const findBookById = (req, res, next) => {
  const book = getBookById(req.bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  req.book = book;

  next();
};

export const listBooks = (req, res) => {
  const books = getAllBooks();

  let filteredBooks = [...books];

  if (req.bookFilters.searchTerm) {
    filteredBooks = filteredBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(req.bookFilters.searchTerm) ||
        book.author.toLowerCase().includes(req.bookFilters.searchTerm)
      );
    });
  }

  if (req.bookFilters.genre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre === req.bookFilters.genre,
    );
  }

  if (req.bookFilters.format) {
    filteredBooks = filteredBooks.filter(
      (book) => book.format === req.bookFilters.format,
    );
  }

  if (req.bookFilters.audience) {
    filteredBooks = filteredBooks.filter(
      (book) => book.audience === req.bookFilters.audience,
    );
  }

  if (req.bookFilters.availability) {
    filteredBooks = filteredBooks.filter(
      (book) => book.availability === req.bookFilters.availability,
    );
  }

  const stripArticles = (str) => str.replace(/^(a |an |the )/i, "");

  let sortedBooks = [...filteredBooks];

  if (req.bookFilters.sortBy === "title-asc") {
    sortedBooks.sort((a, b) =>
      stripArticles(a.title).localeCompare(stripArticles(b.title)),
    );
  } else if (req.bookFilters.sortBy === "title-desc") {
    sortedBooks.sort((a, b) =>
      stripArticles(b.title).localeCompare(stripArticles(a.title)),
    );
  } else if (req.bookFilters.sortBy === "author-asc") {
    sortedBooks = [...filteredBooks].sort((a, b) =>
      a.author.localeCompare(b.author),
    );
  } else if (req.bookFilters.sortBy === "author-desc") {
    sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
  } else if (req.bookFilters.sortBy === "year-asc") {
    sortedBooks.sort(
      (a, b) => Number(a.publicationYear) - Number(b.publicationYear),
    );
  } else if (req.bookFilters.sortBy === "year-desc") {
    sortedBooks.sort(
      (a, b) => Number(b.publicationYear) - Number(a.publicationYear),
    );
  }

  const { page, limit } = req.bookFilters;

  const totalItems = sortedBooks.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;

  const paginatedBooks = sortedBooks.slice(startIndex, startIndex + limit);

  res.json({
    success: true,
    books: paginatedBooks,
    pagination: { page, limit, totalItems, totalPages },
  });
};

export const getBook = (req, res) => {
  const { createdAt, updatedAt, ...bookWithoutTimestamps } = req.book;
  res.json({ success: true, book: bookWithoutTimestamps });
};

export const createBook = (req, res) => {
  const book = createBookRecord({ ...req.body });

  res.status(201).json({ success: true, book });
};

export const updateBook = (req, res) => {
  const updates = { ...req.body };

  if (updates.publicationYear !== undefined) {
    updates.publicationYear = Number(updates.publicationYear);
  }

  updates.updatedAt = Date.now();

  const book = updateBookRecord(req.bookId, updates);

  return res.json({ success: true, book });
};

export const deleteBook = (req, res) => {
  deleteTaskRecord(req.bookId);

  res.status(204).send();
};
