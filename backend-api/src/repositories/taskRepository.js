const mapTaskRow = ({ id, title, completed }) => ({
  id,
  title,
  completed: completed === 1,
});

export const createTaskRepository = (database) => {
  const selectAllTasks = database.prepare(`
    SELECT id, title, completed
    FROM tasks
    ORDER BY id
  `);

  const selectTaskById = database.prepare(`
    SELECT id, title, completed
    FROM tasks
    WHERE id = ?
  `);

  return {
    getAllTasks: () => selectAllTasks.all().map(mapTaskRow),

    getTaskById: (taskId) => {
      const task = selectTaskById.get(taskId);

      return task ? mapTaskRow(task) : undefined;
    },
  };
};
