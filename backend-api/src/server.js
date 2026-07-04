import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: "Learn HTTP basics", completed: false },
  { id: 2, title: "Practice Express routes", completed: false },
  {
    id: 3,
    title: "Connect backend concepts to frontend apps",
    completed: true,
  },
];

let nextTaskId =
  tasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1;

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

app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json({ task });
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
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

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
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
    task.title = title.trim();
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json({ task });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
