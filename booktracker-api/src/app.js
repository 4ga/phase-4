import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  req.book = books[bookIndex];
  req.bookIndex = bookIndex;

  next();
};

app.get("/", (req, res) => {
  res.send("Welcome to the book tracker app!");
});

app.get("/health", (req, res) => {
  res.send({
    status: "ok",
    phase: 4,
    milestone: "Backend API implementation for the book tracker app",
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    app: "Phase 4 backend API",
    version: "1.0.0",
    phase: 4,
    message: "Backend API implementation for the book tracker app",
  });
});

app.get("/api/books", (req, res) => {
  const {
    searchTerm,
    genre,
    format,
    audience,
    availability,
    sortBy = "title-asc",
  } = req.query;
  let filteredBooks = [...books];

  if (searchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedSearchTerm) ||
        book.author.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }

  if (genre) {
    filteredBooks = filteredBooks.filter((book) => book.genre === genre);
  }

  if (format) {
    filteredBooks = filteredBooks.filter((book) => book.format === format);
  }

  if (audience) {
    filteredBooks = filteredBooks.filter((book) => book.audience === audience);
  }

  if (availability) {
    filteredBooks = filteredBooks.filter(
      (book) => book.availability === availability,
    );
  }

  const stripArticles = (str) => str.replace(/^(a |an |the )/i, "");

  let sortedBooks = [...filteredBooks];

  if (sortBy === "title-asc") {
    sortedBooks.sort((a, b) =>
      stripArticles(a.title).localeCompare(stripArticles(b.title)),
    );
  } else if (sortBy === "title-desc") {
    sortedBooks.sort((a, b) =>
      stripArticles(b.title).localeCompare(stripArticles(a.title)),
    );
  } else if (sortBy === "author-asc") {
    sortedBooks = [...filteredBooks].sort((a, b) =>
      a.author.localeCompare(b.author),
    );
  } else if (sortBy === "author-desc") {
    sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
  } else if (sortBy === "year-asc") {
    sortedBooks.sort(
      (a, b) => Number(a.publicationYear) - Number(b.publicationYear),
    );
  } else if (sortBy === "year-desc") {
    sortedBooks.sort(
      (a, b) => Number(b.publicationYear) - Number(a.publicationYear),
    );
  }

  res.json({ success: true, books: sortedBooks });
});

app.get("/api/books/:id", findBookById, (req, res) => {
  const { createdAt, updatedAt, ...bookWithoutTimestamps } = req.book;
  res.json({ success: true, book: bookWithoutTimestamps });
});

const BOOK_FIELDS = [
  "title",
  "author",
  "publicationYear",
  "format",
  "genre",
  "audience",
  "availability",
];

const TEXT_BOOK_FIELDS = [
  { field: "title", label: "Title" },
  { field: "author", label: "Author" },
  { field: "format", label: "Format" },
  { field: "genre", label: "Genre" },
  { field: "audience", label: "Audience" },
  { field: "availability", label: "Availability" },
];

const getTextFieldError = (value, label, partial) => {
  if (value === undefined) {
    return partial ? null : `${label} is required`;
  }

  if (value === null || value === "") {
    return `${label} is required`;
  }

  if (typeof value !== "string") {
    return `${label} must be a string`;
  }

  if (value.trim() === "") {
    return partial ? `${label} cannot be empty` : `${label} is required`;
  }
  return null;
};

const validateTextFields = (body, partial) => {
  for (const { field, label } of TEXT_BOOK_FIELDS) {
    const error = getTextFieldError(body[field], label, partial);

    if (error) {
      return error;
    }
  }
  return null;
};

const validatePublicationYear = (publicationYear, partial) => {
  if (publicationYear === undefined) {
    return partial ? null : "Publication year is required";
  }

  if (
    publicationYear === "" ||
    publicationYear === null ||
    Number.isNaN(Number(publicationYear))
  ) {
    return "Publication yeaer must be a number";
  }

  return null;
};

const hasBookField = (body) => {
  return BOOK_FIELDS.some((field) => body[field] !== undefined);
};

const validateBook = (body, { partial = false } = {}) => {
  if (partial && !hasBookField(body)) {
    return "At least one field is required";
  }

  const textFieldError = validateTextFields(body, partial);
  if (textFieldError) {
    return textFieldError;
  }

  return validatePublicationYear(body.publicationYear, partial);
};

app.post("/api/books", (req, res) => {
  const validationError = validateBook(req.body);

  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

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
    title: title.trim(),
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

  res.status(201).json({ success: true, book: bookWithoutTimestamps });
});

app.patch("/api/books/:id", findBookById, (req, res) => {
  const validationError = validateBook(req.body, { partial: true });

  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  books[req.bookIndex] = {
    ...books[req.bookIndex],
    ...req.body,
    publicationYear:
      req.body.publicationYear === undefined
        ? books[req.bookIndex].publicationYear
        : Number(req.body.publicationYear),
    updatedAt: Date.now(),
  };

  const { createdAt, updatedAt, ...bookWithoutTimestamps } =
    books[req.bookIndex];

  return res.json({ success: true, book: bookWithoutTimestamps });
});

app.delete("/api/books/:id", findBookById, (req, res) => {
  books.splice(req.bookIndex, 1);

  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headerSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
