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
        WHERE type = 'table' AND name = 'tasks'
      `,
      )
      .get();

    assert.ok(table);
    assert.equal(table.name, "tasks");
  } finally {
    database.close();
  }
});

test("initializeDatabase creates the expected tasks columns", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    const columns = database.prepare("PRAGMA table_info(tasks);").all();

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
        name: "completed",
        type: "INTEGER",
        notnull: 1,
        defaultValue: "0",
        primaryKey: 0,
      },
    ]);
  } finally {
    database.close();
  }
});