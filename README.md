# 🤖 AI Recruitment Platform

A comprehensive full-stack web application that revolutionizes the hiring process using AI-powered resume parsing, weighted skill assessments, and intelligent candidate matching.

## ✨ Key Features

### 🎯 For Recruiters
- **Weighted Scoring System** - Experience-level based composite scoring (Entry: 70%R+30%T, Senior: 30%R+70%T)
- **Advanced Analytics Dashboard** - Comprehensive candidate insights with visualizations
- **AI-Powered Resume Analysis** - Automated skill extraction and compatibility scoring
- **Interactive Score Explanations** - Transparent scoring methodology
- **Application Status Tracking** - Real-time candidate pipeline management

### 📊 For Candidates  
- **Market Insights Dashboard** - Salary benchmarking, job trends, skills demand analysis
- **AI Resume Feedback** - Detailed analysis with skill matching and gap identification
- **Skill Assessments** - Role-specific tests for eligible candidates
- **Career Recommendations** - Personalized insights and growth suggestions

## 🏗️ Architecture & Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js, RESTful APIs
- **Database**: SQLite with comprehensive schema
- **AI Integration**: OpenAI API with intelligent fallback system
- **Authentication**: JWT-based with role-based access control
- **File Processing**: PDF resume parsing with security validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm/yarn
- Git

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd ai-recruitment-platform

# Install all dependencies
npm run install:all

# Setup environment
cd backend && cp .env.example .env
# Edit .env with your configuration

# Start application
npm run dev
```

### Access Points
- **Application**: http://localhost:3001
- **API**: http://localhost:5001

## 🧪 Demo & Testing

### Sample Credentials
```
Recruiters:
- hr@techcorp.com / recruiter123
- hiring@startupxyz.com / recruiter123
- talent@datacorp.com / recruiter123
```

### Test Scenarios
1. **Job Browsing**: 8 pre-loaded job positions with varying requirements
2. **Application Flow**: Upload resume → AI analysis → Eligibility check → Skill test
3. **Recruiter Analytics**: Weighted scoring, candidate ranking, market insights
4. **Market Intelligence**: Salary benchmarking, skills demand, industry trends

## 📈 Intelligent Scoring System

### Experience-Based Weightage
| Level | Resume Weight | Test Weight | Focus |
|-------|---------------|-------------|-------|
| Entry | 70% | 30% | Potential & Education |
| Mid | 40% | 60% | Balanced Evaluation |
| Senior | 30% | 70% | Practical Skills |
| Lead | 25% | 75% | Leadership & Expertise |

### Smart Detection
- **Job Title Analysis**: Automatic experience level detection
- **Years of Experience**: Fallback classification system
- **Dynamic Thresholds**: Role-appropriate evaluation criteria

## 🗄️ Database Design

### Core Tables
- **candidate_table**: Candidate profiles and contact information
- **job_role_table**: Job postings with threshold configurations
- **resume_analysis_table**: AI analysis results and skill matching
- **assessment_table**: Test results and performance metrics
- **recruiter_decision_table**: Final hiring decisions with composite scores

### ERD Compliance
Fully aligned with provided Entity Relationship Diagram including:
- Proper foreign key relationships
- Weighted composite scoring
- Experience level considerations
- Comprehensive audit trail

## 🔧 API Documentation

### Core Endpoints
```
Authentication:
POST /api/auth/register - User registration
POST /api/auth/login - User authentication

Jobs & Applications:
GET /api/jobs - Browse available positions
POST /api/applications/apply - Submit application
GET /api/applications/recruiter/all - Recruiter applications

Analytics & Insights:
GET /api/insights/market - Market intelligence
GET /api/insights/recruiter/:id - Recruiter analytics

ERD Compliant:
GET /api/erd/candidates - Weighted candidate ranking
POST /api/erd/decision - Hiring decisions
GET /api/erd/weightage/:roleId - Scoring configuration
```

## 🛡️ Security Features

- **JWT Authentication** with role-based access control
- **Input Validation** using Joi schemas
- **Rate Limiting** on sensitive endpoints
- **Password Hashing** with bcrypt
- **File Upload Security** with type validation
- **SQL Injection Protection** with parameterized queries

## 📊 Sample Data

### Pre-loaded Content
- **8 Job Positions**: Diverse roles across tech, data, marketing
- **5 Candidate Applications**: Various experience levels and scores
- **3 Recruiter Accounts**: Different company profiles
- **Market Data**: Salary benchmarks, skills trends, industry insights

## 🔄 Development Workflow

### Available Scripts
```bash
npm run install:all    # Install all dependencies
npm run dev           # Start both servers
npm run seed          # Populate sample data
```

### Project Structure
```
ai-recruitment-platform/
├── backend/          # Express.js API
│   ├── routes/       # API endpoints
│   ├── database/     # SQLite & migrations
│   ├── middleware/   # Auth, validation, security
│   ├── services/     # AI integration
│   └── utils/        # Score calculator, helpers
├── frontend/         # Next.js application
│   ├── pages/        # Application routes
│   ├── components/   # Reusable UI components
│   ├── context/      # State management
│   └── utils/        # API client, utilities
└── docs/            # Documentation
```

## 🤝 Team Collaboration

### For Team Members
1. **Clone & Setup**: Follow TEAM_SETUP_GUIDE.md
2. **Development**: Create feature branches
3. **Testing**: Use provided sample data and credentials
4. **Documentation**: Update relevant docs with changes

### Contribution Guidelines
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📚 Documentation

- **TEAM_SETUP_GUIDE.md**: Complete setup instructions for team members
- **ERD_ALIGNMENT_SUMMARY.md**: Technical database design and scoring logic
- **SAMPLE_LOGINS.md**: Test credentials and demo scenarios

## 🐛 Troubleshooting

### Common Issues
- **Port Conflicts**: Check ports 3001, 5001 availability
- **Database Reset**: Delete `backend/database/recruitment.db` and restart
- **Dependencies**: Run `npm run install:all` for clean installation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI integration capabilities
- Next.js and React communities
- Express.js ecosystem contributors

---

**Built with ❤️ for modern recruitment challenges**

*Ready to revolutionize your hiring process? Get started in minutes!* 🚀