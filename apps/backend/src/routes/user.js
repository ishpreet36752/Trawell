/**
 * User Management Routes
 * 
 * This module handles all user-related operations including:
 * - User feed generation (finding potential travel companions)
 * - Connection management (pending requests, accepted connections)
 * - Password updates
 * - Profile updates
 * - User data retrieval
 * 
 * All routes are protected with userAuth middleware to ensure
 * only authenticated users can access these endpoints.
 * 
 * FEATURES:
 * - Pagination for user feed
 * - Connection filtering and management
 * - Secure password updates
 * - Profile data validation
 */

const express = require("express");
const { userAuth } = require("../middlewares/auth.js");           // Authentication middleware
const { validUpdateData } = require("../utilis/validation.js");   // Input validation utility
const userRouter = express.Router();                             // Express router instance
const validator = require("validator");                          // Password validation
const bcrypt = require("bcrypt");                                // Password hashing (though not used directly)
const ConnectionRequest = require("../models/connectionRequest.js"); // Connection model
const User = require("../models/user.js");                       // User model

// Fields that are safe to return in user feeds (excludes sensitive data)
const USER_SAVE_DATA = ["firstName", "lastName", "age", "gender", "image", "about"];

/**
 * GET /user/feed - User Discovery Feed
 * 
 * This endpoint generates a feed of potential travel companions for the logged-in user.
 * It excludes users that the logged-in user has already interacted with (liked, passed, etc.)
 * and implements pagination for better performance.
 * 
 * @route GET /user/feed
 * @middleware userAuth - Requires authentication
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Number of users per page (default: 10, max: 50)
 * 
 * @returns {Array} Array of user objects (filtered and paginated)
 * 
 * ALGORITHM:
 * 1. Get all connection requests involving the logged-in user
 * 2. Create a set of user IDs to exclude from the feed
 * 3. Query users excluding the logged-in user and connected users
 * 4. Apply pagination and field selection
 * 
 * @example
 * GET /user/feed?page=1&limit=20
 * // Returns first 20 potential travel companions
 */
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // Get the authenticated user from the request (set by userAuth middleware)
    const loggedUser = req.user;

    // Extract pagination parameters from query string
    const page = parseInt(req.query.page) || 1;           // Current page (default: 1)
    let limit = parseInt(req.query.limit) || 10;          // Users per page (default: 10)
    limit = limit > 50 ? 50 : limit;                      // Cap limit at 50 for performance
    const skip = (page - 1) * limit;                      // Calculate offset for pagination

    // Step 1: Find all connection requests involving the logged-in user
    // This includes both requests sent by and received by the user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id },  // Requests sent by the user
        { toUserId: loggedUser._id }     // Requests received by the user
      ],
    }).select("fromUserId toUserId"); // Only select the user ID fields for efficiency

    // Step 2: Create a set of user IDs to exclude from the feed
    // Using Set for efficient lookup and automatic deduplication
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    console.log("🚫 Users to hide from feed:", hideUserFromFeed);

    // Step 3: Query users for the feed with exclusions and pagination
    const feed = await User.find({
      $and: [
        { _id: { $ne: loggedUser._id } },                           // Exclude the logged-in user
        { _id: { $nin: Array.from(hideUserFromFeed) } },            // Exclude users with existing connections
      ],
    })
      .select(USER_SAVE_DATA)  // Only return safe, non-sensitive fields
      .skip(skip)              // Skip users for pagination
      .limit(limit);           // Limit results per page

    // Step 4: Send the filtered and paginated user feed
    res.status(200).json({
      message: "User feed retrieved successfully",
      feed: feed,
      pagination: {
        page: page,
        limit: limit,
        total: feed.length
      }
    });
    
  } catch (err) {
    console.error("❌ User feed error:", err.message);
    res.status(500).json({
      message: "Failed to retrieve user feed",
      error: err.message
    });
  }
});

/**
 * GET /user/connections/pending - Pending Connection Requests
 * 
 * This endpoint retrieves all pending connection requests (status: "like")
 * that the logged-in user has received from other users.
 * 
 * @route GET /user/connections/pending
 * @middleware userAuth - Requires authentication
 * @returns {Object} Object containing message and array of pending requests
 * 
 * @example
 * // Response includes user details of those who sent requests
 * {
 *   "message": "All pending connections",
 *   "data": [
 *     {
 *       "fromUserId": { "firstName": "John", "lastName": "Doe", ... },
 *       "status": "like"
 *     }
 *   ]
 * }
 */
userRouter.get("/user/connections/pending", userAuth, async (req, res) => {
  try {
    // Get the authenticated user from the request
    const loggedUser = req.user;

    // Find all connection requests where:
    // - The logged-in user is the recipient (toUserId)
    // - The status is "like" (pending request)
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "like",
    }).populate("fromUserId", ["_id", "firstName", "lastName", "age", "gender", "image", "about"]);

    res.status(200).json({
      message: "All pending connections",
      data: connectionRequest,
      count: connectionRequest.length
    });
    
  } catch (err) {
    console.error("❌ Pending connections error:", err.message);
    res.status(500).json({
      message: "Failed to retrieve pending connections",
      error: err.message
    });
  }
});

/**
 * GET /user/connections - Accepted Connections
 * 
 * This endpoint retrieves all accepted connections for the logged-in user.
 * It returns the user details of people the user is connected with.
 * 
 * @route GET /user/connections
 * @middleware userAuth - Requires authentication
 * @returns {Object} Object containing array of connected users
 * 
 * ALGORITHM:
 * 1. Find all accepted connection requests involving the user
 * 2. For each connection, determine which user is the "other person"
 * 3. Return array of connected users (excluding the logged-in user)
 */
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    // Get the authenticated user from the request
    const loggedUser = req.user;

    // Find all accepted connection requests where the logged-in user is involved
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accept" },  // Requests sent by user and accepted
        { toUserId: loggedUser._id, status: "accept" }     // Requests received by user and accepted
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender", "image", "about"])
      .populate("toUserId", ["firstName", "lastName", "age", "gender", "image", "about"]);

    // Process the connections to return only the "other person" in each connection
    // This prevents showing the logged-in user in their own connections list
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;    // If user sent the request, return the recipient
      }
      return row.fromUserId;    // If user received the request, return the sender
    });

    res.status(200).json({
      message: "Connections retrieved successfully",
      data: data,
      count: data.length
    });
    
  } catch (err) {
    console.error("❌ Connections error:", err.message);
    res.status(500).json({
      message: "Failed to retrieve connections",
      error: err.message
    });
  }
});

/**
 * PATCH /user/password - Update User Password
 * 
 * This endpoint allows users to change their password with proper validation:
 * - Current password verification
 * - New password strength validation
 * - Password confirmation matching
 * 
 * @route PATCH /user/password
 * @middleware userAuth - Requires authentication
 * @param {Object} req.body - Request body containing password data
 * @param {string} req.body.currentPassword - User's current password
 * @param {string} req.body.newPassword - New password to set
 * @param {string} req.body.confirmPassword - Confirmation of new password
 * 
 * @returns {Object} Success message and updated user data
 * 
 * SECURITY FEATURES:
 * - Current password verification
 * - Strong password requirements
 * - Automatic password hashing (handled by User model)
 */
userRouter.patch("/user/password", userAuth, async (req, res) => {
  try {
    // Extract password data from request body
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Step 1: Validate that all required fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields are required");
    }

    // Get the authenticated user from the request
    const loggedUser = req.user;

    // Step 2: Verify the current password
    const isValidPassword = await loggedUser.validatePassword(currentPassword);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Step 3: Ensure new password and confirmation match
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirmation password must match");
    }

    // Step 4: Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password must be strong: minimum 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol");
    }

    // Step 5: Update the user's password
    // Note: Password hashing is automatically handled by the User model's pre-save middleware
    loggedUser.password = newPassword;
    await loggedUser.save();

    res.status(200).json({
      message: "Password updated successfully",
      user: {
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        emailId: loggedUser.emailId
        // Don't send password hash in response
      }
    });
    
  } catch (err) {
    console.error("❌ Password update error:", err.message);
    res.status(400).json({
      message: "Password update failed",
      error: err.message
    });
  }
});

/**
 * GET /user/:id - Get User Profile
 * 
 * This endpoint returns the profile of the authenticated user.
 * The ID parameter is not used since we get the user from the auth token.
 * 
 * @route GET /user/:id
 * @middleware userAuth - Requires authentication
 * @param {string} id - User ID (not used, user comes from auth token)
 * 
 * @returns {Object} User profile data
 * 
 * Note: This endpoint could be enhanced to allow viewing other users' profiles
 * by implementing proper authorization checks.
 */
userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    // Get the authenticated user from the request (set by userAuth middleware)
    const user = req.user;
    
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: user
    });
    
  } catch (err) {
    console.error("❌ User profile error:", err.message);
    res.status(500).json({
      message: "Failed to retrieve user profile",
      error: err.message
    });
  }
});

/**
 * PATCH /user/:id - Update User Profile
 * 
 * This endpoint allows users to update their profile information.
 * It includes validation to ensure only allowed fields can be updated.
 * 
 * @route PATCH /user/:id
 * @middleware userAuth - Requires authentication
 * @param {string} id - User ID (not used, user comes from auth token)
 * @param {Object} req.body - Request body containing update data
 * 
 * @returns {Object} Success message and updated user data
 * 
 * SECURITY FEATURES:
 * - Field validation (only allowed fields can be updated)
 * - Input sanitization and validation
 * - Authentication required
 */
userRouter.patch("/user/:id", userAuth, async (req, res) => {
  try {
    // Step 1: Validate the update data using validation utility
    if (!validUpdateData(req)) {
      throw new Error("Invalid update data provided");
    }

    // Get the authenticated user from the request
    const loggedUser = req.user;
    const updateUser = req.body;

    // Step 2: Update user fields with new values
    // This approach allows partial updates (only specified fields are changed)
    Object.keys(updateUser).forEach((key) => {
      loggedUser[key] = updateUser[key];
    });

    // Step 3: Save the updated user to the database
    await loggedUser.save();

    res.status(200).json({
      message: `${loggedUser.firstName}, your profile updated successfully`,
      user: loggedUser
    });
    
  } catch (err) {
    console.error("❌ Profile update error:", err.message);
    res.status(400).json({
      message: "Profile update failed",
      error: err.message
    });
  }
});

// Export the router for use in the main application
module.exports = userRouter;

/**
 * USER MANAGEMENT FEATURES IMPLEMENTED:
 * 
 * 1. ✅ User Discovery:
 *    - Paginated user feed with connection filtering
 *    - Efficient database queries with field selection
 *    - Connection-based exclusion logic
 * 
 * 2. ✅ Connection Management:
 *    - Pending connection requests
 *    - Accepted connections
 *    - User relationship tracking
 * 
 * 3. ✅ Profile Management:
 *    - Secure password updates
 *    - Profile information updates
 *    - Input validation and sanitization
 * 
 * 4. ✅ Security Features:
 *    - Authentication required for all routes
 *    - Password strength validation
 *    - Field-level update restrictions
 * 
 * PRODUCTION ENHANCEMENTS NEEDED:
 * 
 * 1. 🔒 Enhanced Security:
 *    - Rate limiting for connection requests
 *    - Input sanitization for XSS prevention
 *    - Audit logging for profile changes
 * 
 * 2. 🔒 Performance Optimization:
 *    - Database indexing for connection queries
 *    - Caching for frequently accessed data
 *    - Connection pooling optimization
 * 
 * 3. 🔒 Feature Enhancements:
 *    - User blocking functionality
 *    - Connection request expiration
 *    - User preference matching
 *    - Notification system for connections
 * 
 * 4. 🔒 Data Privacy:
 *    - User privacy settings
 *    - Data anonymization options
 *    - GDPR compliance features
 */
