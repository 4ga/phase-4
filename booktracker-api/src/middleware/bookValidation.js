const BOOK_FIELDS = [
  "title",
  "author",
  "publicationYear",
  "format",
  "genre",
  "audience",
  "availability",
];

const TEXT_BOOK_FIELDS = [
  { field: "title", label: "Title" },
  { field: "author", label: "Author" },
  { field: "format", label: "Format" },
  { field: "genre", label: "Genre" },
  { field: "audience", label: "Audience" },
  { field: "availability", label: "Availability" },
];

const QUERY_FILTERS = [
  { field: "searchTerm", label: "Search" },
  { field: "genre", label: "Genre" },
  { field: "format", label: "Format" },
  { field: "audience", label: "Audience" },
  { field: "availability", label: "Availability" },
  { field: "sortBy", label: "SortBy" },
];

const getQueryTypeError = (query) => {
  const invalidFilter = QUERY_FILTERS.find(({ field }) => {
    return query[field] !== undefined && typeof query[field] !== "string";
  });

  if (!invalidFilter) {
    return null;
  }

  return `${invalidFilter.label} filter must be a string`;
};

const normalizeTextValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/\s+/g, " ");
};

const normalizeBookBody = (req, res, next) => {
  const normalizedBody = { ...req.body };

  for (const { field } of TEXT_BOOK_FIELDS) {
    if (normalizedBody[field] !== undefined) {
      normalizedBody[field] = normalizeTextValue(normalizedBody[field]);
    }
  }

  req.body = normalizedBody;
  next();
};

const getTextFieldError = (value, label, partial) => {
  if (value === undefined) {
    return partial ? null : `${label} is required`;
  }

  if (typeof value !== "string") {
    return `${label} must be a string`;
  }

  if (value === "") {
    return partial ? `${label} cannot be empty` : `${label} is required`;
  }

  return null;
};

const validateTextFields = (body, partial) => {
  for (const { field, label } of TEXT_BOOK_FIELDS) {
    const error = getTextFieldError(body[field], label, partial);

    if (error) {
      return error;
    }
  }
  return null;
};

const validatePublicationYear = (publicationYear, partial) => {
  if (publicationYear === undefined) {
    return partial ? null : "Publication year is required";
  }

  if (
    publicationYear === "" ||
    publicationYear === null ||
    Number.isNaN(Number(publicationYear))
  ) {
    return "Publication yeaer must be a number";
  }

  return null;
};

const hasBookField = (body) => {
  return BOOK_FIELDS.some((field) => body[field] !== undefined);
};

const validateBook = (body, { partial = false } = {}) => {
  if (partial && !hasBookField(body)) {
    return "At least one field is required";
  }

  const textFieldError = validateTextFields(body, partial);
  if (textFieldError) {
    return textFieldError;
  }

  return validatePublicationYear(body.publicationYear, partial);
};

const validateBookBody = ({ partial = false } = {}) => {
  return (req, res, next) => {
    const validationError = validateBook(req.body, { partial });

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    next();
  };
};

const normalizeQueryValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  return value.trim().replace(/\s+/g, " ").toLowerCase();
};

const validateSearchTerm = (searchTerm) => {
  if (searchTerm === undefined) {
    return null;
  }
  if (typeof searchTerm !== "string") {
    return "Search filter must be a string";
  }
  return null;
};

const validateAllowedQueryValue = (value, allowedValues, error) => {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== "string" || !allowedValues.includes(value)) {
    return error;
  }

  return null;
};

const validateBookQuery = (req, res, next) => {
  const queryTypeError = getQueryTypeError(req.query);

  if (queryTypeError) {
    return res.status(400).json({
      success: false,
      error: queryTypeError,
    });
  }

  const normalizedFilters = {
    searchTerm: normalizeQueryValue(req.query.searchTerm),
    genre: normalizeQueryValue(req.query.genre),
    format: normalizeQueryValue(req.query.format),
    audience: normalizeQueryValue(req.query.audience),
    availability: normalizeQueryValue(req.query.availability),
    sortBy: normalizeQueryValue(req.query.sortBy) || "title-asc",
  };

  const validations = [
    {
      value: normalizedFilters.genre,
      allowedValues: [
        "fiction",
        "sci-fi-fantasy",
        "mystery-thriller",
        "biography-history",
        "information-science",
        "childrens-picture-book",
      ],
      error: "Invalid genre filter",
    },
    {
      value: normalizedFilters.format,
      allowedValues: ["book", "e-book", "audiobook", "video"],
      error: "Invalid format filter",
    },
    {
      value: normalizedFilters.audience,
      allowedValues: ["adult", "young-adult", "children"],
      error: "Invalid audience filter",
    },
    {
      value: normalizedFilters.availability,
      allowedValues: ["available", "checked-out", "on-hold"],
      error: "Invalid availability filter",
    },
    {
      value: normalizedFilters.sortBy,
      allowedValues: [
        "title-asc",
        "title-desc",
        "author-asc",
        "author-desc",
        "year-asc",
        "year-desc",
      ],
      error: "Invalid sortBy filter",
    },
  ];

  for (const { value, allowedValues, error } of validations) {
    const validationError = validateAllowedQueryValue(
      value,
      allowedValues,
      error,
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }
  }

  req.bookFilters = normalizedFilters;
  next();
};

export { normalizeBookBody, validateBookBody, validateBookQuery };
