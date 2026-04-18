const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// ✅ CORS CONFIG (FIXED FOR VERCEL + RENDER)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://gym-management-system-mu-smoky.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Middleware
app.use(express.json());


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/attendance', require('./routes/attendance'));


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Gym Management API is running' });
});


// Port & DB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// Connect DB and start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
