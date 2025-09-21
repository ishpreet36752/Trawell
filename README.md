# 🌍 Trawell - Travel Companion Matching Platform

<div align="center">

![Trawell Logo](https://img.shields.io/badge/Trawell-Travel%20Companion-blue?style=for-the-badge&logo=earth&logoColor=white)

**Find your perfect travel companion and explore the world together!**

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-orange?style=for-the-badge&logo=digitalocean&logoColor=white)](https://hacktoberfest.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/trawell-monorepo-work)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

[🚀 Live Demo](#) | [📖 Documentation](#) | [🤝 Contributing](#contributing) | [🔒 Security](SECURITY.md) | [💬 Discord](#)

</div>

---

## 🎯 **What is Trawell?**

Trawell is a revolutionary **travel companion matching platform** that connects solo travelers, adventure seekers, and travel enthusiasts worldwide. Whether you're planning a backpacking trip through Europe, a solo adventure in Asia, or looking for someone to share costs on a road trip, Trawell helps you find the perfect travel buddy!

> 📖 **Want to understand our vision better?** Check out our detailed [Travel Companion Concept Document](TRAVEL_COMPANION_CONCEPT.md) to see exactly what we're building and why it matters!

### ✨ **Key Features**

- 🔍 **Smart Matching Algorithm** - Find compatible travel companions based on destinations, travel dates, interests, and budget
- 👥 **Trip-Based Matching** - Connect with travelers going to the same destinations on similar dates
- 💬 **Real-time Chat** - Communicate with potential travel partners before meeting
- 🎯 **Trip Planning** - Collaborative trip planning with shared itineraries
- 💳 **Cost Sharing** - Split accommodation, transportation, and activity costs
- 🛡️ **Safety & Verification** - Verified profiles, safety guidelines, and community reviews
- 📱 **Cross-Platform** - Web and mobile applications for travelers on the go
- 🌍 **Global Community** - Connect with travelers from around the world
- 🤖 **AI Itinerary** - AI-powered trip planning and recommendations

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   MongoDB       │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   Database      │
│   TailwindCSS   │    │   JWT Auth      │    │   Atlas Cloud   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ **Tech Stack**

#### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trawell-monorepo-work.git
   cd trawell-monorepo-work
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp apps/backend/env.example apps/backend/.env
   
   # Frontend
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:web      # Frontend on http://localhost:5173
   npm run dev:backend  # Backend on http://localhost:7777
   ```

---

## 🎯 **Hacktoberfest 2025 - Join Our Journey!**

<div align="center">

### 🎉 **We're participating in Hacktoberfest 2025!**

**Help us build the future of travel companionship!**

**🎯 Goal: 6 Pull Requests to earn your Hacktoberfest 2025 swag!**

</div>

### 🏆 **Why Contribute to Trawell?**

- 🌍 **Real Impact** - Help travelers worldwide find their perfect companions
- 🚀 **Modern Tech Stack** - Work with cutting-edge technologies
- 👥 **Welcoming Community** - Beginner-friendly with mentorship
- 🎁 **Recognition** - Get featured in our contributors hall of fame
- 📚 **Learning** - Improve your full-stack development skills
- 🏆 **Hacktoberfest 2025** - Earn your swag with just 6 quality PRs!

### 🎯 **Contribution Areas**

| Area | Difficulty | Technologies | Good For |
|------|------------|--------------|----------|
| 🎨 **UI/UX** | Beginner | React, TailwindCSS | Frontend enthusiasts |
| 🔧 **Backend API** | Intermediate | Node.js, Express, MongoDB | Backend developers |
| 🔐 **Authentication** | Intermediate | JWT, bcrypt | Security-focused devs |
| 📱 **Mobile Features** | Advanced | React Native, PWA | Mobile developers |
| 🤖 **AI Matching** | Advanced | ML, Algorithms | AI/ML engineers |
| 🧪 **Testing** | Beginner | Jest, Cypress | QA enthusiasts |
| 📚 **Documentation** | Beginner | Markdown, Guides | Technical writers |

---

## 🤝 **Contributing**

We welcome contributions from developers of all skill levels! Here's how to get started:

### 🚀 **Quick Contribution Guide**

1. **Fork the repository**
2. **Check out our [Issues](https://github.com/yourusername/trawell-monorepo-work/issues)** for Hacktoberfest tasks
3. **Look for labels**: `good first issue`, `hacktoberfest`, `beginner-friendly`
4. **Create a branch**: `git checkout -b feature/amazing-feature`
5. **Make your changes** and test them
6. **Submit a pull request**

### 📋 **Contribution Guidelines**

- ✅ Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- ✅ Read our [Contributing Guide](CONTRIBUTING.md)
- ✅ Use conventional commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed

### 🏷️ **Issue Labels**

- `good first issue` - Perfect for beginners
- `hacktoberfest` - Hacktoberfest eligible
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `help wanted` - Extra attention is needed

---

## 🎨 **Project Showcase**

### 🖼️ **Screenshots**

<div align="center">

| Landing Page | User Dashboard | Travel Matching |
|--------------|----------------|-----------------|
| ![Landing](https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/300x200/059669/FFFFFF?text=Dashboard) | ![Matching](https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Matching) |

</div>

### 🎬 **Demo Video**

[![Watch Demo](https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge&logo=youtube&logoColor=white)](#)

---

## 📊 **Project Stats**

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/yourusername/trawell-monorepo-work?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/trawell-monorepo-work?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/trawell-monorepo-work)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/trawell-monorepo-work)

</div>

---

## 🛣️ **Roadmap**

### 🎯 **Phase 1 - Core Features** (Current)
- [x] User authentication and profiles
- [x] Basic matching algorithm
- [x] Group creation and management
- [ ] Real-time chat system
- [ ] Travel planning tools

### 🚀 **Phase 2 - Enhanced Features**
- [ ] AI-powered matching
- [ ] Mobile application
- [ ] Payment integration
- [ ] Safety verification system
- [ ] Travel booking integration

### 🌟 **Phase 3 - Advanced Features**
- [ ] AR travel planning
- [ ] Blockchain-based trust system
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for third-party integrations

---

## 👥 **Team & Community**

### 🏆 **Core Team**
- **Ishpreet Singh** - Project Lead & Full-Stack Developer
- **Your Name** - [Add your role here!]

### 🌟 **Contributors**

<div align="center">

**Join our amazing contributors!**

[![Contributors](https://contrib.rocks/image?repo=yourusername/trawell-monorepo-work)](https://github.com/yourusername/trawell-monorepo-work/graphs/contributors)

</div>

### 💬 **Community**

- 💬 [Discord Server](#) - Chat with the community
- 🐦 [Twitter](#) - Follow for updates
- 📧 [Email](#) - Contact the team
- 📖 [Blog](#) - Read our latest posts

---

## 📄 **License**

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- Thanks to all our contributors who make Trawell possible
- Special thanks to the open-source community
- Inspired by the need for safe and fun travel companionship

---

<div align="center">

### 🌍 **Ready to make travel more social?**

**Star ⭐ this repository and join our Hacktoberfest journey!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/trawell-monorepo-work?style=social&label=Star)](https://github.com/yourusername/trawell-monorepo-work)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/trawell-monorepo-work?style=social&label=Fork)](https://github.com/yourusername/trawell-monorepo-work/fork)

**Made with ❤️ by the Trawell Community**

</div>
