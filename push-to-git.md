# 🚀 Push to Git - Step by Step

## Option 1: Using the Setup Script (Recommended)

```bash
# Make script executable and run
chmod +x git-setup.sh
./git-setup.sh
```

## Option 2: Manual Git Setup

### Step 1: Initialize Git (if not done)
```bash
git init
```

### Step 2: Add all files
```bash
git add .
```

### Step 3: Create initial commit
```bash
git commit -m "🎉 Initial commit: AI Recruitment Platform with weighted scoring system"
```

### Step 4: Create GitHub Repository
1. Go to GitHub.com
2. Click "New Repository"
3. Name: `ai-recruitment-platform`
4. Description: `AI-powered recruitment platform with weighted scoring and market insights`
5. Keep it Public or Private (your choice)
6. Don't initialize with README (we already have one)
7. Click "Create Repository"

### Step 5: Connect to GitHub
```bash
# Replace <your-username> with your GitHub username
git remote add origin https://github.com/<your-username>/ai-recruitment-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Share with Team

### Send them:
1. **Repository URL**: `https://github.com/<your-username>/ai-recruitment-platform`
2. **Setup Guide**: Point them to `TEAM_SETUP_GUIDE.md`
3. **Sample Credentials**: 
   - Recruiter: hr@techcorp.com / recruiter123
   - Or they can register as candidates

### Team Setup Command:
```bash
git clone https://github.com/<your-username>/ai-recruitment-platform.git
cd ai-recruitment-platform
npm run install:all
cp backend/.env.example backend/.env
npm run dev
```

## What Your Team Will Get:

✅ **Complete AI Recruitment Platform**
✅ **Weighted Scoring System** (Entry: 70%R+30%T, Senior: 30%R+70%T)
✅ **8 Sample Jobs** ready to test
✅ **5 Sample Applications** with detailed insights
✅ **Market Insights Dashboard** for candidates
✅ **Advanced Recruiter Analytics** with visualizations
✅ **Interactive Scoring Explanations**
✅ **Comprehensive Documentation**

## Repository Structure They'll See:
```
ai-recruitment-platform/
├── 📁 backend/              # Express.js API
├── 📁 frontend/             # Next.js React app
├── 📄 README.md             # Main documentation
├── 📄 TEAM_SETUP_GUIDE.md   # Setup instructions
├── 📄 ERD_ALIGNMENT_SUMMARY.md # Technical details
├── 📄 DEPLOYMENT_CHECKLIST.md  # Deployment guide
└── 📄 SAMPLE_LOGINS.md      # Test credentials
```

---

**🎯 Your team will have everything they need to run and understand the application!**