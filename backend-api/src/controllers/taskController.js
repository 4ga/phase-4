import {
  createTaskRecord,
  deleteTaskRecord,
  getAllTasks,
  getTaskById,
  updateTaskRecord,
} from "../data/taskStore.js";

const compareTasks = (firstTask, secondTask, sortBy) => {
  if (sortBy === "id") {
    return firstTask.id - secondTask.id;
  }

  return firstTask.title.localeCompare(secondTask.title);
};

export const findTaskById = (req, res, next) => {
  const task = getTaskById(req.taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  req.task = task;

  next();
};

export const listTasks = (req, res) => {
  const tasks = getAllTasks();
  const { completed, search, sortBy, order, page, limit } = req.taskFilters;

  let filteredTasks = tasks;

  if (completed !== undefined) {
    filteredTasks = filteredTasks.filter(
      (task) => task.completed === completed,
    );
  }

  if (search !== undefined) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(search),
    );
  }

  if (sortBy !== undefined) {
    const direction = order === "desc" ? -1 : 1;

    filteredTasks = [...filteredTasks].sort(
      (firstTask, secondTask) =>
        compareTasks(firstTask, secondTask, sortBy) * direction,
    );
  }

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

  res.json({
    tasks: paginatedTasks,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  });
};

export const getTask = (req, res) => {
  res.json({ task: req.task });
};

export const createTask = (req, res) => {
  const task = createTaskRecord({ title: req.body.title });

  res.status(201).json({ task });
};

export const updateTask = (req, res) => {
  const updates = {};

  if (req.body.title !== undefined) {
    updates.title = req.body.title;
  }
  if (req.body.completed !== undefined) {
    updates.completed = req.body.completed;
  }

  const task = updateTaskRecord(req.taskId, updates);

  res.json({ task });
};

export const deleteTask = (req, res) => {
  deleteTaskRecord(req.taskId);

  res.status(204).send();
};
