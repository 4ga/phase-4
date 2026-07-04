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

export { normalizeBookBody, validateBookBody };
