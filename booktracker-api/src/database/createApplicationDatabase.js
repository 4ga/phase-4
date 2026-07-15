import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { openDatabase } from "./connection.js";
import { initializeDatabase } from "./initializeDatabase.js";
import { seedInitialBooks } from "./seedInitialBooks.js";

export const createApplicationDatabase = (databasePath) => {
  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const database = openDatabase(databasePath);

  try {
    initializeDatabase(database);
    seedInitialBooks(database);

    return database;
  } catch (error) {
    database.close();
    throw error;
  }
};
