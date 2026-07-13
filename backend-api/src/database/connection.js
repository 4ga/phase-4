import { DatabaseSync } from "node:sqlite";

export const openDatabase = (databasePath) => new DatabaseSync(databasePath);
