#!/usr/bin/env node

/**
 * Script to create GitHub issues from HACKTOBERFEST_ISSUES.md
 * This script parses the markdown file and creates GitHub issues
 * 
 * Usage: node scripts/create-github-issues.js
 * 
 * Prerequisites:
 * 1. Set GITHUB_TOKEN environment variable
 * 2. Set GITHUB_REPO environment variable (format: owner/repo)
 */

const fs = require('fs');
const path = require('path');

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'yourusername/trawell-monorepo-work';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable is required');
  console.log('💡 Set it with: export GITHUB_TOKEN=your_github_token');
  process.exit(1);
}

const GITHUB_API = 'https://api.github.com';

// Priority issues to create first
const priorityIssues = [
  {
    title: '🚨 URGENT: Complete UI/UX Redesign',
    labels: ['urgent', 'frontend', 'ui/ux', 'hacktoberfest', 'high-priority'],
    difficulty: 'Intermediate',
    skills: 'React, TailwindCSS, UI/UX Design, Figma/Sketch',
    description: `## 🚨 URGENT: Complete UI/UX Redesign

**Priority**: CRITICAL - This will make or break the project!

### Description
The current UI/UX needs a complete overhaul. We need someone with strong design skills to rebuild the entire user interface with modern, travel-focused design principles.

### Files to Modify
- \`apps/web/src/components/\`
- \`apps/web/src/\`
- \`apps/web/tailwind.config.js\`

### Skills Needed
- React
- TailwindCSS
- UI/UX Design
- Figma/Sketch

### Acceptance Criteria
- [ ] Modern, travel-themed design
- [ ] Intuitive user experience
- [ ] Mobile-first responsive design
- [ ] Clear navigation and user flow
- [ ] Attractive visual elements

### Resources
- [Travel Companion Concept](TRAVEL_COMPANION_CONCEPT.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Design System Guidelines](README.md)

**This is our most critical need for Hacktoberfest 2025!**`
  },
  {
    title: '🚨 URGENT: Redesign Landing Page',
    labels: ['urgent', 'frontend', 'ui/ux', 'hacktoberfest', 'high-priority'],
    difficulty: 'Beginner-Intermediate',
    skills: 'React, TailwindCSS, UI/UX Design, Landing page design',
    description: `## 🚨 URGENT: Redesign Landing Page

**Priority**: CRITICAL - First impression matters!

### Description
The landing page needs a complete redesign to be more attractive and user-friendly. Create a modern, travel-themed landing page that showcases Trawell's features and attracts users.

### Files to Modify
- \`apps/web/src/components/Body.jsx\`
- \`apps/web/src/\`

### Skills Needed
- React
- TailwindCSS
- UI/UX Design
- Landing page design

### Acceptance Criteria
- [ ] Modern, travel-themed design
- [ ] Clear value proposition
- [ ] Call-to-action buttons
- [ ] Feature showcase
- [ ] Mobile responsive

### Resources
- [Travel Companion Concept](TRAVEL_COMPANION_CONCEPT.md)
- [Contributing Guide](CONTRIBUTING.md)

**Perfect for Hacktoberfest 2025!**`
  },
  {
    title: '🤖 AI Itinerary API Integration',
    labels: ['urgent', 'backend', 'ai', 'hacktoberfest', 'feature', 'high-priority'],
    difficulty: 'Intermediate',
    skills: 'Node.js, AI/ML APIs, OpenAI/Claude integration, Travel APIs',
    description: `## 🤖 AI Itinerary API Integration

**Priority**: HIGH - This is a key feature for Trawell!

### Description
Implement AI-powered itinerary generation API. Integrate with AI services to create personalized travel itineraries based on user preferences, budget, and interests.

### Files to Modify
- \`apps/backend/src/routes/\`
- \`apps/backend/src/\`

### Skills Needed
- Node.js
- AI/ML APIs
- OpenAI/Claude integration
- Travel APIs

### Acceptance Criteria
- [ ] AI API integration
- [ ] Personalized itinerary generation
- [ ] Budget consideration
- [ ] Interest-based recommendations
- [ ] API documentation

### Resources
- [Travel Companion Concept](TRAVEL_COMPANION_CONCEPT.md)
- [Contributing Guide](CONTRIBUTING.md)

**Core feature for travel companion matching!**`
  },
  {
    title: 'Add Loading States to Components',
    labels: ['good first issue', 'frontend', 'ui/ux', 'hacktoberfest'],
    difficulty: 'Beginner',
    skills: 'React, TailwindCSS',
    description: `## Add Loading States to Components

### Description
Add loading spinners and skeleton screens to improve user experience.

### Files to Modify
- \`apps/web/src/components/\`

### Skills Needed
- React
- TailwindCSS

### Acceptance Criteria
- [ ] Loading spinners for async operations
- [ ] Skeleton screens for content loading
- [ ] Smooth transitions
- [ ] Consistent design

### Resources
- [Contributing Guide](CONTRIBUTING.md)

**Perfect for beginners!**`
  },
  {
    title: 'Create Error Boundary Component',
    labels: ['good first issue', 'frontend', 'react', 'hacktoberfest'],
    difficulty: 'Beginner',
    skills: 'React, Error handling',
    description: `## Create Error Boundary Component

### Description
Implement React Error Boundary to catch and display errors gracefully.

### Files to Modify
- \`apps/web/src/components/\`

### Skills Needed
- React
- Error handling

### Acceptance Criteria
- [ ] Error boundary component
- [ ] Graceful error display
- [ ] Error logging
- [ ] User-friendly error messages

### Resources
- [Contributing Guide](CONTRIBUTING.md)

**Great for learning React error handling!**`
  }
];

// Function to create GitHub issue
async function createGitHubIssue(issue) {
  const url = `${GITHUB_API}/repos/${GITHUB_REPO}/issues`;
  
  const issueData = {
    title: issue.title,
    body: issue.description,
    labels: issue.labels
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Created issue: ${issue.title} (#${result.number})`);
      return result;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to create issue: ${issue.title}`);
      console.error(`Error: ${error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating issue: ${issue.title}`);
    console.error(error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Creating GitHub issues for Hacktoberfest 2025...\n');
  
  let successCount = 0;
  let totalCount = priorityIssues.length;

  for (const issue of priorityIssues) {
    const result = await createGitHubIssue(issue);
    if (result) {
      successCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully created: ${successCount}/${totalCount} issues`);
  
  if (successCount === totalCount) {
    console.log('🎉 All issues created successfully!');
    console.log('🔗 View them at: https://github.com/' + GITHUB_REPO + '/issues');
  } else {
    console.log('⚠️  Some issues failed to create. Check the errors above.');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createGitHubIssue, priorityIssues };
