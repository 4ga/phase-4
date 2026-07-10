import test from "node:test";
import assert from "node:assert/strict";

import { errorHandler } from "../src/middleware/errorHandler.js";
import { notFoundHandler } from "../src/middleware/notFoundHandler.js";

const createMockResponse = () => {
  const response = {
    statusCode: undefined,
    body: undefined,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test("notFoundHandler returns a JSON 404 response", () => {
  const req = {
    method: "GET",
    originalUrl: "/api/missing",
  };

  const res = createMockResponse();

  notFoundHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    error: "Route not found",
    method: "GET",
    path: "/api/missing",
  });
});

test("errorHandler returns 400 for malformed JSON errors", () => {
  const originalConsoleError = console.error;

  console.error = () => {};

  const error = new SyntaxError("Unexpected end of JSON input");
  error.status = 400;

  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    error: "Invalid JSON body",
  });

  console.error = originalConsoleError;
});

test("errorHandler returns 500 for unexpected errors", () => {
  const originalConsoleError = console.error;

  console.error = () => {};

  const error = new Error("Database exploded");
  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    error: "Internal server error",
  });

  console.error = originalConsoleError;
});

test("errorHandler does not expose unexpected error details", () => {
  const originalConsoleError = console.error;

  console.error = () => {};

  const error = new Error("Private internal detail");
  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.notDeepEqual(res.body, {
    error: "Private internal detail",
  });

  console.error = originalConsoleError;
});

test("errorHandler passes errors forward when headers were already sent", () => {
  const originalConsoleError = console.error;

  console.error = () => {};

  const error = new Error("Headers already sent");
  const res = createMockResponse();

  res.headersSent = true;

  let forwardedError;

  errorHandler(error, {}, res, (nextError) => {
    forwardedError = nextError;
  });

  assert.equal(forwardedError, error);
  assert.equal(res.statusCode, undefined);
  assert.equal(res.body, undefined);

  console.error = originalConsoleError;
});

test("errorHandler logs the internal error", () => {
  const originalConsoleError = console.error;

  let loggedError;

  console.error = (error) => {
    loggedError = error;
  };

  const error = new Error("Log me");
  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(loggedError, error);

  console.error = originalConsoleError;
});
