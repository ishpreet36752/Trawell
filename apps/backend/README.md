# Trawell Backend API

A comprehensive Node.js backend API for the Trawell travel application, built with Express.js and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Complete CRUD operations for user profiles
- **Travel Matching**: Find travel companions and create groups
- **Booking System**: Handle travel bookings and packages
- **Chat System**: Real-time communication between users
- **Payment Integration**: Secure payment processing
- **Admin Panel**: Administrative controls and user management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: validator.js
- **CORS**: Cross-Origin Resource Sharing enabled

## 📁 Project Structure

```
src/
├── app.js              # Main application entry point
├── config/
│   └── database.js     # MongoDB connection configuration
├── middlewares/
│   └── auth.js         # JWT authentication middleware
├── models/             # MongoDB schema definitions
│   ├── user.js         # User model with validation
│   ├── group.js        # Group/travel group model
│   ├── connectionRequest.js # Connection requests model
│   └── ...
├── routes/             # API route definitions
│   ├── auth.js         # Authentication routes (login/signup)
│   ├── user.js         # User management routes
│   ├── matches.js      # Travel matching routes
│   ├── groups.js       # Group management routes
│   └── ...
└── utilis/
    └── validation.js   # Input validation utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Trawell_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Update database connection string in `src/config/database.js`
   - Set JWT secret key in environment variables

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on port 7777.

## 🔐 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### User Management
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account

### Travel Features
- `GET /matches` - Find travel companions
- `POST /groups` - Create travel groups
- `GET /groups` - Get user's groups

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration for frontend integration
- HTTP-only cookies for token storage

## 📝 Notes for Developers

This codebase follows Node.js best practices:
- **Middleware Pattern**: Authentication and validation middleware
- **MVC Architecture**: Models, Routes, and Controllers separation
- **Async/Await**: Modern JavaScript for handling asynchronous operations
- **Error Handling**: Comprehensive error handling throughout the application
- **Validation**: Input validation at both API and database levels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper comments
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
