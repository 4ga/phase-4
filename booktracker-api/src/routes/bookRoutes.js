import express from "express";
import {
  normalizeBookBody,
  validateBookBody,
  validateBookQuery,
  validateBookId,
} from "../middleware/bookValidation.js";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
  findBookById,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/", validateBookQuery, listBooks);

bookRouter.get("/:id", validateBookId, findBookById, getBook);

bookRouter.post("/", normalizeBookBody, validateBookBody(), createBook);

bookRouter.patch(
  "/:id",
  validateBookId,
  findBookById,
  normalizeBookBody,
  validateBookBody({ partial: true }),
  updateBook,
);

bookRouter.delete("/:id", validateBookId, findBookById, deleteBook);

export default bookRouter;
