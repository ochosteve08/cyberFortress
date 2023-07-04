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

// API endpoint for creating a new todo
app.post('/api/todos', authenticateUser, async (req, res) => {
  try {
    // Validate and sanitize user input
    const { title, description, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Invalid todo data' });
    }

    // Create a new todo
    const newTodo = new Todo({
      title,
      description,
      dueDate,
      userId: req.userId
    });
    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for getting all todos
app.get('/api/todos', authenticateUser, async (req, res) => {
  try {
    // Retrieve all todos for the authenticated user
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// API endpoint for updating a todo
app.put('/api/todos/:id', authenticateUser, async (req, res) => {
  try {
    // Validate and sanitize user input
    const { title, description, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Invalid todo data' });
    }

    // Find the todo by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, dueDate },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for deleting a todo
app.delete('/api/todos/:id', authenticateUser, async (req, res) => {
  try {
    // Find the todo by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for fetching a todo by ID
app.get('/api/todos/:id', authenticateUser, async (req, res) => {
  try {
    // Find the todo by ID and ensure it belongs to the authenticated user
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
