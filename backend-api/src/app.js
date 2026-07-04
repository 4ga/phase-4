import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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

app.get("/", (req, res) => {
  res.send("Phase 4 Backend API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", phase: 4, milestone: 102 });
});

app.get("/api/info", (req, res) => {
  res.json({
    app: "Phase 4 Backend API",
    version: "1.0.0",
    phase: 4,
    milestone: 103,
    message: "Learning HTTP request and response fundamentals",
  });
});

app.get("/api/tasks", (req, res) => {
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

app.get("/api/tasks/:id", findTaskById, (req, res) => {
  res.json({ task: req.task });
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (title === undefined || title === null) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  if (typeof title !== "string") {
    return res.status(400).json({
      error: "Title must be a string",
    });
  }

  if (title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: nextTaskId,
    title: title.trim(),
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(newTask);

  res.status(201).json({ task: newTask });
});

app.patch("/api/tasks/:id", findTaskById, (req, res) => {
  const { title, completed } = req.body;

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({ error: "Title must be a string" });
  }

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({
      error: "Title cannot be empty",
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean" });
  }

  if (title === undefined && completed === undefined) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  if (title !== undefined) {
    req.task.title = title.trim();
  }
  if (completed !== undefined) {
    req.task.completed = completed;
  }

  res.json({ task: req.task });
});

app.delete("/api/tasks/:id", findTaskById, (req, res) => {
  tasks.splice(req.taskIndex, 1);

  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON body",
    });
  }

  res.status(500).json({ error: "Internal server error" });
});

export default app;
