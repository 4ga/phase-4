import app from "./app.js";

const DEFAULT_PORT = 3500;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
