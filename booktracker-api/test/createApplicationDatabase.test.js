import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

test("createApplicationDatabase creates a file-backed database and its parent directory", () => {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), "backend-api-database-"),
  );

  const databasePath = join(temporaryDirectory, "nested", "books.sqlite");

  let database;

  try {
    database = createApplicationDatabase(databasePath);

    assert.equal(existsSync(databasePath), true);

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
    database?.close();

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
});
