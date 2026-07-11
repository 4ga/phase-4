const timestamp = new Date("2026-07-04T12:00:00.000Z");

const initialBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    format: "hardcover",
    genre: "fiction",
    audience: "adult",
    availability: "available",
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
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
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

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
