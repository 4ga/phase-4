export const initializeDatabase = (database) => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publicationYear INTEGER NOT NULL DEFAULT 1900,
      format TEXT NOT NULL,
      genre TEXT NOT NULL,
      audience TEXT NOT NULL,
      availability TEXT NOT NULL
    );
  `);
};
