import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createTaskRecord,
  deleteTaskRecord,
  getAllTasks,
  getTaskById,
  resetTasks,
  updateTaskRecord,
} from "../src/data/taskStore.js";

beforeEach(() => {
  resetTasks();
});

test("getAllTasks return the initial task collection", () => {
  const tasks = getAllTasks();

  assert.equal(tasks.length, 3);

  assert.deepEqual(
    tasks.map((task) => task.id),
    [1, 2, 3],
  );
});

test("getAllTasks does not expose the store internal state", () => {
  const returnedTasks = getAllTasks();

  returnedTasks.pop();
  returnedTasks[0].title = `Change outside the store`;

  const storedTasks = getAllTasks();

  assert.equal(storedTasks.length, 3);
  assert.equal(storedTasks[0].title, "Learn HTTP basics");
});

test("getTaskById returns a copy of the requested task", () => {
  const returnedTask = getTaskById(1);

  assert.deepEqual(returnedTask, {
    id: 1,
    title: "Learn HTTP basics",
    completed: false,
  });

  returnedTask.title = "Changed outside the store";

  const storedTask = getTaskById(1);

  assert.equal(storedTask.title, "Learn HTTP basics");
});

test("getTaskById returns undefined when the task is missing", () => {
  const task = getTaskById(999);

  assert.equal(task, undefined);
});

test("createTaskRecord creates and stores a task", () => {
  const createdTask = createTaskRecord({
    title: "Test the task store",
  });

  assert.deepEqual(createdTask, {
    id: 4,
    title: "Test the task store",
    completed: false,
  });

  assert.deepEqual(getTaskById(4), createdTask);
});

test("createTaskRecord assigns increasing IDs", () => {
  const firstTask = createTaskRecord({
    title: "First created task",
  });

  const secondTask = createTaskRecord({
    title: "Second created task",
  });

  assert.equal(firstTask.id, 4);
  assert.equal(secondTask.id, 5);
});

test("updateTaskRecord updates and returns the requested task", () => {
  const updatedTask = updateTaskRecord(1, {
    title: "Updated through the store",
    completed: true,
  });

  assert.deepEqual(updatedTask, {
    id: 1,
    title: "Updated through the store",
    completed: true,
  });

  assert.deepEqual(getTaskById(1), updatedTask);

  assert.equal(
    updateTaskRecord(999, {
      completed: true,
    }),
    undefined,
  );
});

test("deleteTaskRecord reports whether deletion occurred", () => {
  assert.equal(deleteTaskRecord(2), true);
  assert.equal(getTaskById(2), undefined);

  assert.equal(deleteTaskRecord(2), false);

  assert.deepEqual(
    getAllTasks().map((task) => task.id),
    [1, 3],
  );
});

test("resetTasks restores records and ID generation", () => {
  deleteTaskRecord(2);

  createTaskRecord({
    title: "Temporary task",
  });

  createTaskRecord({
    title: "Another temporary task",
  });

  resetTasks();

  assert.deepEqual(
    getAllTasks().map((task) => task.id),
    [1, 2, 3],
  );

  const createdTask = createTaskRecord({
    title: "Created after reset",
  });

  assert.equal(createdTask.id, 4);
});
