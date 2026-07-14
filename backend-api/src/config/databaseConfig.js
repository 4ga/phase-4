const DEFAULT_DATABASE_PATH = "data/tasks.sqlite";

export const getDatabasePath = (environment = process.env) =>
  environment.DATABASE_PATH || DEFAULT_DATABASE_PATH;
