const db = require('./init');
const bcrypt = require('bcryptjs');

const seedDatabase = () => {
  // Create sample recruiter accounts
  const sampleRecruiters = [
    {
      name: 'Tech Corp HR',
      email: 'hr@techcorp.com',
      password: 'recruiter123',
      role: 'recruiter'
    },
    {
      name: 'StartupXYZ Hiring',
      email: 'hiring@startupxyz.com',
      password: 'recruiter123',
      role: 'recruiter'
    },
    {
      name: 'DataCorp Talent',
      email: 'talent@datacorp.com',
      password: 'recruiter123',
      role: 'recruiter'
    }
  ];

  // Create sample jobs
  const sampleJobs = [
    {
      title: 'Senior Software Developer',
      description: 'We are looking for an experienced software developer to join our dynamic team. You will be responsible for developing high-quality applications, collaborating with cross-functional teams, and mentoring junior developers. This role offers excellent growth opportunities and the chance to work with cutting-edge technologies.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development. Proficiency in JavaScript, React, Node.js, and SQL databases. Experience with cloud platforms (AWS/Azure). Strong problem-solving skills and ability to work in an agile environment. Knowledge of Git version control and CI/CD pipelines.',
      threshold_score: 75,
      recruiter_id: 1
    },
    {
      title: 'Frontend React Developer',
      description: 'Join our frontend team to build amazing user interfaces and experiences. You will work closely with designers and backend developers to create responsive, accessible, and performant web applications. We value clean code, attention to detail, and user-centric thinking.',
      requirements: 'Bachelor\'s degree in Computer Science, Web Development, or related field. 3+ years of experience with React.js and modern JavaScript (ES6+). Strong knowledge of HTML5, CSS3, and responsive design. Experience with state management (Redux/Context API). Familiarity with testing frameworks (Jest, React Testing Library). Understanding of web performance optimization and accessibility standards.',
      threshold_score: 70,
      recruiter_id: 1
    },
    {
      title: 'Data Scientist',
      description: 'We are seeking a talented Data Scientist to extract insights from complex datasets and drive data-driven decision making. You will work on machine learning models, statistical analysis, and data visualization to solve business problems and identify growth opportunities.',
      requirements: 'Master\'s degree in Data Science, Statistics, Mathematics, or related field. 4+ years of experience in data analysis and machine learning. Proficiency in Python, pandas, numpy, scikit-learn, and SQL. Experience with data visualization tools (matplotlib, seaborn, Tableau). Knowledge of statistical methods and A/B testing. Experience with cloud platforms and big data technologies is a plus.',
      threshold_score: 80,
      recruiter_id: 3
    },
    {
      title: 'Digital Marketing Manager',
      description: 'Lead our digital marketing efforts to drive brand awareness, customer acquisition, and revenue growth. You will develop and execute comprehensive marketing strategies across multiple channels including social media, email, content marketing, and paid advertising.',
      requirements: 'Bachelor\'s degree in Marketing, Business, or related field. 5+ years of experience in digital marketing. Proven track record with Google Ads, Facebook Ads, and other paid advertising platforms. Strong analytical skills and experience with marketing analytics tools (Google Analytics, HubSpot). Excellent written and verbal communication skills. Experience with content management systems and email marketing platforms.',
      threshold_score: 65,
      recruiter_id: 2
    },
    {
      title: 'Full Stack Developer',
      description: 'We need a versatile full stack developer who can work on both frontend and backend systems. You will be involved in the entire development lifecycle, from planning and design to deployment and maintenance. This is a great opportunity to work with modern technologies and make a significant impact.',
      requirements: 'Bachelor\'s degree in Computer Science or equivalent experience. 4+ years of full stack development experience. Proficiency in JavaScript/TypeScript, React, Node.js, and Express. Experience with databases (PostgreSQL, MongoDB). Knowledge of RESTful APIs and GraphQL. Familiarity with Docker, AWS, and DevOps practices. Strong understanding of software architecture and design patterns.',
      threshold_score: 75,
      recruiter_id: 2
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Join our AI team to build and deploy machine learning models at scale. You will work on exciting projects involving natural language processing, computer vision, and predictive analytics. We offer a collaborative environment with access to cutting-edge tools and technologies.',
      requirements: 'Master\'s degree in Computer Science, Machine Learning, or related field. 3+ years of experience in machine learning and deep learning. Proficiency in Python, TensorFlow/PyTorch, and scikit-learn. Experience with MLOps, model deployment, and monitoring. Knowledge of cloud ML services (AWS SageMaker, Google AI Platform). Strong mathematical background in statistics and linear algebra.',
      threshold_score: 85,
      recruiter_id: 3
    },
    {
      title: 'UX/UI Designer',
      description: 'Create intuitive and beautiful user experiences for our digital products. You will conduct user research, create wireframes and prototypes, and collaborate with developers to bring designs to life. We value user-centered design and data-driven decision making.',
      requirements: 'Bachelor\'s degree in Design, HCI, or related field. 4+ years of UX/UI design experience. Proficiency in design tools (Figma, Sketch, Adobe Creative Suite). Strong portfolio demonstrating user-centered design process. Experience with user research methods and usability testing. Knowledge of HTML/CSS and design systems. Understanding of accessibility principles and mobile-first design.',
      threshold_score: 70,
      recruiter_id: 2
    },
    {
      title: 'DevOps Engineer',
      description: 'Help us build and maintain robust, scalable infrastructure. You will work on automation, monitoring, and deployment pipelines to ensure our applications run smoothly and efficiently. This role is perfect for someone who loves solving complex technical challenges.',
      requirements: 'Bachelor\'s degree in Computer Science, Engineering, or related field. 4+ years of DevOps/Infrastructure experience. Expertise in AWS/Azure cloud platforms. Proficiency with Docker, Kubernetes, and container orchestration. Experience with Infrastructure as Code (Terraform, CloudFormation). Knowledge of CI/CD pipelines (Jenkins, GitLab CI). Strong scripting skills in Python or Bash.',
      threshold_score: 80,
      recruiter_id: 1
    }
  ];

  console.log('Seeding database with sample data...');

  // First, create sample recruiters
  sampleRecruiters.forEach(async (recruiter, index) => {
    const hashedPassword = await bcrypt.hash(recruiter.password, 10);
    
    db.run(
      'INSERT OR IGNORE INTO users (id, email, password, role, name) VALUES (?, ?, ?, ?, ?)',
      [index + 1, recruiter.email, hashedPassword, recruiter.role, recruiter.name],
      function(err) {
        if (err) {
          console.error('Error creating sample recruiter:', err);
        } else {
          console.log(`Created sample recruiter: ${recruiter.name}`);
        }
      }
    );
  });

  // Sample applications with detailed AI insights
  const sampleApplications = [
    {
      job_id: 1, // Senior Software Developer
      candidate_name: 'Sarah Johnson',
      candidate_email: 'sarah.johnson@email.com',
      candidate_phone: '+1-555-0123',
      ai_score: 87,
      test_score: 92,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'JavaScript', category: 'programming', level: 'expert' },
          { skill: 'React', category: 'frontend', level: 'expert' },
          { skill: 'Node.js', category: 'backend', level: 'intermediate' },
          { skill: 'SQL', category: 'database', level: 'intermediate' },
          { skill: 'Git', category: 'tools', level: 'expert' }
        ],
        skill_gaps: [
          { skill: 'TypeScript', category: 'programming', priority: 'medium' },
          { skill: 'AWS', category: 'cloud', priority: 'high' }
        ],
        certifications: ['AWS Certified Developer', 'React Professional'],
        education: { level: 'bachelors', field: 'computer science' },
        experience_years: 6,
        strengths: ['Strong frontend skills', 'Full-stack capabilities', 'Leadership experience'],
        recommendations: ['Consider AWS certification', 'TypeScript would enhance skill set'],
        industry_experience: ['fintech', 'saas'],
        summary: 'Excellent candidate with strong technical skills and relevant experience'
      })
    },
    {
      job_id: 2, // Frontend React Developer
      candidate_name: 'Michael Chen',
      candidate_email: 'michael.chen@email.com',
      candidate_phone: '+1-555-0124',
      ai_score: 78,
      test_score: 85,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'React', category: 'frontend', level: 'expert' },
          { skill: 'JavaScript', category: 'programming', level: 'intermediate' },
          { skill: 'HTML', category: 'frontend', level: 'expert' },
          { skill: 'CSS', category: 'frontend', level: 'expert' }
        ],
        skill_gaps: [
          { skill: 'Redux', category: 'frontend', priority: 'high' },
          { skill: 'Testing', category: 'tools', priority: 'medium' }
        ],
        certifications: ['Google Analytics Certified'],
        education: { level: 'bachelors', field: 'web development' },
        experience_years: 4,
        strengths: ['UI/UX focus', 'Modern React patterns'],
        recommendations: ['Learn Redux for state management', 'Add testing skills'],
        industry_experience: ['e-commerce', 'startup'],
        summary: 'Strong frontend developer with modern React expertise'
      })
    },
    {
      job_id: 3, // Data Scientist
      candidate_name: 'Dr. Emily Rodriguez',
      candidate_email: 'emily.rodriguez@email.com',
      candidate_phone: '+1-555-0125',
      ai_score: 94,
      test_score: 88,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'Python', category: 'programming', level: 'expert' },
          { skill: 'Machine Learning', category: 'data', level: 'expert' },
          { skill: 'Pandas', category: 'data', level: 'expert' },
          { skill: 'SQL', category: 'database', level: 'expert' },
          { skill: 'Statistics', category: 'data', level: 'expert' }
        ],
        skill_gaps: [
          { skill: 'Deep Learning', category: 'data', priority: 'medium' }
        ],
        certifications: ['Google Cloud ML Engineer', 'Coursera ML Specialization'],
        education: { level: 'phd', field: 'data science' },
        experience_years: 8,
        strengths: ['Advanced statistical knowledge', 'Research background', 'ML expertise'],
        recommendations: ['Explore deep learning frameworks'],
        industry_experience: ['healthcare', 'fintech'],
        summary: 'Exceptional data scientist with PhD and extensive ML experience'
      })
    },
    {
      job_id: 4, // Digital Marketing Manager
      candidate_name: 'Alex Thompson',
      candidate_email: 'alex.thompson@email.com',
      candidate_phone: '+1-555-0126',
      ai_score: 72,
      test_score: 79,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'Google Ads', category: 'marketing', level: 'expert' },
          { skill: 'Analytics', category: 'marketing', level: 'intermediate' },
          { skill: 'SEO', category: 'marketing', level: 'intermediate' }
        ],
        skill_gaps: [
          { skill: 'Facebook Ads', category: 'marketing', priority: 'high' },
          { skill: 'Content Marketing', category: 'marketing', priority: 'medium' }
        ],
        certifications: ['Google Ads Certified', 'HubSpot Certified'],
        education: { level: 'bachelors', field: 'marketing' },
        experience_years: 5,
        strengths: ['PPC expertise', 'Data-driven approach'],
        recommendations: ['Expand social media advertising skills', 'Content strategy development'],
        industry_experience: ['e-commerce', 'saas'],
        summary: 'Solid marketing professional with strong PPC background'
      })
    },
    {
      job_id: 1, // Senior Software Developer
      candidate_name: 'David Kim',
      candidate_email: 'david.kim@email.com',
      candidate_phone: '+1-555-0127',
      ai_score: 65,
      test_score: null,
      status: 'not_eligible',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'JavaScript', category: 'programming', level: 'beginner' },
          { skill: 'HTML', category: 'frontend', level: 'intermediate' }
        ],
        skill_gaps: [
          { skill: 'React', category: 'frontend', priority: 'high' },
          { skill: 'Node.js', category: 'backend', priority: 'high' },
          { skill: 'SQL', category: 'database', priority: 'high' }
        ],
        certifications: [],
        education: { level: 'bachelors', field: 'computer science' },
        experience_years: 1,
        strengths: ['Basic programming knowledge', 'Eager to learn'],
        recommendations: ['Gain more hands-on experience', 'Learn modern frameworks', 'Build portfolio projects'],
        industry_experience: [],
        summary: 'Entry-level candidate with potential but needs more experience'
      })
    },
    {
      job_id: 5, // Full Stack Developer
      candidate_name: 'Lisa Wang',
      candidate_email: 'lisa.wang@email.com',
      candidate_phone: '+1-555-0128',
      ai_score: 81,
      test_score: 87,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'JavaScript', category: 'programming', level: 'expert' },
          { skill: 'React', category: 'frontend', level: 'intermediate' },
          { skill: 'Node.js', category: 'backend', level: 'intermediate' },
          { skill: 'MongoDB', category: 'database', level: 'intermediate' },
          { skill: 'Docker', category: 'tools', level: 'beginner' }
        ],
        skill_gaps: [
          { skill: 'TypeScript', category: 'programming', priority: 'medium' },
          { skill: 'Kubernetes', category: 'cloud', priority: 'low' }
        ],
        certifications: ['MongoDB Certified Developer'],
        education: { level: 'masters', field: 'computer science' },
        experience_years: 5,
        strengths: ['Full-stack capabilities', 'Modern tech stack', 'Problem-solving skills'],
        recommendations: ['Add TypeScript to skill set', 'Container orchestration knowledge'],
        industry_experience: ['startup', 'saas'],
        summary: 'Well-rounded full-stack developer with modern technology experience'
      })
    },
    {
      job_id: 6, // Machine Learning Engineer
      candidate_name: 'James Wilson',
      candidate_email: 'james.wilson@email.com',
      candidate_phone: '+1-555-0129',
      ai_score: 89,
      test_score: 91,
      status: 'test_completed',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'Python', category: 'programming', level: 'expert' },
          { skill: 'TensorFlow', category: 'data', level: 'expert' },
          { skill: 'Machine Learning', category: 'data', level: 'expert' },
          { skill: 'Docker', category: 'tools', level: 'intermediate' }
        ],
        skill_gaps: [
          { skill: 'MLOps', category: 'data', priority: 'medium' }
        ],
        certifications: ['TensorFlow Developer Certificate', 'AWS ML Specialty'],
        education: { level: 'masters', field: 'machine learning' },
        experience_years: 6,
        strengths: ['Deep learning expertise', 'Model deployment experience', 'Research background'],
        recommendations: ['Focus on MLOps practices', 'Production ML systems'],
        industry_experience: ['healthcare', 'fintech'],
        summary: 'Highly skilled ML engineer with strong technical foundation'
      })
    },
    {
      job_id: 2, // Frontend React Developer
      candidate_name: 'Anna Martinez',
      candidate_email: 'anna.martinez@email.com',
      candidate_phone: '+1-555-0130',
      ai_score: 69,
      test_score: null,
      status: 'not_eligible',
      ai_insights: JSON.stringify({
        skills_matched: [
          { skill: 'HTML', category: 'frontend', level: 'intermediate' },
          { skill: 'CSS', category: 'frontend', level: 'intermediate' },
          { skill: 'JavaScript', category: 'programming', level: 'beginner' }
        ],
        skill_gaps: [
          { skill: 'React', category: 'frontend', priority: 'high' },
          { skill: 'Modern JavaScript', category: 'programming', priority: 'high' }
        ],
        certifications: [],
        education: { level: 'bachelors', field: 'web design' },
        experience_years: 2,
        strengths: ['Design sense', 'Basic web technologies'],
        recommendations: ['Learn React framework', 'Strengthen JavaScript skills', 'Build React projects'],
        industry_experience: ['design agency'],
        summary: 'Designer transitioning to development, needs more technical skills'
      })
    }
  ];

  // Then create sample jobs (with a small delay to ensure recruiters are created first)
  setTimeout(() => {
    sampleJobs.forEach((job, index) => {
      db.run(
        'INSERT OR IGNORE INTO jobs (id, title, description, requirements, threshold_score, recruiter_id, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now", "-" || ? || " days"))',
        [index + 1, job.title, job.description, job.requirements, job.threshold_score, job.recruiter_id, Math.floor(Math.random() * 30)],
        function(err) {
          if (err) {
            console.error('Error creating sample job:', err);
          } else {
            console.log(`Created sample job: ${job.title}`);
          }
        }
      );
    });

    // Create sample applications (with additional delay)
    setTimeout(() => {
      sampleApplications.forEach((application, index) => {
        const daysAgo = Math.floor(Math.random() * 14) + 1; // 1-14 days ago
        db.run(
          `INSERT OR IGNORE INTO applications 
           (id, job_id, candidate_name, candidate_email, candidate_phone, ai_score, test_score, status, ai_insights, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now", "-" || ? || " days"))`,
          [
            index + 1,
            application.job_id,
            application.candidate_name,
            application.candidate_email,
            application.candidate_phone,
            application.ai_score,
            application.test_score,
            application.status,
            application.ai_insights,
            daysAgo
          ],
          function(err) {
            if (err) {
              console.error('Error creating sample application:', err);
            } else {
              console.log(`Created sample application: ${application.candidate_name}`);
            }
          }
        );
      });
    }, 1500);
  }, 1000);
};

module.exports = { seedDatabase };