/**
 * Authentication Middleware
 * 
 * This middleware function authenticates users by verifying JWT tokens
 * from cookies. It's used to protect routes that require user authentication.
 * 
 * How it works:
 * 1. Extract JWT token from request cookies
 * 2. Verify the token's authenticity and expiration
 * 3. Find the user in the database using the token payload
 * 4. Attach the user object to the request for use in route handlers
 * 
 * Usage:
 * - Add this middleware to any route that requires authentication
 * - The authenticated user will be available as req.user in the route handler
 */

const jwt = require("jsonwebtoken");  // JWT verification library
const User = require("../models/user"); // User model for database queries

/**
 * User Authentication Middleware
 * 
 * This function runs before protected route handlers to ensure the user
 * is authenticated. It's a crucial security component that prevents
 * unauthorized access to protected resources.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next function to continue to next middleware/route
 * 
 * @example
 * // Protect a route with authentication
 * router.get('/profile', userAuth, (req, res) => {
 *   // req.user contains the authenticated user
 *   res.json(req.user);
 * });
 */
const userAuth = async (req, res, next) => {
  try {
    // Step 1: Extract JWT token from cookies
    // The token was set during login/signup in an HTTP-only cookie
    const { token } = req.cookies;
    
    // Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: "You are not authenticated. Please login first.",
        error: "MISSING_TOKEN"
      });
    }

    // Step 3: Verify JWT token
    // jwt.verify() decodes the token and checks its signature
    // If the token is invalid or expired, it will throw an error
    const decodeData = await jwt.verify(token, "Trawell@123$");
    
    // Step 4: Extract user ID from decoded token
    // The token payload contains the user's _id (set during token creation)
    const { _id } = decodeData;
    
    // Step 5: Find user in database
    // This ensures the user still exists and hasn't been deleted
    const user = await User.findById(_id);
    
    // Step 6: Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
        error: "USER_NOT_FOUND"
      });
    }
    
    // Step 7: Attach user to request object
    // This makes the user data available to the route handler
    req.user = user;
    
    // Step 8: Continue to next middleware or route handler
    next();
    
  } catch (err) {
    // Handle different types of JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        error: "INVALID_TOKEN"
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        error: "TOKEN_EXPIRED"
      });
    }
    
    // Handle other unexpected errors
    console.error("🔐 Authentication middleware error:", err);
    res.status(500).json({
      message: "Authentication failed. Please try again.",
      error: "AUTH_ERROR"
    });
  }
};

// Export the middleware function
module.exports = { userAuth };

/**
 * HOW JWT AUTHENTICATION WORKS:
 * 
 * 1. LOGIN/SIGNUP:
 *    - User provides credentials
 *    - Server validates credentials
 *    - Server creates JWT with user ID
 *    - JWT is sent to client in HTTP-only cookie
 * 
 * 2. PROTECTED REQUEST:
 *    - Client makes request to protected route
 *    - Browser automatically sends cookie with JWT
 *    - This middleware extracts and verifies JWT
 *    - If valid, user data is attached to request
 *    - Route handler can access user via req.user
 * 
 * 3. SECURITY FEATURES:
 *    - HTTP-only cookies prevent XSS attacks
 *    - JWT expiration prevents indefinite access
 *    - Token verification ensures authenticity
 *    - Database lookup ensures user still exists
 * 
 * PRODUCTION IMPROVEMENTS NEEDED:
 * 
 * 1. 🔒 Move JWT secret to environment variables
 * 2. 🔒 Add token refresh mechanism
 * 3. 🔒 Implement token blacklisting for logout
 * 4. 🔒 Add rate limiting for authentication attempts
 * 5. 🔒 Log authentication events for security monitoring
 * 6. 🔒 Add device fingerprinting for additional security
 * 
 * ALTERNATIVE AUTHENTICATION METHODS:
 * 
 * 1. Session-based authentication (stored in Redis/database)
 * 2. OAuth 2.0 for third-party authentication
 * 3. API key authentication for service-to-service communication
 * 4. Multi-factor authentication (MFA)
 */
