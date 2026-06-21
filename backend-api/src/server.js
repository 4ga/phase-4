import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Phase 4 Backend API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", phase: 4, milestone: 102 });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
