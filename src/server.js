console.clear();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const shortid = require("shortid");
const fs = require("fs/promises");
const app = express();
const path = require("path");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const dbLocation = path.resolve("src", "data.json");

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  const idByUser = players.find((item) => item.id === id);
  if (!idByUser) {
    res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(idByUser);
});

app.get("/", async (req, res) => {
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  res.status(200).json(players);
});

app.post("/", async (req, res) => {
  const newPlayer = {
    id: shortid.generate(),
    ...req.body,
  };
  const bafarData = await fs.readFile(dbLocation);
  const players = JSON.parse(bafarData);
  await players.push(newPlayer);
  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json({
    messge: "Data saved successfully",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
  console.log(`localhost:${port}`);
});
