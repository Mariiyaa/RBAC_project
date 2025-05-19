import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './utils/rabbit';
import roleRoutes from './routes/role';

dotenv.config();

const app = express();

// Middlewares

app.use(express.json());

// Routes
app.use('/api/roles', roleRoutes);

// Health Check
app.get('/', (_req, res) => {
  res.send('Role & Permission Service is running');
});


(async () => {
  await connectRabbitMQ(); // Connect to RabbitMQ before app starts
})();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rbac-role-service';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Role & Permission Service listening on port ${PORT}`);
});
