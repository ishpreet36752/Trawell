/**
 * Matches and Connection Management Routes
 * 
 * This module handles the core matching functionality of the Trawell application:
 * - Sending connection requests (like/pass)
 * - Reviewing and responding to connection requests (accept/reject)
 * - Managing user interactions and relationships
 * 
 * The matching system works like a dating app where users can:
 * 1. Express interest in other users (like)
 * 2. Decline interest in other users (pass)
 * 3. Accept connection requests from interested users
 * 4. Reject connection requests from interested users
 * 
 * SECURITY FEATURES:
 * - Authentication required for all operations
 * - User validation before processing requests
 * - Prevention of duplicate requests
 * - Proper authorization checks
 */

const express = require("express");
const { userAuth } = require("../middlewares/auth.js");           // Authentication middleware
const User = require("../models/user.js");                       // User model for validation
const ConnectionRequest = require("../models/connectionRequest.js"); // Connection request model
const matchesRouter = express.Router();                          // Express router instance

/**
 * POST /request/send/:status/:toUserId - Send Connection Request
 * 
 * This endpoint allows users to send connection requests to other users.
 * Users can either "like" (express interest) or "pass" (decline interest) on other users.
 * 
 * @route POST /request/send/:status/:toUserId
 * @middleware userAuth - Requires authentication
 * @param {string} status - The action to take: "like" or "pass"
 * @param {string} toUserId - ID of the user to send the request to
 * 
 * @returns {Object} Success message and connection request data
 * 
 * BUSINESS LOGIC:
 * 1. Validate the requested status (like/pass only)
 * 2. Verify the target user exists
 * 3. Check for existing connection requests (prevent duplicates)
 * 4. Create and save the connection request
 * 5. Return appropriate response message
 * 
 * @example
 * POST /request/send/like/507f1f77bcf86cd799439011
 * // Sends a "like" request to user with ID 507f1f77bcf86cd799439011
 */
matchesRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // Extract data from request parameters and authenticated user
      const fromUserId = req.user._id;        // ID of the user sending the request
      const toUserId = req.params.toUserId;   // ID of the user receiving the request
      const status = req.params.status;       // Action: "like" or "pass"

      // Step 1: Validate the status parameter
      // Only "like" and "pass" are allowed for initial requests
      const allowedStatus = ["like", "pass"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status. Only 'like' or 'pass' are allowed");
      }

      // Step 2: Verify the target user exists in the database
      const findToUserId = await User.findById(toUserId);
      if (!findToUserId) {
        return res.status(404).json({ 
          message: "User not found",
          error: "USER_NOT_FOUND"
        });
      }

      // Step 3: Check for existing connection requests to prevent duplicates
      // This prevents users from sending multiple requests to the same person
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,    // Request from current user to target user
            toUserId,
          },
          {
            fromUserId: toUserId,    // Request from target user to current user
            toUserId: fromUserId,
          },
        ],
      });
      
      if (existingRequest) {
        return res.status(400).json({ 
          message: "A connection request already exists between these users",
          error: "DUPLICATE_REQUEST"
        });
      }

      // Step 4: Create and save the new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,    // Who sent the request
        toUserId,      // Who received the request
        status,        // The action taken (like/pass)
      });
      
      const data = await connectionRequest.save();
      console.log(`🔗 Connection request created: ${status} from ${req.user.firstName} to ${findToUserId.firstName}`);

      // Step 5: Generate appropriate response message based on status
      let message;
      if (status === "like") {
        message = `${req.user.firstName} is interested in connecting with ${findToUserId.firstName}`;
      } else if (status === "pass") {
        message = `${req.user.firstName} has passed on connecting with ${findToUserId.firstName}`;
      }

      // Step 6: Send success response
      res.status(201).json({
        message: message,
        data: data,
        status: status,
        fromUser: {
          firstName: req.user.firstName,
          lastName: req.user.lastName
        },
        toUser: {
          firstName: findToUserId.firstName,
          lastName: findToUserId.lastName
        }
      });
      
    } catch (err) {
      console.error("❌ Send connection request error:", err.message);
      res.status(400).json({
        message: "Failed to send connection request",
        error: err.message
      });
    }
  }
);

/**
 * POST /request/review/:status/:requestId - Review Connection Request
 * 
 * This endpoint allows users to respond to connection requests they have received.
 * Users can either "accept" or "reject" requests that have a status of "like".
 * 
 * @route POST /request/review/:status/:requestId
 * @middleware userAuth - Requires authentication
 * @param {string} status - The response: "accept" or "reject"
 * @param {string} requestId - ID of the connection request to review
 * 
 * @returns {Object} Success message and updated connection request data
 * 
 * BUSINESS LOGIC:
 * 1. Validate the response status (accept/reject only)
 * 2. Find the connection request by ID
 * 3. Verify the request belongs to the authenticated user
 * 4. Ensure the request status is "like" (pending)
 * 5. Update the request status and save
 * 6. Return confirmation message
 * 
 * @example
 * POST /request/review/accept/507f1f77bcf86cd799439011
 * // Accepts the connection request with ID 507f1f77bcf86cd799439011
 */
matchesRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // Extract data from request parameters and authenticated user
      const loggedUser = req.user;                    // The user reviewing the request
      const { status, requestId } = req.params;       // Response status and request ID

      // Step 1: Validate the response status
      // Only "accept" and "reject" are allowed for reviewing requests
      const isAllowedStatus = ["accept", "reject"];
      if (!isAllowedStatus.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Only 'accept' or 'reject' are allowed",
          error: "INVALID_STATUS"
        });
      }

      // Step 2: Find the connection request to review
      // Multiple conditions must be met:
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,                    // Request ID must match
        toUserId: loggedUser._id,          // Request must be sent TO the logged-in user
        status: "like",                    // Request must have "like" status (pending)
      });

      // Step 3: Verify the connection request exists and belongs to the user
      if (!connectionRequest) {
        return res.status(400).json({ 
          message: "Connection request not found or you are not authorized to review it",
          error: "REQUEST_NOT_FOUND"
        });
      }

      // Step 4: Get the sender's information for the response message
      const fromUser = await User.findById(connectionRequest.fromUserId).select(
        "firstName lastName"
      );

      // Step 5: Update the connection request status
      connectionRequest.status = status;  // Change from "like" to "accept" or "reject"
      
      // Step 6: Save the updated request
      const data = await connectionRequest.save();
      console.log(`🔗 Connection request ${status}ed: ${loggedUser.firstName} ${status}ed request from ${fromUser.firstName}`);

      // Step 7: Send success response with appropriate message
      res.status(200).json({
        message: `${loggedUser.firstName} ${status}ed the connection request from ${fromUser.firstName}`,
        data: data,
        status: status,
        fromUser: {
          firstName: fromUser.firstName,
          lastName: fromUser.lastName
        },
        toUser: {
          firstName: loggedUser.firstName,
          lastName: loggedUser.lastName
        }
      });
      
    } catch (err) {
      console.error("❌ Review connection request error:", err.message);
      res.status(400).json({
        message: "Failed to review connection request",
        error: err.message
      });
    }
  }
);

// Export the router for use in the main application
module.exports = matchesRouter;

/**
 * MATCHING SYSTEM OVERVIEW:
 * 
 * 1. 🔍 DISCOVERY PHASE:
 *    - Users browse potential travel companions in their feed
 *    - Feed excludes users they've already interacted with
 *    - Pagination ensures efficient loading
 * 
 * 2. 💝 INTEREST EXPRESSION:
 *    - Users can "like" users they're interested in
 *    - Users can "pass" on users they're not interested in
 *    - Each action creates a connection request record
 * 
 * 3. 🤝 CONNECTION REVIEW:
 *    - Users receive notifications of "like" requests
 *    - They can accept (mutual connection) or reject
 *    - Accepted requests create mutual connections
 * 
 * 4. 🔗 CONNECTION MANAGEMENT:
 *    - Mutual connections allow users to communicate
 *    - Connection history is maintained for future reference
 *    - Users can view their connections and pending requests
 * 
 * SECURITY FEATURES IMPLEMENTED:
 * 
 * 1. ✅ Authentication Required:
 *    - All endpoints require valid JWT tokens
 *    - Users can only act on their own behalf
 * 
 * 2. ✅ Request Validation:
 *    - Status parameters are validated against allowed values
 *    - Target users are verified to exist
 *    - Duplicate requests are prevented
 * 
 * 3. ✅ Authorization Checks:
 *    - Users can only review requests sent to them
 *    - Request ownership is verified before updates
 * 
 * 4. ✅ Data Integrity:
 *    - Connection requests maintain referential integrity
 *    - Status transitions are controlled and validated
 * 
 * PRODUCTION ENHANCEMENTS NEEDED:
 * 
 * 1. 🔒 Rate Limiting:
 *    - Limit connection requests per user per day
 *    - Prevent spam and abuse
 * 
 * 2. 🔒 Enhanced Security:
 *    - Request expiration for old "like" requests
 *    - User blocking functionality
 *    - Report inappropriate behavior
 * 
 * 3. 🔒 Performance Optimization:
 *    - Database indexing for connection queries
 *    - Caching for frequently accessed user data
 *    - Pagination for large connection lists
 * 
 * 4. 🔒 User Experience:
 *    - Push notifications for new requests
 *    - Email notifications for important events
 *    - Connection request reminders
 * 
 * 5. 🔒 Analytics and Monitoring:
 *    - Track connection success rates
 *    - Monitor user engagement patterns
 *    - Identify potential matching improvements
 * 
 * DATABASE RELATIONSHIPS:
 * 
 * ConnectionRequest Schema:
 * - fromUserId: References User (who sent the request)
 * - toUserId: References User (who received the request)
 * - status: String (like, pass, accept, reject)
 * - timestamps: Created and updated timestamps
 * 
 * User Schema:
 * - _id: Unique identifier
 * - firstName, lastName: User's name
 * - Other profile information
 * 
 * The system creates a many-to-many relationship between users
 * through the ConnectionRequest model, allowing for complex
 * social interactions and relationship tracking.
 */
