import express from "express";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

const shouldLogRequests = () => process.env.NODE_ENV !== "test";

app.use((req, res, next) => {
  if (shouldLogRequests()) {
    console.log(`${req.method} ${req.originalUrl}`);
  }

  next();
});

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

app.use("/api/tasks", taskRouter);

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
