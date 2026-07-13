import test from "node:test";
import assert from "node:assert/strict";

import { openDatabase } from "../src/database/connection.js";
import { initializeDatabase } from "../src/database/initializeDatabase.js";

test("initializeDatabase creates the tasks table", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    const table = database
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'books'
      `,
      )
      .get();

    assert.ok(table);
    assert.equal(table.name, "books");
  } finally {
    database.close();
  }
});
