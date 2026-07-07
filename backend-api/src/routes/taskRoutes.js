import express from "express";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
  validateTaskId,
} from "../middleware/taskValidation.js";

const taskRouter = express.Router();

const initialTasks = [
  { id: 1, title: "Learn HTTP basics", completed: false },
  { id: 2, title: "Practice Express routes", completed: false },
  {
    id: 3,
    title: "Connect backend concepts to frontend apps",
    completed: true,
  },
];

const createInitialTasks = () => initialTasks.map((task) => ({ ...task }));

const tasks = createInitialTasks();

const calculateNextTaskId = () =>
  tasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1;

let nextTaskId = calculateNextTaskId();

export const resetTasks = () => {
  tasks.splice(0, tasks.length, ...createInitialTasks());
  nextTaskId = calculateNextTaskId();
};

const compareTasks = (firstTask, secondTask, sortBy) => {
  if (sortBy === "id") {
    return firstTask.id - secondTask.id;
  }

  return firstTask.title.localeCompare(secondTask.title);
};

const findTaskById = (req, res, next) => {
  const taskIndex = tasks.findIndex((task) => task.id === req.taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  req.task = tasks[taskIndex];
  req.taskIndex = taskIndex;

  next();
};

taskRouter.get("/", validateTaskQuery, (req, res) => {
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
});

taskRouter.get("/:id", validateTaskId, findTaskById, (req, res) => {
  res.json({ task: req.task });
});

taskRouter.post("/", validateCreateTask, (req, res) => {
  const { title } = req.body;

  const newTask = {
    id: nextTaskId,
    title,
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(newTask);

  res.status(201).json({ task: newTask });
});

taskRouter.patch(
  "/:id",
  validateTaskId,
  findTaskById,
  validateUpdateTask,
  (req, res) => {
    const { title, completed } = req.body;

    if (title !== undefined) {
      req.task.title = title.trim();
    }
    if (completed !== undefined) {
      req.task.completed = completed;
    }

    res.json({ task: req.task });
  },
);

taskRouter.delete("/:id", validateTaskId, findTaskById, (req, res) => {
  tasks.splice(req.taskIndex, 1);

  res.status(204).send();
});

export default taskRouter;
