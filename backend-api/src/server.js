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
    id: tasks.length + 1,
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json({ task: newTask });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
