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
  const timestamp = Date.now();

  const newBook = {
    id: nextBookId,
    title,
    author,
    publicationYear,
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
  return cloneBook(bookWithoutTimestamps);
};

export const updateBookRecord = (bookId, updates) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return undefined;
  }
  books[bookIndex] = { ...books[bookIndex], ...updates };

  const { createdAt, updatedAt, ...bookWithoutTimestamps } = books[bookIndex];

  return cloneBook(bookWithoutTimestamps);
};

export const deleteTaskRecord = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return false;
  }

  books.splice(bookIndex, 1);

  return true;
};
