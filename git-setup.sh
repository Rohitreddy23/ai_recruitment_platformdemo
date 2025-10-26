#!/bin/bash

# AI Recruitment Platform - Git Setup Script
echo "🚀 Setting up Git repository for AI Recruitment Platform..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: AI Recruitment Platform

✨ Features:
- Weighted scoring system based on experience levels
- AI-powered resume parsing and analysis
- Comprehensive recruiter analytics dashboard
- Market insights for candidates
- Role-specific skill assessments
- ERD-compliant database design

🏗️ Tech Stack:
- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: SQLite
- AI: OpenAI integration with fallback
- Auth: JWT with role-based access

🎯 Ready for team collaboration!"

echo "✅ Git repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create repository on GitHub/GitLab"
echo "2. Add remote: git remote add origin <your-repo-url>"
echo "3. Push code: git push -u origin main"
echo ""
echo "🔗 Share with team using TEAM_SETUP_GUIDE.md"