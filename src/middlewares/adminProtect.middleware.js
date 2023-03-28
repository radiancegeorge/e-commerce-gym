// Require jsonwebtoken and dotenv
const jwt = require("jsonwebtoken");

// Define a function to verify the token
function authenticateToken(req, res, next) {
  // Get the token from the header
  const authHeader = req.headers["authorization"];
  // Check if the header has a bearer token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    // Verify the token using the secret key
    jwt.verify(token, process.env.HASH, (err, user) => {
      // If there is an error, send a 403 response
      if (err) return res.sendStatus(403);
      // Otherwise, set the user in the request object and call next()
      req.admin = user;
      next();
    });
  } else {
    // If there is no token or it is not a bearer token, send a 401 response
    res.sendStatus(401);
  }
}

module.exports = authenticateToken;
