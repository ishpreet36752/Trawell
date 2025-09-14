/**
 * Authentication Routes
 * 
 * This module handles all authentication-related endpoints:
 * - User registration (signup)
 * - User login
 * - User logout
 * 
 * Each route includes:
 * - Input validation
 * - Error handling
 * - Security measures (password hashing, JWT tokens)
 * - HTTP-only cookie management
 * 
 * SECURITY FEATURES:
 * - Password hashing with bcrypt
 * - JWT token generation and validation
 * - HTTP-only cookies for token storage
 * - Input validation and sanitization
 */

const express = require("express");
const { validSignUpData } = require("../utilis/validation"); // Input validation utility
const bcrypt = require("bcrypt");                            // Password hashing (though not used directly here)
const User = require("../models/user");                      // User model for database operations

// Create Express router instance for authentication routes
const authRouter = express.Router();

/**
 * POST /signup - User Registration Endpoint
 * 
 * This route allows new users to create accounts. It includes:
 * - Input validation
 * - Password hashing (handled by User model middleware)
 * - JWT token generation
 * - Secure cookie setting
 * 
 * @route POST /signup
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.firstName - User's first name (required)
 * @param {string} req.body.lastName - User's last name (optional)
 * @param {number} req.body.age - User's age (must be 18+)
 * @param {string} req.body.emailId - User's email address (unique)
 * @param {string} req.body.gender - User's gender (male/female/others)
 * @param {string} req.body.image - Profile picture URL
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} req.body.about - User's bio/description
 * 
 * @returns {Object} JSON response with success message and user data
 * @returns {string} Cookie with JWT token (HTTP-only, expires in 7 days)
 * 
 * @example
 * // Request body
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "age": 25,
 *   "emailId": "john@example.com",
 *   "gender": "male",
 *   "password": "SecurePass123!",
 *   "about": "Love traveling and meeting new people!"
 * }
 */
authRouter.post("/signup", async (req, res) => {
  try {
    // Step 1: Validate input data using validation utility
    // This ensures all required fields are present and valid
    validSignUpData(req);
    
    // Step 2: Extract user data from request body
    // Destructuring assignment for cleaner code
    const { firstName, lastName, age, emailId, gender, image, password, about } = req.body;
    
    // Note: Password hashing is handled automatically by the User model's pre-save middleware
    // The bcrypt.hash() call below is commented out because it's redundant
    
    // const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    // Step 3: Create new User instance
    // This triggers the pre-save middleware which will hash the password
    const newUser = new User({
      firstName,
      lastName,
      age,
      emailId,
      gender,
      image,
      password, // Will be automatically hashed before saving
      about
    });

    // Step 4: Save user to database
    // This will trigger the pre-save middleware for password hashing
    const newUserSaved = await newUser.save();
    console.log("✅ New user created:", newUserSaved.emailId);

    // Step 5: Generate JWT token for automatic login
    // The user is automatically logged in after successful registration
    const token = await newUser.getJWT();
    
    // Step 6: Set JWT token in HTTP-only cookie
    // HTTP-only prevents JavaScript access (XSS protection)
    // 7 days expiration for user convenience
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      httpOnly: true,    // Prevents JavaScript access to the cookie
      secure: false,     // Set to true in production with HTTPS
      sameSite: 'strict' // CSRF protection
    });

    // Step 7: Send success response
    res.status(201).json({
      message: "User created successfully",
      data: newUserSaved,
      token: token // Also send token in response for immediate use
    });
    
  } catch (err) {
    // Handle validation and database errors
    console.error("❌ Signup error:", err.message);
    
    // Send appropriate error response
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        error: err.message
      });
    }
    
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({
        message: "Email already exists. Please use a different email or login.",
        error: "DUPLICATE_EMAIL"
      });
    }
    
    res.status(400).json({
      message: "Signup failed",
      error: err.message
    });
  }
});

/**
 * POST /login - User Authentication Endpoint
 * 
 * This route authenticates existing users and provides access tokens.
 * It includes:
 * - Credential validation
 * - Password verification
 * - JWT token generation
 * - Secure cookie setting
 * 
 * @route POST /login
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.emailId - User's email address
 * @param {string} req.body.password - User's password
 * 
 * @returns {Object} JSON response with user data
 * @returns {string} Cookie with JWT token (HTTP-only, expires in 7 days)
 * 
 * @example
 * // Request body
 * {
 *   "emailId": "john@example.com",
 *   "password": "SecurePass123!"
 * }
 */
authRouter.post("/login", async (req, res) => {
  try {
    // Step 1: Extract login credentials from request body
    const { emailId, password } = req.body;
    
    // Step 2: Validate that email is provided
    if (!emailId) {
      throw new Error("Email is required");
    }

    // Step 3: Find user by email address
    // Convert email to lowercase for case-insensitive matching
    // This matches the schema validation which converts emails to lowercase
    const user = await User.findOne({ emailId: emailId.toLowerCase() });

    // Step 4: Check if user exists
    if (!user) {
      throw new Error("Invalid credentials"); // Generic message for security
    }

    // Step 5: Validate password
    // This uses the instance method from the User model
    // It compares the provided password with the stored hash
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials"); // Generic message for security
    }

    // Step 6: Generate JWT token for authenticated session
    const token = await user.getJWT();

    // Step 7: Set token in HTTP-only cookie
    // Same security settings as signup
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: false,     // Set to true in production with HTTPS
      sameSite: 'strict'
    });

    // Step 8: Send user data (excluding sensitive information)
    // Note: password is automatically excluded by Mongoose
    res.status(200).json({
      message: "Login successful",
      user: user,
      token: token
    });
    
  } catch (err) {
    // Handle authentication errors
    console.error("❌ Login error:", err.message);
    
    // Send generic error message for security (don't reveal specific details)
    res.status(401).json({
      message: "Invalid credentials",
      error: "AUTHENTICATION_FAILED"
    });
  }
});

/**
 * POST /logout - User Logout Endpoint
 * 
 * This route logs out the user by clearing the authentication cookie.
 * It's a simple but effective way to end user sessions.
 * 
 * @route POST /logout
 * @returns {string} Success message
 * @returns {string} Cleared cookie (expires immediately)
 * 
 * Note: For enhanced security, consider implementing token blacklisting
 * in production to prevent reuse of logged-out tokens.
 */
authRouter.post("/logout", async (req, res) => {
  try {
    // Clear the authentication cookie by setting it to expire immediately
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Expires now
      httpOnly: true,
      secure: false,
      sameSite: 'strict'
    });
    
    res.status(200).json({
      message: "Logout successful"
    });
    
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    res.status(500).json({
      message: "Logout failed",
      error: "LOGOUT_ERROR"
    });
  }
});

// Export the router for use in the main application
module.exports = authRouter;

/**
 * SECURITY CONSIDERATIONS:
 * 
 * 1. ✅ Password Security:
 *    - Passwords are hashed using bcrypt with salt rounds
 *    - Strong password validation enforced
 *    - Plain text passwords are never stored
 * 
 * 2. ✅ Token Security:
 *    - JWT tokens have expiration (7 days)
 *    - Tokens are stored in HTTP-only cookies
 *    - SameSite attribute prevents CSRF attacks
 * 
 * 3. ✅ Input Validation:
 *    - All inputs are validated before processing
 *    - Email format validation
 *    - Age and gender validation
 * 
 * 4. ✅ Error Handling:
 *    - Generic error messages for security
 *    - Proper HTTP status codes
 *    - Comprehensive error logging
 * 
 * PRODUCTION ENHANCEMENTS:
 * 
 * 1. 🔒 Environment Variables:
 *    - Move JWT secret to process.env
 *    - Configure cookie settings based on environment
 * 
 * 2. 🔒 Rate Limiting:
 *    - Implement login attempt limits
 *    - Add CAPTCHA for multiple failed attempts
 * 
 * 3. 🔒 Enhanced Security:
 *    - Email verification for new accounts
 *    - Password reset functionality
 *    - Account lockout after failed attempts
 * 
 * 4. 🔒 Monitoring:
 *    - Log authentication events
 *    - Monitor for suspicious activity
 *    - Implement audit trails
 * 
 * 5. 🔒 HTTPS:
 *    - Enable secure cookies in production
 *    - Use HTTPS for all communications
 */
