import express from "express";
import bookRouter from "./routes/bookRoutes.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the book tracker app!");
});

app.get("/health", (req, res) => {
  res.send({
    status: "ok",
    phase: 4,
    milestone: "Backend API implementation for the book tracker app",
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    app: "Phase 4 backend API",
    version: "1.0.0",
    phase: 4,
    message: "Backend API implementation for the book tracker app",
  });
});

app.use("/api/books", bookRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headerSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
