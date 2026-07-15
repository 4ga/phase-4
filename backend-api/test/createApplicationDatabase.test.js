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
        WHERE type = 'table' AND name = 'tasks'
      `,
      )
      .get();

    assert.deepEqual(
      { ...table },
      {
        name: "tasks",
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

  const databasePath = join(temporaryDirectory, "nested", "tasks.sqlite");

  let database;

  try {
    database = createApplicationDatabase(databasePath);

    assert.equal(existsSync(databasePath), true);

    const table = database
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'tasks'
      `,
      )
      .get();

    assert.deepEqual(
      { ...table },
      {
        name: "tasks",
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

test("createApplicationDatabase seeds a new database with starter tasks", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const tasks = database
      .prepare(
        `
        SELECT id, title, completed
        FROM tasks
        ORDER BY id
      `,
      )
      .all()
      .map((task) => ({ ...task }));

    assert.deepEqual(tasks, [
      {
        id: 1,
        title: "Learn HTTP basics",
        completed: 0,
      },
      {
        id: 2,
        title: "Practice Express routes",
        completed: 0,
      },
      {
        id: 3,
        title: "Connect backend concepts to frontend apps",
        completed: 1,
      },
    ]);
  } finally {
    database.close();
  }
});

test("createApplicationDatabase preserves tasks when reopening an existing database", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "backend-api-reopen-"));

  const databasePath = join(temporaryDirectory, "tasks.sqlite");

  let database;

  try {
    database = createApplicationDatabase(databasePath);

    database
      .prepare(
        `
        UPDATE tasks
        SET title = ?
        WHERE id = ?
      `,
      )
      .run("Preserved database task", 1);

    database.close();
    database = undefined;

    database = createApplicationDatabase(databasePath);

    const tasks = database
      .prepare(
        `
        SELECT id, title, completed
        FROM tasks
        ORDER BY id
      `,
      )
      .all()
      .map((task) => ({ ...task }));

    assert.equal(tasks.length, 3);

    assert.deepEqual(tasks[0], {
      id: 1,
      title: "Preserved database task",
      completed: 0,
    });
  } finally {
    database?.close();

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
});
