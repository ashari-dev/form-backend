import express from "express";
import api from "./routers/api.js";
import connDB from "./lib/db.js";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", api);

// Error handling 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// MongoDB Connection
connDB();

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
