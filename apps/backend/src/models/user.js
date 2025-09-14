/**
 * User Model - MongoDB Schema Definition
 * 
 * This file defines the User schema using Mongoose, which provides:
 * - Data structure definition with validation rules
 * - Pre-save middleware for password hashing
 * - Instance methods for JWT generation and password validation
 * - Automatic timestamp management
 * 
 * The schema follows MongoDB best practices and includes comprehensive
 * validation for user data integrity and security.
 */

const mongoose = require("mongoose");
const validator = require("validator"); // Email and password validation library
const jwt = require("jsonwebtoken");    // JWT token generation and verification
const bcrypt = require("bcrypt");       // Password hashing library

/**
 * User Schema Definition
 * 
 * Defines the structure and validation rules for user documents in MongoDB.
 * Each field has specific types, validation rules, and default values.
 */
const userSchema = new mongoose.Schema(
  {
    // User's first name - required field with length constraints
    firstName: {
      type: String,
      required: [true, "First name is required"], // Custom error message
      minLength: [4, "First name must be at least 4 characters long"],
      maxLength: [40, "First name cannot exceed 40 characters"],
      trim: true, // Automatically remove leading/trailing whitespace
    },
    
    // User's last name - optional field
    lastName: {
      type: String,
      default: "", // Default empty string if not provided
      trim: true,  // Remove whitespace
    },
    
    // User's email address - unique identifier for login
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,        // Ensures no duplicate emails in the database
      lowercase: true,     // Convert to lowercase for consistency
      trim: true,          // Remove whitespace
      validate: {
        // Custom validator using validator.js library
        validator: (value) => validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    
    // User's password - will be hashed before saving
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        // Ensure password meets security requirements
        validator: (value) => validator.isStrongPassword(value, {
          minLength: 8,           // Minimum 8 characters
          minLowercase: 1,        // At least 1 lowercase letter
          minUppercase: 1,        // At least 1 uppercase letter
          minNumbers: 1,          // At least 1 number
          minSymbols: 1,          // At least 1 special character
        }),
        message: "Password must be strong: minimum 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
      },
    },
    
    // User's age - must be 18 or older
    age: {
      type: Number,
      // required: true, // Commented out - age is optional
      min: [18, "User must be at least 18 years old"],
      validate: {
        // Custom validator to ensure age is a reasonable number
        validator: (value) => value >= 18 && value <= 120,
        message: "Age must be between 18 and 120 years",
      },
    },
    
    // User's gender - restricted to valid options
    gender: {
      type: String,
      // required: true, // Commented out - gender is optional
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be one of: male, female, or others",
      },
      lowercase: true, // Convert to lowercase for consistency
    },
    
    // User's profile picture URL
    image: {
      type: String,
      default: "https://www.iibsonline.com/public/testimonial/testimonial_image_full/183.png", // Default avatar
      validate: {
        // Ensure the image URL is valid
        validator: (value) => validator.isURL(value),
        message: "Please provide a valid image URL",
      },
    },
    
    // User's bio/description
    about: {
      type: String,
      maxLength: [300, "About section cannot exceed 300 characters"],
      trim: true, // Remove whitespace
    }
  },
  {
    // Schema options
    timestamps: true, // Automatically add createdAt and updatedAt fields
    // Additional options you might want to consider:
    // toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
    // toObject: { virtuals: true }, // Include virtual fields when converting to object
  }
);

/**
 * Pre-save Middleware (Hook)
 * 
 * This function runs BEFORE saving a user document to the database.
 * It's used to hash the password if it has been modified.
 * 
 * Middleware functions are powerful for:
 * - Data transformation (like password hashing)
 * - Validation
 * - Logging
 * - Pre-processing data
 */
userSchema.pre("save", async function (next) {
  // 'this' refers to the current document being saved
  
  // Only hash the password if it has been modified (new user or password change)
  if (this.isModified("password")) {
    try {
      // Hash password with salt rounds of 10 (higher = more secure but slower)
      this.password = await bcrypt.hash(this.password, 10);
      console.log("🔐 Password hashed successfully");
    } catch (error) {
      console.error("❌ Password hashing failed:", error);
      return next(error); // Pass error to next middleware
    }
  }
  
  // Call next() to continue with the save operation
  next();
});

/**
 * Instance Method: Generate JWT Token
 * 
 * This method creates a JSON Web Token for the user, which is used for:
 * - Authentication (proving the user is logged in)
 * - Authorization (determining what the user can access)
 * - Session management (keeping users logged in)
 * 
 * @returns {Promise<string>} JWT token string
 * 
 * @example
 * const user = new User({...});
 * const token = await user.getJWT();
 */
userSchema.methods.getJWT = async function () {
  const user = this; // 'this' refers to the user instance
  
  try {
    // Create JWT token with user ID as payload
    const token = await jwt.sign(
      { _id: user._id },           // Payload (data to encode in token)
      "Trawell@123$",              // Secret key (should be in environment variables)
      { expiresIn: "7d" }          // Token expiration (7 days)
    );
    
    return token;
  } catch (error) {
    console.error("❌ JWT generation failed:", error);
    throw new Error("Failed to generate authentication token");
  }
};

/**
 * Instance Method: Validate Password
 * 
 * This method compares a plain text password (from user input) with the
 * hashed password stored in the database. It's used during login to
 * verify the user's credentials.
 * 
 * @param {string} passwordByUser - Plain text password from user input
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 * 
 * @example
 * const user = await User.findOne({ emailId: "user@example.com" });
 * const isValid = await user.validatePassword("userPassword123");
 */
userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this; // 'this' refers to the user instance
  
  try {
    // Compare plain text password with stored hash
    const isValid = await bcrypt.compare(passwordByUser, user.password);
    return isValid;
  } catch (error) {
    console.error("❌ Password validation failed:", error);
    throw new Error("Password validation failed");
  }
};

/**
 * Virtual Fields (Optional Enhancement)
 * 
 * You can add virtual fields that are computed from other fields:
 * 
 * userSchema.virtual('fullName').get(function() {
 *   return `${this.firstName} ${this.lastName}`;
 * });
 * 
 * userSchema.virtual('isAdult').get(function() {
 *   return this.age >= 18;
 * });
 */

// Create and export the User model
// This creates a collection named 'users' in MongoDB (Mongoose pluralizes the model name)
module.exports = mongoose.model("User", userSchema);

/**
 * SECURITY BEST PRACTICES IMPLEMENTED:
 * 
 * 1. ✅ Password Hashing: Passwords are hashed using bcrypt before storage
 * 2. ✅ Input Validation: All user inputs are validated using validator.js
 * 3. ✅ JWT Tokens: Secure authentication using JSON Web Tokens
 * 4. ✅ Data Sanitization: Whitespace removal and case normalization
 * 5. ✅ Schema Validation: MongoDB-level validation for data integrity
 * 
 * PRODUCTION IMPROVEMENTS NEEDED:
 * 
 * 1. 🔒 Move JWT secret to environment variables
 * 2. 🔒 Add rate limiting for login attempts
 * 3. 🔒 Implement password reset functionality
 * 4. 🔒 Add email verification
 * 5. 🔒 Implement account lockout after failed attempts
 * 6. 🔒 Add audit logging for security events
 */
