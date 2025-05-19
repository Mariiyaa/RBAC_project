import express from "express";
import dotenv from "dotenv";
import { connectDB  } from "./config/db";
import authRoutes from "./routes/auth";
import { connectRabbitMQ } from "./utils/rabbit";


dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const start = async () => {
  await connectDB ();
  app.listen(process.env.PORT, () =>
    console.log(`Auth service running on port ${process.env.PORT} ${process.env.MONGO_URI}`)
  );
 
await connectRabbitMQ(); // Add this line

};

start();
