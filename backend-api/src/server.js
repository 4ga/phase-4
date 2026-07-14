import app from "./app.js";
import { getDatabasePath } from "./config/databaseConfig.js";
import { createApplicationDatabase } from "./database/createApplicationDatabase.js";

const DEFAULT_PORT = 3000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const databasePath = getDatabasePath();
const database = createApplicationDatabase(databasePath);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("close", () => {
  database.close();
});
