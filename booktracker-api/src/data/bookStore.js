import { initialBooks } from "./initialBooks.js";

const cloneBook = (book) => ({ ...book });

const createInitialBooks = () => initialBooks.map(cloneBook);

let books = createInitialBooks();

const calculateNextBookId = () =>
  books.reduce((highestId, book) => Math.max(highestId, book.id), 0) + 1;

let nextBookId = calculateNextBookId();

export const resetBooks = () => {
  books = createInitialBooks();
  nextBookId = calculateNextBookId();
};

export const getAllBooks = () => books.map(cloneBook);

export const getBookById = (bookId) => {
  const book = books.find((currentBook) => currentBook.id === bookId);
  return book ? cloneBook(book) : undefined;
};

export const createBookRecord = ({
  title,
  author,
  publicationYear,
  format,
  genre,
  audience,
  availability,
}) => {
  const now = new Date();

  const newBook = {
    id: nextBookId,
    title,
    author,
    publicationYear,
    format,
    genre,
    audience,
    availability,
    createdAt: now,
    updatedAt: now,
  };

  nextBookId += 1;

  books.push(newBook);

  return cloneBook(newBook);
};

export const updateBookRecord = (bookId, updates) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return undefined;
  }
  books[bookIndex] = { ...books[bookIndex], ...updates, updatedAt: new Date() };

  return cloneBook(books[bookIndex]);
};

export const deleteBookRecord = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return false;
  }

  books.splice(bookIndex, 1);

  return true;
};
