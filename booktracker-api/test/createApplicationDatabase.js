import test from "node:test";
import assert from "node:assert/strict";

import { createApplicationDatabase } from "../src/database/createApplicationDatabase.js";

test("createApplicationDatabase opens and initializes a database", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const table = database
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'books'
      `,
      )
      .get();

    assert.deepEqual(
      { ...table },
      {
        name: "books",
      },
    );
  } finally {
    database.close();
  }
});
