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

  return {
    getAllBooks: () => selectAllBooks.all().map(mapBookRow),
  };
};
