import express from "express";
import {
  validateCreateTask,
  validateUpdateTask,
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

const findTaskById = (req, res, next) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  req.task = tasks[taskIndex];
  req.taskIndex = taskIndex;

  next();
};

taskRouter.get("/", (req, res) => {
  const { completed, search } = req.query;

  let filteredTasks = tasks;

  if (completed === "true") {
    filteredTasks = filteredTasks.filter((task) => task.completed === true);
  }

  if (completed === "false") {
    filteredTasks = filteredTasks.filter((task) => task.completed === false);
  }

  if (search) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );
  }
  res.json({ tasks: filteredTasks });
});

taskRouter.get("/:id", findTaskById, (req, res) => {
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

taskRouter.patch("/:id", findTaskById, validateUpdateTask, (req, res) => {
  const { title, completed } = req.body;

  if (title !== undefined) {
    req.task.title = title.trim();
  }
  if (completed !== undefined) {
    req.task.completed = completed;
  }

  res.json({ task: req.task });
});

taskRouter.delete("/:id", findTaskById, (req, res) => {
  tasks.splice(req.taskIndex, 1);

  res.status(204).send();
});

export default taskRouter;
