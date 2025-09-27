// server/index.ts

const express = require('express');
const cors = require('cors');

import type { Request, Response, NextFunction } from 'express';
import mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Configure CORS to allow requests from your frontend's origin
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// API route for the root URL
app.get('/', (req: Request, res: Response) => {
  res.send('CareConnect Backend is running!');
});

// MongoDB Connection
const mongoUri = 'mongodb://localhost:27017/homecareDB';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err: mongoose.MongooseError) => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model for Caregivers
const caregiverSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  available: Boolean,
});
const Caregiver = mongoose.model('Caregiver', caregiverSchema);

// Mongoose Schema & Model for NUIDs
const nuidSchema = new mongoose.Schema({
  nuid: {
    type: String,
    required: true,
    unique: true
  }
});
const NUID = mongoose.model('NUID', nuidSchema);

// API Routes
app.get('/api/caregivers', async (req: Request, res: Response) => {
  try {
    const caregivers = await Caregiver.find();
    res.json(caregivers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/verify-nuid', async (req: Request, res: Response) => {
  const { nuid } = req.body;
  if (!nuid) {
    return res.status(400).json({ message: 'NUID is required.' });
  }

  try {
    const foundNUID = await NUID.findOne({ nuid: nuid });
    if (foundNUID) {
      res.json({ verified: true, message: 'NUID is valid.' });
    } else {
      res.json({ verified: false, message: 'NUID not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error during verification.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});