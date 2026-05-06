import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import bookingsRoutes from './routes/bookings.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Seed route for admin (development only)
import { seedDatabase } from './seeder.js';
app.post('/api/seed', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    await seedDatabase();
    res.json({ message: 'Database seeded' });
  } else {
    res.status(403).json({ message: 'Not allowed in production' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
