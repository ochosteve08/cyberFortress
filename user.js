const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configure MongoDB connection
const mongoURI = 'mongodb://localhost/tododb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Todo and User models
const todoSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  userId: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON data
app.use(express.json());

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60 // 60 requests per hour
});

// Apply rate limiting middleware to all routes
app.use(limiter);

// Middleware for authentication and authorization
const authenticateUser = (req, res, next) => {
  try {
    // Get the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Add the decoded user ID to the request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    // Validate and sanitize user input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    // Validate and sanitize user input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Find the user by username and verify the password
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token and send it as the response
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
