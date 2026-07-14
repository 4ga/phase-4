import test from "node:test";
import assert from "node:assert/strict";

import { openDatabase } from "../src/database/connection.js";
import { initializeDatabase } from "../src/database/initializeDatabase.js";

test("initializeDatabase creates the books table", () => {
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

test("initializeDatabase creates the expected books columns", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    const columns = database.prepare("PRAGMA table_info(books);").all();

    const columnDefinitions = columns.map(
      ({ name, type, notnull, dflt_value, pk }) => ({
        name,
        type,
        notnull,
        defaultValue: dflt_value,
        primaryKey: pk,
      }),
    );

    assert.deepEqual(columnDefinitions, [
      {
        name: "id",
        type: "INTEGER",
        notnull: 0,
        defaultValue: null,
        primaryKey: 1,
      },
      {
        name: "title",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
      {
        name: "author",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
      {
        name: "publicationYear",
        type: "INTEGER",
        notnull: 1,
        defaultValue: "1900",
        primaryKey: 0,
      },
      {
        name: "format",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
      {
        name: "genre",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
      {
        name: "audience",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
      {
        name: "availability",
        type: "TEXT",
        notnull: 1,
        defaultValue: null,
        primaryKey: 0,
      },
    ]);
  } finally {
    database.close();
  }
});
