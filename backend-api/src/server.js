import express from "express";

const app = express();
const PORT = 3000;

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
  res.json({
    tasks: [
      { id: 1, title: "Learn HTTP basics", completed: false },
      { id: 2, title: "Practice Express routes", completed: false },
      {
        id: 3,
        title: "Connect backend concepts to frontend apps",
        completed: false,
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
