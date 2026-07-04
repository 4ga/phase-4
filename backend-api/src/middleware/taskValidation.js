export const validateCreateTask = (req, res, next) => {
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

  const trimmedTitle = title.trim();

  if (trimmedTitle === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  req.body.title = trimmedTitle;

  next();
};

export const validateUpdateTask = (req, res, next) => {
  const { title, completed } = req.body;

  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      error: "At least one field is required",
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({
        error: "Title must be a string",
      });
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      return res.status(400).json({
        error: "Title cannot be empty",
      });
    }

    req.body.title = trimmedTitle;
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Completed must be a boolean",
    });
  }

  next();
};
