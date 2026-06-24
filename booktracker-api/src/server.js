import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const books = [
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

app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.json({ success: false, message: "Book not found." });
  }

  res.json({ success: true, message: book });
});

app.post("/api/books", (req, res) => {
  const {
    title,
    author,
    publicationYear,
    format,
    genre,
    audience,
    availability,
  } = req.body;

  if (!title || title.trim() == "") {
    return res.status(404).json({ error: "Book not found." });
  }

  const newBook = {
    id: books.length + 1,
    title: title.trim(),
    author,
    publicationYear,
    format,
    genre,
    audience,
    availability,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  books.push(newBook);

  res.status(201).json({ book: newBook });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
