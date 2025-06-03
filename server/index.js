import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js';
import { hostname } from 'os';

// Initialize environment variables
dotenv.config();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
const {
  MONGODB_URI,
  MONGODB_USER,
  MONGODB_PASSWORD
} = process.env;

// If username and password are provided, inject them into the URI
let finalUri = MONGODB_URI;

if (MONGODB_USER && MONGODB_PASSWORD) {
  // Insert credentials into the URI
  const uri = new URL(MONGODB_URI);
  uri.username = encodeURIComponent(MONGODB_USER);
  uri.password = encodeURIComponent(MONGODB_PASSWORD);
  finalUri = uri.toString();
}

mongoose.connect(finalUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', postRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
