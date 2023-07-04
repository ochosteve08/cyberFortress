const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const uri = "mongodb://localhost:27017/mydatabase";

app.get("/api/users", async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const collection = client.db().collection("users");
    const result = await collection.find({ name: searchQuery }).toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.close();
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// In the example above, the API endpoint /api/users receives a search parameter 
// from the query string (req.query.search). Instead of directly injecting this value into the query, 
// we pass it as an object to the find() method. The MongoDB driver takes care of proper escaping
// and handling the parameter value, preventing SQL injection.

// By using prepared statements or parameterized queries, the database driver automatically
// handles the necessary escaping or sanitization of user input, ensuring that it is treated 
// as data rather than executable code. This provides embedded protection against SQL injection attacks.

// It's important to note that the specific implementation details may vary depending on the database driver 
// and library you're using. Consult the documentation of your database driver or ORM for more information on
// how to use prepared statements or parameterized queries effectively.

//Additionally, you should also follow other security best practices such as
// input validation, input sanitization, and implementing proper access controls
// to further protect your API against potential vulnerabilities.




