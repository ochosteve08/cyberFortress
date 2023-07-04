// To ensure that the provided API passes the tests for method limit, content-type, security policies, embedded prevention, forced secure connection, MIME sniffing, and content labeling, you can make the following updates to the code:

// 1 Method Limit:
// To enforce method limit, you can use the Express method-override middleware along with the rate limiting middleware. Here's an example:

const methodOverride = require("method-override");

// Apply rate limiting middleware to all routes
app.use(limiter);

// Enable method override
app.use(methodOverride("_method"));

// This code enables the use of the _method query parameter or the X-HTTP-Method-Override header to override the HTTP method.

// 2 Content-Type:
// To enforce content-type, you can use the helmet middleware along with the content-type middleware. Here's an example:

const helmet = require("helmet");

// Enable helmet middleware
app.use(helmet());

// Content-Type middleware
app.use((req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).json({ error: "Unsupported Media Type" });
  }
  next();
});

// The helmet middleware adds security-related headers to the response, and the custom middleware checks if the request's Content-Type header is set to application/json.

// 3 Security Policies:
// To enforce security policies, you can set various security-related headers using the helmet middleware. Here's an example:
const helmet = require("helmet");

// Enable helmet middleware
app.use(helmet());

// The helmet middleware automatically sets security headers such as X-XSS-Protection, X-Content-Type-Options, Strict-Transport-Security, etc.




// 4 Embedded Prevention:
//To prevent embedded attacks like SQL injection, it's recommended to use parameterized queries or ORM libraries like Mongoose. By using Mongoose, you can leverage built-in protections against common security vulnerabilities. Ensure that you are using Mongoose for database operations and utilizing its features properly.

// Forced Secure Connection:
// To enforce a secure connection, you can use the helmet middleware along with the express-sslify middleware (if your application is behind a reverse proxy). Here's an example:

const helmet = require("helmet");
const enforce = require("express-sslify");

// Enable helmet middleware
app.use(helmet());

// Force secure connection
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// The helmet middleware sets security headers, and the express-sslify middleware enforces the use of HTTPS by redirecting HTTP requests to HTTPS.


// 5 MIME Sniffing:

// To prevent MIME sniffing, you can set the X-Content-Type-Options header using the helmet middleware. Here's an example:
const helmet = require("helmet");

// Enable helmet middleware
app.use(helmet());

// Content Labeling:
// Content labeling is typically specific to the content itself and may involve additional logic outside of the API code. It could include tagging or marking content with appropriate labels based on its sensitivity or classification. This aspect may require integration with external services or systems that handle content labeling and classification.
// It's important to note that security is a multi-layered approach, and these measures are just some of the steps you can take to enhance the security of your API. Always stay updated with the latest security practices and keep your dependencies patched to ensure






