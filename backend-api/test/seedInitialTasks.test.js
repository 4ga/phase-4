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
