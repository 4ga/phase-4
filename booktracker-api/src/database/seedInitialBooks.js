import { initialBooks } from "../data/initialBooks.js";

export const seedInitialBooks = (database) => {
  const insertTask = database.prepare(`
    INSERT INTO books (id, title, author, format, genre, audience, availability, publicationYear)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  database.exec("BEGIN;");

  try {
    for (const book of initialBooks) {
      insertTask.run(
        book.id,
        book.title,
        book.author,
        book.format,
        book.genre,
        book.audience,
        book.availability,
        book.publicationYear,
      );
    }

    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
};
