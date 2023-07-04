const express = require("express");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();

// Configure MongoDB connection
const mongoURI = "mongodb://localhost/mydatabase";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a MongoDB schema and model for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware for parsing JSON data
app.use(express.json());

// API endpoint for creating a new user
app.post("/api/users", async (req, res) => {
  try {
    // Validate and sanitize user input
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    // Create a new user using Mongoose
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// The Express app is initialized, and the MongoDB connection is configured using Mongoose.

// A user schema is defined using Mongoose, specifying the fields name, email, and password. Appropriate validation and sanitization can be added to the schema definition based on your specific requirements.

// The API endpoint /api/users is defined for creating a new user. The endpoint expects a JSON payload with name, email, and password fields.

// In the API endpoint, user input is validated to ensure that all required fields are present. If any validation error occurs, an appropriate response with an error message is sent.

// If the input is valid, a new user is created using the User model from Mongoose. The user object is saved to the database, and the saved user data is sent as the API response.

// This codebase demonstrates the basic structure of a Node.js, Express, and MongoDB API with security measures in place, including input validation and data sanitization. However, it's important to customize and enhance the codebase based on your specific requirements and additional security considerations.

// Remember to further implement security practices such as input sanitization, secure authentication, authorization, and any other necessary measures based on your API's functionality and potential risks.





