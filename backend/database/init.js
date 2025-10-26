const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'recruitment.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table (both candidates and recruiters)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('candidate', 'recruiter')),
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Job postings table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      threshold_score INTEGER DEFAULT 70,
      recruiter_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recruiter_id) REFERENCES users (id)
    )
  `);

  // Applications table
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      candidate_email TEXT NOT NULL,
      candidate_name TEXT NOT NULL,
      candidate_phone TEXT,
      resume_path TEXT,
      ai_score INTEGER,
      test_score INTEGER,
      ai_insights TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'eligible', 'not_eligible', 'test_completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs (id)
    )
  `);

  // Test results table
  db.run(`
    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      answers TEXT NOT NULL,
      score INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications (id)
    )
  `);

  // Seed database with sample data
  setTimeout(() => {
    // Check if we need to seed data (only if no jobs exist)
    db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
      if (!err && row.count === 0) {
        console.log('Seeding database with sample data...');
        seedSampleData();
      }
    });
  }, 1000);
});

const seedSampleData = async () => {
  const bcrypt = require('bcryptjs');
  
  // Create sample recruiters
  const recruiters = [
    { id: 1, email: 'hr@techcorp.com', name: 'Tech Corp HR' },
    { id: 2, email: 'hiring@startupxyz.com', name: 'StartupXYZ Hiring' },
    { id: 3, email: 'talent@datacorp.com', name: 'DataCorp Talent' }
  ];

  const hashedPassword = await bcrypt.hash('recruiter123', 10);

  recruiters.forEach(recruiter => {
    db.run(
      'INSERT OR IGNORE INTO users (id, email, password, role, name) VALUES (?, ?, ?, ?, ?)',
      [recruiter.id, recruiter.email, hashedPassword, 'recruiter', recruiter.name],
      (err) => {
        if (!err) console.log(`Created recruiter: ${recruiter.name}`);
      }
    );
  });

  // Create sample jobs
  const sampleJobs = [
    {
      id: 1, title: 'Senior Software Developer', recruiter_id: 1, threshold_score: 75,
      description: 'We are looking for an experienced software developer to join our dynamic team. You will be responsible for developing high-quality applications, collaborating with cross-functional teams, and mentoring junior developers.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development. Proficiency in JavaScript, React, Node.js, and SQL databases. Experience with cloud platforms (AWS/Azure).'
    },
    {
      id: 2, title: 'Frontend React Developer', recruiter_id: 1, threshold_score: 70,
      description: 'Join our frontend team to build amazing user interfaces and experiences. You will work closely with designers and backend developers to create responsive, accessible, and performant web applications.',
      requirements: 'Bachelor\'s degree in Computer Science, Web Development, or related field. 3+ years of experience with React.js and modern JavaScript (ES6+). Strong knowledge of HTML5, CSS3, and responsive design.'
    },
    {
      id: 3, title: 'Data Scientist', recruiter_id: 3, threshold_score: 80,
      description: 'We are seeking a talented Data Scientist to extract insights from complex datasets and drive data-driven decision making. You will work on machine learning models, statistical analysis, and data visualization.',
      requirements: 'Master\'s degree in Data Science, Statistics, Mathematics, or related field. 4+ years of experience in data analysis and machine learning. Proficiency in Python, pandas, numpy, scikit-learn, and SQL.'
    },
    {
      id: 4, title: 'Digital Marketing Manager', recruiter_id: 2, threshold_score: 65,
      description: 'Lead our digital marketing efforts to drive brand awareness, customer acquisition, and revenue growth. You will develop and execute comprehensive marketing strategies across multiple channels.',
      requirements: 'Bachelor\'s degree in Marketing, Business, or related field. 5+ years of experience in digital marketing. Proven track record with Google Ads, Facebook Ads, and other paid advertising platforms.'
    },
    {
      id: 5, title: 'Full Stack Developer', recruiter_id: 2, threshold_score: 75,
      description: 'We need a versatile full stack developer who can work on both frontend and backend systems. You will be involved in the entire development lifecycle, from planning and design to deployment.',
      requirements: 'Bachelor\'s degree in Computer Science or equivalent experience. 4+ years of full stack development experience. Proficiency in JavaScript/TypeScript, React, Node.js, and Express.'
    },
    {
      id: 6, title: 'Machine Learning Engineer', recruiter_id: 3, threshold_score: 85,
      description: 'Join our AI team to build and deploy machine learning models at scale. You will work on exciting projects involving natural language processing, computer vision, and predictive analytics.',
      requirements: 'Master\'s degree in Computer Science, Machine Learning, or related field. 3+ years of experience in machine learning and deep learning. Proficiency in Python, TensorFlow/PyTorch, and scikit-learn.'
    },
    {
      id: 7, title: 'UX/UI Designer', recruiter_id: 2, threshold_score: 70,
      description: 'Create intuitive and beautiful user experiences for our digital products. You will conduct user research, create wireframes and prototypes, and collaborate with developers.',
      requirements: 'Bachelor\'s degree in Design, HCI, or related field. 4+ years of UX/UI design experience. Proficiency in design tools (Figma, Sketch, Adobe Creative Suite). Strong portfolio demonstrating user-centered design process.'
    },
    {
      id: 8, title: 'DevOps Engineer', recruiter_id: 1, threshold_score: 80,
      description: 'Help us build and maintain robust, scalable infrastructure. You will work on automation, monitoring, and deployment pipelines to ensure our applications run smoothly.',
      requirements: 'Bachelor\'s degree in Computer Science, Engineering, or related field. 4+ years of DevOps/Infrastructure experience. Expertise in AWS/Azure cloud platforms. Proficiency with Docker, Kubernetes, and container orchestration.'
    }
  ];

  setTimeout(() => {
    sampleJobs.forEach(job => {
      db.run(
        'INSERT OR IGNORE INTO jobs (id, title, description, requirements, threshold_score, recruiter_id, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now", "-" || ? || " days"))',
        [job.id, job.title, job.description, job.requirements, job.threshold_score, job.recruiter_id, Math.floor(Math.random() * 30)],
        (err) => {
          if (!err) console.log(`Created job: ${job.title}`);
        }
      );
    });
  }, 1000);

  // Sample applications with detailed AI insights
  const applications = [
    {
      id: 1, job_id: 1, candidate_name: 'Sarah Johnson', candidate_email: 'sarah.johnson@email.com',
      candidate_phone: '+1-555-0123', ai_score: 87, test_score: 92, status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'JavaScript', category: 'programming', level: 'expert' },
          { skill: 'React', category: 'frontend', level: 'expert' },
          { skill: 'Node.js', category: 'backend', level: 'intermediate' }
        ],
        skill_gaps: [{ skill: 'TypeScript', category: 'programming', priority: 'medium' }],
        certifications: ['AWS Certified Developer'],
        education: { level: 'bachelors', field: 'computer science' },
        experience_years: 6,
        strengths: ['Strong frontend skills', 'Full-stack capabilities'],
        recommendations: ['Consider AWS certification'],
        industry_experience: ['fintech', 'saas']
      })
    },
    {
      id: 2, job_id: 2, candidate_name: 'Michael Chen', candidate_email: 'michael.chen@email.com',
      candidate_phone: '+1-555-0124', ai_score: 78, test_score: 85, status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'React', category: 'frontend', level: 'expert' },
          { skill: 'JavaScript', category: 'programming', level: 'intermediate' }
        ],
        skill_gaps: [{ skill: 'Redux', category: 'frontend', priority: 'high' }],
        certifications: ['Google Analytics Certified'],
        education: { level: 'bachelors', field: 'web development' },
        experience_years: 4,
        strengths: ['UI/UX focus', 'Modern React patterns'],
        recommendations: ['Learn Redux for state management'],
        industry_experience: ['e-commerce', 'startup']
      })
    },
    {
      id: 3, job_id: 3, candidate_name: 'Dr. Emily Rodriguez', candidate_email: 'emily.rodriguez@email.com',
      candidate_phone: '+1-555-0125', ai_score: 94, test_score: 88, status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'Python', category: 'programming', level: 'expert' },
          { skill: 'Machine Learning', category: 'data', level: 'expert' },
          { skill: 'SQL', category: 'database', level: 'expert' }
        ],
        skill_gaps: [{ skill: 'Deep Learning', category: 'data', priority: 'medium' }],
        certifications: ['Google Cloud ML Engineer', 'Coursera ML Specialization'],
        education: { level: 'phd', field: 'data science' },
        experience_years: 8,
        strengths: ['Advanced statistical knowledge', 'Research background'],
        recommendations: ['Explore deep learning frameworks'],
        industry_experience: ['healthcare', 'fintech']
      })
    },
    {
      id: 4, job_id: 1, candidate_name: 'David Kim', candidate_email: 'david.kim@email.com',
      candidate_phone: '+1-555-0127', ai_score: 65, test_score: null, status: 'not_eligible',
      ai_insights: JSON.stringify({
        skills_matched: [{ skill: 'JavaScript', category: 'programming', level: 'beginner' }],
        skill_gaps: [
          { skill: 'React', category: 'frontend', priority: 'high' },
          { skill: 'Node.js', category: 'backend', priority: 'high' }
        ],
        certifications: [],
        education: { level: 'bachelors', field: 'computer science' },
        experience_years: 1,
        strengths: ['Basic programming knowledge', 'Eager to learn'],
        recommendations: ['Gain more hands-on experience', 'Learn modern frameworks'],
        industry_experience: []
      })
    },
    {
      id: 5, job_id: 5, candidate_name: 'Lisa Wang', candidate_email: 'lisa.wang@email.com',
      candidate_phone: '+1-555-0128', ai_score: 81, test_score: 87, status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'JavaScript', category: 'programming', level: 'expert' },
          { skill: 'React', category: 'frontend', level: 'intermediate' },
          { skill: 'Node.js', category: 'backend', level: 'intermediate' }
        ],
        skill_gaps: [{ skill: 'TypeScript', category: 'programming', priority: 'medium' }],
        certifications: ['MongoDB Certified Developer'],
        education: { level: 'masters', field: 'computer science' },
        experience_years: 5,
        strengths: ['Full-stack capabilities', 'Modern tech stack'],
        recommendations: ['Add TypeScript to skill set'],
        industry_experience: ['startup', 'saas']
      })
    }
  ];

  // Insert applications after a delay to ensure jobs are created
  setTimeout(() => {
    applications.forEach(app => {
      const daysAgo = Math.floor(Math.random() * 7) + 1;
      db.run(
        `INSERT OR IGNORE INTO applications 
         (id, job_id, candidate_name, candidate_email, candidate_phone, ai_score, test_score, status, ai_insights, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))`,
        [app.id, app.job_id, app.candidate_name, app.candidate_email, app.candidate_phone, 
         app.ai_score, app.test_score, app.status, app.ai_insights, daysAgo],
        (err) => {
          if (!err) console.log(`Created application: ${app.candidate_name}`);
        }
      );
    });
  }, 2000);
};

module.exports = db;