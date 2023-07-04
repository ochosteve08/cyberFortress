const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

// Load SSL/TLS certificate and private key
const options = {
  key: fs.readFileSync("path/to/private-key.pem"),
  cert: fs.readFileSync("path/to/certificate.pem"),
};

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.secure) {
    // Request is already secure, continue
    next();
  } else {
    // Redirect to HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Define your routes and API endpoints
// ...

// Start the HTTPS server
const port = 443; // Default HTTPS port
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// In the code above, we load the SSL/TLS certificate and private key using the fs module. Then, we use the app.use() middleware to check if the request is already secure (using the req.secure property). If it is, we continue processing the request. If it's not secure (i.e., it's an HTTP request), we redirect it to the corresponding HTTPS URL using res.redirect().

// Update API documentation and URLs: After enforcing HTTPS, make sure to update your API documentation and inform any clients or users of the updated URLs that should now use https:// instead of http://.
// By enforcing secure connections through HTTPS, you ensure that all communication with your API is encrypted, reducing the risk of data interception and providing a higher level of security. Additionally, using HTTPS helps protect against man-in-the-middle attacks and helps safeguard sensitive information, including authentication credentials and user data.

// Note: It's crucial to keep your SSL/TLS certificate and private key secure and follow best practices for certificate management.





