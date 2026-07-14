import test from "node:test";
import assert from "node:assert/strict";

import { openDatabase } from "../src/database/connection.js";
import { initializeDatabase } from "../src/database/initializeDatabase.js";
import { seedInitialTasks } from "../src/database/seedInitialTasks.js";

test("seedInitialTasks inserts the starter tasks", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);
    seedInitialTasks(database);

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

test("seedInitialTasks can run repeatedly without duplicating tasks", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    seedInitialTasks(database);
    seedInitialTasks(database);

    const { taskCount } = database
      .prepare(
        `
        SELECT COUNT(*) AS taskCount
        FROM tasks
      `,
      )
      .get();

    assert.equal(taskCount, 3);
  } finally {
    database.close();
  }
});

test("seedInitialTasks preserves a non-empty tasks table", () => {
  const database = openDatabase(":memory:");

  try {
    initializeDatabase(database);

    database
      .prepare(
        `
        INSERT INTO tasks (title, completed)
        VALUES (?, ?)
      `,
      )
      .run("Existing database task", 1);

    seedInitialTasks(database);

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
        title: "Existing database task",
        completed: 1,
      },
    ]);
  } finally {
    database.close();
  }
});
