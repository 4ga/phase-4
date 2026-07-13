import test from "node:test";
import assert from "node:assert/strict";

import { openDatabase } from "../src/database/connection.js";

test("openDatabase opens a usable SQLite connection", () => {
  const database = openDatabase(":memory:");

  try {
    assert.doesNotThrow(() => {
      database.exec("SELECT 1;");
    });
  } finally {
    database.close();
  }
});
