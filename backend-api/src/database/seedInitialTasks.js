import { initialTasks } from "../data/initialTasks.js";

export const seedInitialTasks = (database) => {
  const insertTask = database.prepare(`
    INSERT INTO tasks (id, title, completed)
    VALUES (?, ?, ?)
  `);

  database.exec("BEGIN;");

  try {
    const { taskCount } = database
      .prepare(`SELECT COUNT(*) AS taskCount FROM tasks`)
      .get();

    if (taskCount === 0) {
      for (const task of initialTasks) {
        insertTask.run(task.id, task.title, task.completed ? 1 : 0);
      }
    }

    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
};
