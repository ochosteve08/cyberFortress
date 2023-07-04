const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  // Other fields...
  label: {
    type: String,
    required: true,
    enum: ["Sensitive", "Explicit", "Restricted", "Unlabeled"],
    default: "Unlabeled",
  },
});

const Resource = mongoose.model("Resource", resourceSchema);


// In the example above, the label field is of type String and has a
// required constraint. It uses the enum property to define a list of 
// allowed labels, including a default value of "Unlabeled."

// Validate and Enforce Labels: In your API routes or controllers, 
// implement validation and enforcement logic to ensure content 
// labels are provided correctly. For example, you can add middleware
// functions to validate and enforce the labels based on your business
// rules.

// Middleware to validate content label
const validateLabel = (req, res, next) => {
  const { label } = req.body;

  if (!label || !['Sensitive', 'Explicit', 'Restricted'].includes(label)) {
    return res.status(400).json({ error: 'Invalid content label.' });
  }

  next();
};

// Middleware to enforce content label
const enforceLabel = async (req, res, next) => {
  const { resourceId } = req.params;
  const { label } = req.body;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    resource.label = label;
    await resource.save();

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update resource label
app.put('/api/resources/:resourceId/label', validateLabel, enforceLabel, (req, res) => {
  res.status(200).json({ message: 'Content label updated successfully.' });
});

// In the above example, we define two middleware functions: validateLabel and enforceLabel. 
// The validateLabel middleware validates that the provided content label is valid based on the allowed values. 
// If the label is missing or not allowed, it returns a 400 Bad Request error.

// The enforceLabel middleware updates the content label for a specific resource identified by resourceId. 
// It first retrieves the resource from the database, updates the label, and saves the changes. If the resource is not found,
// it returns a 404 Not Found error.

// The /api/resources/:resourceId/label route uses the validateLabel and enforceLabel middleware functions to validate and enforce the content label when updating the label for a resource.

// Remember to adjust the code to fit your specific project structure, authentication, and authorization requirements.

// By implementing these mechanisms, you can enforce content labeling for your API's resources, ensuring proper categorization based on your defined criteria.



const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configure MongoDB connection
const mongoURI = 'mongodb://localhost/tododb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Todo model
const todoSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: { type: String },
  label: {
    type: String,
    required: true,
    enum: ['Personal', 'Work', 'Shopping', 'Others'],
    default: 'Others'
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for validating content label
const validateLabel = (req, res, next) => {
  const { label } = req.body;

  if (!['Personal', 'Work', 'Shopping', 'Others'].includes(label)) {
    return res.status(400).json({ error: 'Invalid content label' });
  }

  next();
};

// API endpoint for creating a new todo
app.post('/api/todos', validateLabel, (req, res) => {
  try {
    const { title, description, label } = req.body;

    // Validate and sanitize user input
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create a new todo
    const newTodo = new Todo({
      title,
      description,
      label
    });

    // Save the new todo to the database
    newTodo.save();

    res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for updating a todo
app.put('/api/todos/:todoId', validateLabel, (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, description, label } = req.body;

    // Validate and sanitize user input
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Find the todo by ID
    Todo.findById(todoId, (err, todo) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      // Update the todo properties
      todo.title = title;
      todo.description = description;
      todo.label = label;

      // Save the updated todo to the database
      todo.save();

      res.status(200).json({ message: 'Todo updated successfully', todo });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for deleting a todo
app.delete('/api/todos/:todoId', (req, res) => {
  try {
    const { todoId } = req.params;

    // Find the todo by ID and remove it
    Todo.findByIdAndRemove(todoId, (err, todo) => {
      if (err) {
        console.error}
      })}
      catch(error){
        console.error;
      }})





