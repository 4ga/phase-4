import express from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

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

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
