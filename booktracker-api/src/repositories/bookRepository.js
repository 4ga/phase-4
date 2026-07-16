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

  return {
    getAllBooks: () => selectAllBooks.all().map(mapBookRow),
    getBookById: (bookId) => {
      const book = selectBookById.get(bookId);

      return book ? mapBookRow(book) : undefined;
    },
  };
};
