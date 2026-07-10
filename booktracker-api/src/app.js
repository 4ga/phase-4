import express from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import bookRouter from "./routes/bookRoutes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

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

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
