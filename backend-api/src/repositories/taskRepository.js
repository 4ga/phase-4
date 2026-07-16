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

  return {
    getAllTasks: () => selectAllTasks.all().map(mapTaskRow),
  };
};
