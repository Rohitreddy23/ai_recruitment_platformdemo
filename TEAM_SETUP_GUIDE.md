# AI Recruitment Platform - Team Setup Guide

## 🚀 Quick Start for Team Members

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ai-recruitment-platform
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, frontend)
npm run install:all
```

### 3. Environment Setup
```bash
# Copy environment template
cd backend
cp .env.example .env
```

**Edit `backend/.env` file:**
```env
PORT=5001
JWT_SECRET=ai_recruitment_platform_secret_key_2024
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** The app works without OpenAI API key using mock AI service

### 4. Start the Application
```bash
# From root directory - starts both frontend and backend
npm run dev
```

**Or start separately:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 5. Access the Application
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5001

## 🧪 Testing the Application

### Sample Login Credentials
- **Recruiter:** hr@techcorp.com / recruiter123
- **Recruiter:** hiring@startupxyz.com / recruiter123
- **Recruiter:** talent@datacorp.com / recruiter123

### Test Scenarios
1. **Browse Jobs:** Visit http://localhost:3001/jobs (8 sample jobs available)
2. **Register as Candidate:** Test application flow with resume upload
3. **Login as Recruiter:** View dashboard with candidate analytics
4. **Market Insights:** Check candidate market insights dashboard

## 📊 Key Features

### For Recruiters
- ✅ **Weighted Scoring System** based on experience levels
- ✅ **Comprehensive Analytics Dashboard** 
- ✅ **Detailed Candidate Profiles** with AI insights
- ✅ **Application Status Tracking**
- ✅ **Interactive Scoring Explanations**

### For Candidates  
- ✅ **Market Insights Dashboard** with salary benchmarking
- ✅ **Job Market Trends** and skills analysis
- ✅ **AI Resume Analysis** with detailed feedback
- ✅ **Skill Assessments** for eligible candidates

### Scoring System
- **Entry Level:** 70% Resume + 30% Test
- **Mid Level:** 40% Resume + 60% Test
- **Senior Level:** 30% Resume + 70% Test  
- **Lead Level:** 25% Resume + 75% Test

## 🏗️ Project Structure
```
ai-recruitment-platform/
├── backend/                 # Express.js API server
│   ├── routes/             # API endpoints
│   ├── database/           # SQLite database & seed data
│   ├── middleware/         # Auth, security, validation
│   ├── services/           # AI service, utilities
│   └── utils/              # Score calculator, helpers
├── frontend/               # Next.js React application
│   ├── pages/              # Application pages
│   ├── components/         # Reusable components
│   ├── context/            # Auth context
│   └── utils/              # API utilities
└── docs/                   # Documentation
```

## 🔧 Development Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only  
cd frontend && npm run dev

# Seed database with sample data
cd backend && npm run seed
```

## 🗄️ Database

- **Type:** SQLite (file-based, no setup required)
- **Location:** `backend/database/recruitment.db`
- **Sample Data:** Automatically loaded on first run
- **Tables:** users, jobs, applications, test_results

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (candidate/recruiter)
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints

## 🧩 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs & Applications
- `GET /api/jobs` - Get all jobs
- `POST /api/applications/apply` - Submit application
- `GET /api/applications/recruiter/all` - Get recruiter applications

### Insights & Analytics
- `GET /api/insights/market` - Market insights for candidates
- `GET /api/insights/recruiter/:id` - Recruiter analytics

## 🐛 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's running on ports
lsof -i :3001
lsof -i :5001
```

**Database issues:**
```bash
# Reset database
cd backend
rm database/recruitment.db
npm run dev  # Will recreate with sample data
```

**Dependencies issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json  
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 📞 Support

For questions or issues:
1. Check this setup guide
2. Review the main README.md
3. Check ERD_ALIGNMENT_SUMMARY.md for technical details
4. Contact the development team

---

**Happy coding! 🚀**