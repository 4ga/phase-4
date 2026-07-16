const mapBookRow = ({
  id,
  title,
  author,
  format,
  genre,
  audience,
  availability,
  publicationYear,
}) => ({
  id,
  title,
  author,
  format,
  genre,
  audience,
  availability,
  publicationYear,
});

export const createBookRepository = (database) => {
  const selectAllBooks = database.prepare(`
    SELECT id, title, author, format, genre, audience, availability, publicationYear
    FROM books
    ORDER BY id
  `);

  const selectBookById = database.prepare(`
    SELECT id, title, author, format, genre, audience, availability, publicationYear
    FROM books
    WHERE id = ?
    `);

  const insertBook = database.prepare(`
    INSERT INTO books (title, author, format, genre, audience, availability, publicationYear)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING id, title, author, format, genre, audience, availability, publicationYear
    `);

  return {
    getAllBooks: () => selectAllBooks.all().map(mapBookRow),
    getBookById: (bookId) => {
      const book = selectBookById.get(bookId);

      return book ? mapBookRow(book) : undefined;
    },
    createBookRecord: ({
      title,
      author,
      format,
      genre,
      audience,
      availability,
      publicationYear,
    }) => {
      const book = insertBook.get(
        title,
        author,
        format,
        genre,
        audience,
        availability,
        publicationYear,
      );
      return mapBookRow(book);
    },
  };
};
