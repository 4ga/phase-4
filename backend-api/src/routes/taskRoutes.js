import express from "express";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
  validateTaskId,
} from "../middleware/taskValidation.js";
import {
  getTask,
  listTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", validateTaskQuery, listTasks);

taskRouter.get("/:id", validateTaskId, findTaskById, getTask);

taskRouter.post("/", validateCreateTask, createTask);

taskRouter.patch(
  "/:id",
  validateTaskId,
  findTaskById,
  validateUpdateTask,
  updateTask,
);

taskRouter.delete("/:id", validateTaskId, findTaskById, deleteTask);

export default taskRouter;
