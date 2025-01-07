import mongoose from "mongoose";
import dotenv from "dotenv";

const env = dotenv.config().parsed;
const connDB = () => {
  mongoose.connect(`${env.MONGODB_URI}${env.MONGODB_URL}:${env.MONGODB_PORT}`, {
    dbName: env.MONGODB_NAME,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", () => {
    console.log(`Connected to MongoDB name: ${env.MONGODB_NAME}`);
  });
};

export default connDB;
