const ALLOWED_COMPLETED_FILTERS = new Set(["true", "false"]);
const ALLOWED_SORT_FIELDS = ["id", "title"];
const ALLOWED_SORT_ORDERS = ["asc", "desc"];

const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  if (!POSITIVE_INTEGER_PATTERN.test(id)) {
    return res
      .status(400)
      .json({ error: "Task id must be a positive integer" });
  }
  req.taskId = Number(id);

  next();
};

const parsePositiveIntegerQuery = (value, fieldName) => {
  if (value === undefined) {
    return {
      value: undefined,
    };
  }

  if (typeof value !== "string") {
    return {
      error: `${fieldName} must be a positive integer`,
    };
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return {
      error: `${fieldName} must be a positive integer`,
    };
  }

  return {
    value: parsedValue,
  };
};

export const validateCreateTask = (req, res, next) => {
  const { title } = getRequestBody(req);

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
  const body = getRequestBody(req);
  const { title, completed } = body;

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

    body.title = trimmedTitle;
    req.body = body;
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Completed must be a boolean",
    });
  }

  next();
};

const parseCompletedFilter = (completed) => {
  if (completed === undefined) {
    return {
      value: undefined,
    };
  }

  if (
    typeof completed !== "string" ||
    !ALLOWED_COMPLETED_FILTERS.has(completed)
  ) {
    return {
      error: "Completed filter must be true or false",
    };
  }

  return {
    value: completed === "true",
  };
};

const normalizeOptionalString = (value, typeError) => {
  if (value === undefined) {
    return {
      value: undefined,
    };
  }

  if (typeof value !== "string") {
    return {
      error: typeError,
    };
  }

  return {
    value: value.trim().toLowerCase(),
  };
};

const getAllowedValueError = (value, allowedValues, errorMessage) => {
  if (value === undefined || allowedValues.includes(value)) {
    return undefined;
  }

  return errorMessage;
};

const sendBadRequest = (res, error) =>
  res.status(400).json({
    error,
  });

export const validateTaskQuery = (req, res, next) => {
  const { completed, search, sortBy, order, page, limit } = req.query;

  const completedResult = parseCompletedFilter(completed);
  const pageResult = parsePositiveIntegerQuery(page, "Page");
  const limitResult = parsePositiveIntegerQuery(limit, "Limit");

  if (pageResult.error) {
    return sendBadRequest(res, pageResult.error);
  }

  if (limitResult.error) {
    return sendBadRequest(res, limitResult.error);
  }

  if (limitResult.value > MAX_LIMIT) {
    return sendBadRequest(res, `Limit must be ${MAX_LIMIT} or less`);
  }

  if (completedResult.error) {
    return sendBadRequest(res, completedResult.error);
  }

  const searchResult = normalizeOptionalString(
    search,
    "Search filter must be a string",
  );

  if (searchResult.error) {
    return sendBadRequest(res, searchResult.error);
  }

  const sortByResult = normalizeOptionalString(
    sortBy,
    "Sort field must be a string",
  );

  if (sortByResult.error) {
    return sendBadRequest(res, sortByResult.error);
  }

  const orderResult = normalizeOptionalString(
    order,
    "Sort order must be a string",
  );

  if (orderResult.error) {
    return sendBadRequest(res, orderResult.error);
  }

  const sortFieldError = getAllowedValueError(
    sortByResult.value,
    ALLOWED_SORT_FIELDS,
    "Sort field must be id or title",
  );

  if (sortFieldError) {
    return sendBadRequest(res, sortFieldError);
  }

  const sortOrderError = getAllowedValueError(
    orderResult.value,
    ALLOWED_SORT_ORDERS,
    "Sort order must be asc or desc",
  );

  if (sortOrderError) {
    return sendBadRequest(res, sortOrderError);
  }

  if (orderResult.value !== undefined && sortByResult.value === undefined) {
    return sendBadRequest(
      res,
      "Sort field is required when sort order is provided",
    );
  }

  req.taskFilters = {
    completed: completedResult.value,
    search: searchResult.value || undefined,
    sortBy: sortByResult.value,
    order:
      sortByResult.value === undefined ? undefined : orderResult.value || "asc",
    page: pageResult.value ?? DEFAULT_PAGE,
    limit: limitResult.value ?? DEFAULT_LIMIT,
  };

  next();
};

const getRequestBody = (req) => {
  if (
    req.body === null ||
    req.body === undefined ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return {};
  }
  return req.body;
};
