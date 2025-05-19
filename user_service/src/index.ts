import express from "express";
import dotenv from "dotenv";
import { connectDB  } from "./config/db";
import userRoutes from "./routes/user";
import { connectRabbitMQ } from "./utils/rabbit";


dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);

const start = async () => {
  await connectDB ();
  await connectRabbitMQ();
  app.listen(process.env.PORT, () =>
    console.log(`Auth service running on port ${process.env.PORT} ${process.env.MONGO_URI}`)
  );
};

start();
