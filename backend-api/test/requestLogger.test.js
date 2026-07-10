import test from "node:test";
import assert from "node:assert/strict";

import {
  requestLogger,
  shouldLogRequests,
} from "../src/middleware/requestLogger.js";

const createMockRequest = () => ({
  method: "GET",
  originalUrl: "/api/tasks",
});

test("shouldLogRequests returns false when NODE_ENV is test", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = "test";

  assert.equal(shouldLogRequests(), false);

  process.env.NODE_ENV = originalNodeEnv;
});

test("shouldLogRequests returns true when NODE_ENV is not test", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  assert.equal(shouldLogRequests(), true);

  process.env.NODE_ENV = originalNodeEnv;
});

test("requestLogger calls next without logging in test mode", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConsoleLog = console.log;

  let logCallCount = 0;
  let nextCallCount = 0;

  process.env.NODE_ENV = "test";
  console.log = () => {
    logCallCount += 1;
  };

  requestLogger(createMockRequest(), {}, () => {
    nextCallCount += 1;
  });

  assert.equal(logCallCount, 0);
  assert.equal(nextCallCount, 1);

  console.log = originalConsoleLog;
  process.env.NODE_ENV = originalNodeEnv;
});

test("requestLogger logs the method and URL outside test mode", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConsoleLog = console.log;

  let loggedMessage = "";
  let nextCallCount = 0;

  process.env.NODE_ENV = "development";
  console.log = (message) => {
    loggedMessage = message;
  };

  requestLogger(createMockRequest(), {}, () => {
    nextCallCount += 1;
  });

  assert.equal(loggedMessage, "GET /api/tasks");
  assert.equal(nextCallCount, 1);

  console.log = originalConsoleLog;
  process.env.NODE_ENV = originalNodeEnv;
});
