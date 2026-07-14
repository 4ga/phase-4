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

test("tasks default completed to zero", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    database
      .prepare(`INSERT INTO tasks (title) VALUES (?)`)
      .run("Learn SQLite defaults");

    const task = database
      .prepare(`SELECT id, title, completed FROM tasks WHERE id = ?`)
      .get(1);

    assert.deepEqual(
      { ...task },
      {
        id: 1,
        title: "Learn SQLite defaults",
        completed: 0,
      },
    );
  } finally {
    database.close();
  }
});

test("tasks reject invalid completed values", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    const insertTask = database.prepare(`
      INSERT INTO tasks (title, completed)
      VALUES (?, ?)
    `);

    assert.throws(() => {
      insertTask.run("Invalid completed value", 2);
    });
  } finally {
    database.close();
  }
});

test("initializeDatabase can run repeatedly without deleting existing tasks", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);
    database
      .prepare(`INSERT INTO tasks (title) VALUES (?)`)
      .run("Keep this task");

    initializeDatabase(database);

    const task = database
      .prepare(`SELECT id, title, completed FROM tasks WHERE id = ?`)
      .get(1);

    assert.deepEqual(
      { ...task },
      { id: 1, title: "Keep this task", completed: 0 },
    );
  } finally {
    database.close();
  }
});
