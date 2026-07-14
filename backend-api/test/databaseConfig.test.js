import test from "node:test";
import assert from "node:assert/strict";

import { getDatabasePath } from "../src/config/databaseConfig.js";

test("getDatabasePath returns the default database path", () => {
  assert.equal(getDatabasePath({}), "data/tasks.sqlite");
});

test("getDatabasePath returns the configured database path", () => {
  assert.equal(
    getDatabasePath({
      DATABASE_PATH: "data/custom.sqlite",
    }),
    "data/custom.sqlite",
  );
});
