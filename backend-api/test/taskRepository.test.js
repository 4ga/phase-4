import test from "node:test";
import assert from "node:assert/strict";

import { createApplicationDatabase } from "../src/database/createApplicationDatabase.js";
import { createTaskRepository } from "../src/repositories/taskRepository.js";

test("getAllTasks returns all database tasks as application task objects", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const taskRepository = createTaskRepository(database);

    assert.deepEqual(taskRepository.getAllTasks(), [
      {
        id: 1,
        title: "Learn HTTP basics",
        completed: false,
      },
      {
        id: 2,
        title: "Practice Express routes",
        completed: false,
      },
      {
        id: 3,
        title: "Connect backend concepts to frontend apps",
        completed: true,
      },
    ]);
  } finally {
    database.close();
  }
});

test("getTaskById returns the requested database task", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const taskRepository = createTaskRepository(database);

    assert.deepEqual(taskRepository.getTaskById(3), {
      id: 3,
      title: "Connect backend concepts to frontend apps",
      completed: true,
    });
  } finally {
    database.close();
  }
});

test("getTaskById returns undefined when the task is missing", () => {
  const database = createApplicationDatabase(":memory:");

  try {
    const taskRepository = createTaskRepository(database);

    assert.equal(taskRepository.getTaskById(999), undefined);
  } finally {
    database.close();
  }
});
