/**
 * Trawell Backend - Main Application Entry Point
 * 
 * This file sets up the Express.js server with all necessary middleware,
 * routes, and database connection. It follows the MVC (Model-View-Controller)
 * pattern where routes handle the controller logic.
 * 
 * SECURITY NOTE: Environment variables are loaded first to ensure
 * sensitive configuration is available before any other operations.
 */

// Load environment variables from .env file FIRST (before any other imports)
require('dotenv').config();

// Import required Node.js modules and third-party packages
const express = require("express");           // Web framework for Node.js
const cookieParser = require("cookie-parser"); // Parse cookies from request headers
const connectDB = require("./config/database"); // Database connection function
const cors = require("cors");                 // Enable Cross-Origin Resource Sharing
const http=require("http");
const { Server } = require("socket.io");
const { socketAuth } = require("./middlewares/auth.js");
const Group = require("./models/group.js");
const Chat = require("./models/chats.js");
const Message = require("./models/message.js");
// Create Express application instance
const app = express();

// Create HTTP server using the Express app 
 const server=http.createServer(app);
// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173" || "*",
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
  },
});

// ✅ Connected users map
const connectedUsers = new Map();
io.use(socketAuth)
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.user._id}`);

  // Join all group rooms that user is part of
  socket.on("joinGroups", async () => {
    const groups = await Group.find({ "groupMembers.user": socket.user._id }).select("_id");
    groups.forEach(g => socket.join(g._id.toString()));
  });

  // Handle sending a message
  socket.on("sendGroupMessage", async ({ groupId, content }) => {
    try {
      if (!groupId || !content) return;

      // find or create chat record
      let chat = await Chat.findOne({ groupMeta: groupId, type: "group" });
      if (!chat) {
        chat = await Chat.create({
          type: "group",
          createdBy: socket.user._id,
          groupMeta: groupId,
          participants: [] // optional
        });
      }
      // create message
      const message = await Message.create({
        chatId: chat._id,
        sender: socket.user._id,
        content: content.trim(),
        messageType: "text"
      });

      // update last message on chat
      chat.lastMessage = message._id;
      await chat.save();
      // emit to all group members in that room
      io.to(groupId).emit("newGroupMessage", {
        _id: message._id,
        chatId: chat._id,
        sender: socket.user._id,
        content: message.content,
        createdAt: message.createdAt
      });

    } catch (err) {
      console.error("Error sending group message:", err.message);
      socket.emit("errorMessage", { error: err.message });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user._id}`);
  });
});



app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * This middleware allows the frontend (running on localhost:5173) to make
 * requests to this backend API. It's essential for web applications where
 * frontend and backend run on different ports/domains.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use environment variable with fallback
    credentials: true,                       // Allow cookies and authentication headers
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Allowed HTTP methods
  })
);

// Handle preflight requests for all routes (browser sends OPTIONS request before actual request)
app.options('*', cors());

/**
 * Middleware Configuration
 * 
 * These middleware functions process requests before they reach the route handlers.
 * Order matters - middleware is executed in the order they're added.
 */
app.use(express.json({limit:"16kb"}));                     // Parse JSON request bodies
app.use(express.urlencoded({ extended: true ,limit:"16kb"}));  // for  form-urlencoded
app.use(express.static("public"))  // '/public',
app.use(cookieParser());                     // Parse cookies from request headers

// Socket.io cookie parser middleware
io.use((socket, next) => {
  cookieParser()(socket.request, {}, (err) => {
    if (err) return next(err);
    socketAuth(socket, next);
  });
});



/**
 * Route Registration
 * 
 * Import and register different route modules. Each route file handles
 * a specific feature area of the application.
 */
const userRouter = require("./routes/user");       // User profile management routes
const matchesRouter = require("./routes/matches"); // Travel matching and companion finding
const groupRouter = require("./routes/groups"); 
const messageRouter=require("./routes/messages.js");   // Group creation and management

// Mount routes on the main application
// All routes from these modules will be accessible from the root path "/"
app.use("/", userRouter);      // e.g., GET /profile, PUT /profile
app.use("/", matchesRouter);   // e.g., GET /matches, POST /matches
app.use("/", groupRouter);   
app.use("/",messageRouter)  // e.g., GET /groups, POST /groups

/**
 * Database Connection and Server Startup
 * 
 * The application only starts listening for requests after successfully
 * connecting to the MongoDB database. This ensures data persistence
 * is available before accepting any requests.
 */
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB database successfully");
    
    // Get port from environment variable or use default
    const PORT = process.env.PORT || 7777;
    
    // Start the HTTP server on the configured port
    server.listen(PORT, () => {
      console.log("🚀 Server is running on port", PORT);
      console.log("📱 Frontend can connect at:", process.env.FRONTEND_URL || `http://localhost:${PORT}`);
      console.log("🌍 Environment:", process.env.NODE_ENV || "development");
    });
  })
  .catch((err) => {
    // If database connection fails, log the error and exit
    console.error("❌ Database connection failed:", err.message);
    console.error("💡 Please check your MongoDB connection string and network connectivity");
    console.error("💡 Ensure MONGODB_URI environment variable is set in your .env file");
    process.exit(1); // Exit the application with error code 1
  });

// Export the app instance for testing purposes
module.exports = {server,io, connectedUsers, app};
