# 🤝 Contributing to Trawell

Thank you for your interest in contributing to Trawell! We're excited to have you join our community of developers building the future of travel companionship.

## 🎯 **Hacktoberfest 2025**

We're participating in **Hacktoberfest 2025**! This is a perfect opportunity to contribute to an open-source project while earning some cool swag.

### 🏷️ **Hacktoberfest Guidelines**

- ✅ **6 valid pull requests** to any participating repository
- ✅ **Pull requests must be merged or labeled as `hacktoberfest-accepted`**
- ✅ **No spam or low-quality contributions**
- ✅ **Follow our contribution guidelines below**
- ✅ **Quality over quantity** - Focus on meaningful contributions

---

## 🚀 **Getting Started**

### 1. **Fork & Clone**

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/trawell-monorepo-work.git
cd trawell-monorepo-work

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/trawell-monorepo-work.git
```

### 2. **Set Up Development Environment**

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/backend/env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env

# Start development servers
npm run dev
```

### 3. **Find an Issue**

- 🔍 Browse our [Issues](https://github.com/yourusername/trawell-monorepo-work/issues)
- 🏷️ Look for labels: `good first issue`, `hacktoberfest`, `beginner-friendly`
- 💬 Comment on the issue to claim it
- ❓ Ask questions if you need clarification

---

## 📋 **Contribution Workflow**

### 1. **Create a Branch**

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 2. **Make Your Changes**

- 🎯 **Focus on one issue at a time**
- ✅ **Write clean, readable code**
- 📝 **Add comments for complex logic**
- 🧪 **Test your changes thoroughly**

### 3. **Commit Your Changes**

```bash
# Use conventional commit messages
git add .
git commit -m "feat: add user profile picture upload"
# or
git commit -m "fix: resolve authentication token expiration issue"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. **Push and Create Pull Request**

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

---

## 🎯 **Contribution Areas**

### 🎨 **Frontend (React + TailwindCSS)**

**Good for:** UI/UX enthusiasts, React developers, designers

**Technologies:** React, Vite, TailwindCSS, Redux Toolkit, Framer Motion

**Example Tasks:**
- Create new UI components
- Improve responsive design
- Add animations and micro-interactions
- Enhance user experience
- Fix UI bugs

### 🔧 **Backend (Node.js + Express)**

**Good for:** Backend developers, API enthusiasts

**Technologies:** Node.js, Express.js, MongoDB, JWT, bcrypt

**Example Tasks:**
- Add new API endpoints
- Implement business logic
- Optimize database queries
- Add input validation
- Enhance security features

### 🧪 **Testing**

**Good for:** QA engineers, testing enthusiasts

**Technologies:** Jest, Cypress, React Testing Library

**Example Tasks:**
- Write unit tests
- Add integration tests
- Create end-to-end tests
- Improve test coverage
- Set up CI/CD testing

### 📚 **Documentation**

**Good for:** Technical writers, beginners

**Technologies:** Markdown, JSDoc, Storybook

**Example Tasks:**
- Write API documentation
- Create user guides
- Add code comments
- Update README files
- Create tutorials

### 🔐 **Security & Authentication**

**Good for:** Security-focused developers

**Technologies:** JWT, bcrypt, OAuth, security best practices

**Example Tasks:**
- Implement OAuth providers
- Add rate limiting
- Enhance password policies
- Add two-factor authentication
- Security audit and fixes

---

## 📝 **Code Standards**

### **JavaScript/TypeScript**

```javascript
// ✅ Good
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Bad
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  return user;
};
```

### **React Components**

```jsx
// ✅ Good
const UserCard = ({ user, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(user.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <div className="mt-4 flex gap-2">
        <button 
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ❌ Bad
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
};
```

### **CSS/TailwindCSS**

```css
/* ✅ Good - Use Tailwind utility classes */
.user-card {
  @apply bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow;
}

/* ❌ Bad - Custom CSS when Tailwind can handle it */
.user-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
```

---

## 🧪 **Testing Guidelines**

### **Frontend Testing**

```javascript
// Example test for a React component
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from '../UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} onDelete={jest.fn()} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });
});
```

### **Backend Testing**

```javascript
// Example test for an API endpoint
const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('should return user when valid ID is provided', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);

    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  it('should return 404 when user not found', async () => {
    await request(app)
      .get('/api/users/999')
      .expect(404);
  });
});
```

---

## 🐛 **Bug Reports**

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** or error messages
5. **Environment details** (OS, browser, Node.js version)
6. **Code snippets** if relevant

**Bug Report Template:**
```markdown
## 🐛 Bug Description
Brief description of the bug.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
What you expected to happen.

## ❌ Actual Behavior
What actually happened.

## 📸 Screenshots
If applicable, add screenshots.

## 🖥️ Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js: [e.g. v16.14.0]

## 📝 Additional Context
Any other context about the problem.
```

---

## 💡 **Feature Requests**

When suggesting features, please include:

1. **Clear description** of the feature
2. **Use case** and benefits
3. **Proposed implementation** (if you have ideas)
4. **Alternative solutions** considered

**Feature Request Template:**
```markdown
## 💡 Feature Description
Brief description of the feature.

## 🎯 Use Case
Describe the problem this feature would solve.

## 💭 Proposed Solution
Describe your proposed solution.

## 🔄 Alternatives Considered
Describe any alternative solutions you've considered.

## 📋 Additional Context
Any other context or screenshots about the feature request.
```

---

## 🏷️ **Issue Labels**

We use the following labels to categorize issues:

### **Difficulty Levels**
- `good first issue` - Perfect for beginners
- `beginner-friendly` - Suitable for newcomers
- `intermediate` - Requires some experience
- `advanced` - Complex tasks for experienced developers

### **Issue Types**
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `question` - Questions or discussions
- `help wanted` - Extra attention needed

### **Hacktoberfest**
- `hacktoberfest` - Eligible for Hacktoberfest
- `hacktoberfest-accepted` - Accepted for Hacktoberfest

### **Areas**
- `frontend` - Frontend related
- `backend` - Backend related
- `ui/ux` - User interface/experience
- `testing` - Testing related
- `security` - Security related
- `performance` - Performance optimization

---

## 🎉 **Recognition**

### **Contributors Hall of Fame**

We recognize our contributors in several ways:

- 🌟 **GitHub Contributors** - Listed in our contributors section
- 🏆 **Monthly MVP** - Featured contributor of the month
- 📝 **Blog Posts** - Featured in our community blog
- 🎁 **Swag** - Trawell merchandise for top contributors
- 💼 **References** - Professional references for job applications

### **Contribution Levels**

- 🥉 **Bronze** - 1-3 contributions
- 🥈 **Silver** - 4-10 contributions  
- 🥇 **Gold** - 11-25 contributions
- 💎 **Diamond** - 25+ contributions

---

## 📞 **Getting Help**

### **Community Channels**

- 💬 **Discord** - Real-time chat with the community
- 🐦 **Twitter** - Follow for updates and announcements
- 📧 **Email** - Contact the maintainers directly
- 📖 **Documentation** - Check our comprehensive docs

### **Mentorship Program**

We offer mentorship for new contributors:

- 👨‍🏫 **Code Reviews** - Detailed feedback on your PRs
- 🎯 **Guidance** - Help choosing appropriate issues
- 📚 **Learning Resources** - Curated learning materials
- 🤝 **Pair Programming** - Work together on complex features

---

## 📄 **Code of Conduct**

### **Our Pledge**

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance
- Race, religion, sexual orientation

### **Expected Behavior**

- ✅ Use welcoming and inclusive language
- ✅ Be respectful of differing viewpoints
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards other community members

### **Unacceptable Behavior**

- ❌ Harassment, trolling, or inflammatory comments
- ❌ Personal attacks or political discussions
- ❌ Public or private harassment
- ❌ Publishing private information without permission
- ❌ Any conduct inappropriate in a professional setting

### **Enforcement**

Instances of unacceptable behavior can be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## 🎯 **Hacktoberfest Tips**

### **For Beginners**

1. **Start Small** - Look for `good first issue` labels
2. **Read Documentation** - Understand the project before contributing
3. **Ask Questions** - Don't hesitate to ask for help
4. **Test Thoroughly** - Make sure your changes work
5. **Be Patient** - Code reviews take time

### **For Experienced Developers**

1. **Mentor Others** - Help newcomers get started
2. **Review PRs** - Help maintain code quality
3. **Tackle Complex Issues** - Take on challenging problems
4. **Share Knowledge** - Write documentation and guides
5. **Lead by Example** - Follow best practices

---

## 🚀 **Ready to Contribute?**

1. **Star ⭐ this repository**
2. **Fork 🍴 the project**
3. **Find an issue** that interests you
4. **Create a branch** and start coding
5. **Submit a pull request**
6. **Join our community** and celebrate! 🎉

---

<div align="center">

### 🌍 **Let's build the future of travel together!**

**Questions? Join our [Discord](https://discord.gg/trawell) or open an issue!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/trawell-monorepo-work?style=social&label=Star)](https://github.com/yourusername/trawell-monorepo-work)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/trawell-monorepo-work?style=social&label=Fork)](https://github.com/yourusername/trawell-monorepo-work/fork)

**Happy Coding! 🚀**

</div>
