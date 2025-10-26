const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'recruitment.db');
const db = new sqlite3.Database(dbPath);

// Update database schema to match ERD
const updateSchemaToMatchERD = () => {
  db.serialize(() => {
    // Create Candidate_table (separate from users)
    db.run(`
      CREATE TABLE IF NOT EXISTS candidate_table (
        candidate_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Job_Role_Table
    db.run(`
      CREATE TABLE IF NOT EXISTS job_role_table (
        role_id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name TEXT NOT NULL,
        role_description TEXT NOT NULL,
        min_ai_score_threshold INTEGER DEFAULT 70,
        recruiter_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES users (id)
      )
    `);

    // Create Resume_Analysis_table
    db.run(`
      CREATE TABLE IF NOT EXISTS resume_analysis_table (
        analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        ai_match_score INTEGER NOT NULL,
        matched_skills TEXT,
        application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        resume_path TEXT,
        skill_gaps TEXT,
        experience_years INTEGER,
        experience_level TEXT CHECK(experience_level IN ('entry', 'mid', 'senior', 'lead')),
        education TEXT,
        certifications TEXT,
        FOREIGN KEY (candidate_id) REFERENCES candidate_table (candidate_id),
        FOREIGN KEY (role_id) REFERENCES job_role_table (role_id)
      )
    `);

    // Create Assessment_table
    db.run(`
      CREATE TABLE IF NOT EXISTS assessment_table (
        assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        objective_test_score INTEGER,
        test_link_token TEXT UNIQUE,
        test_completed_at DATETIME,
        test_duration INTEGER,
        answers TEXT,
        FOREIGN KEY (analysis_id) REFERENCES resume_analysis_table (analysis_id)
      )
    `);

    // Create Recruiter_decision_table
    db.run(`
      CREATE TABLE IF NOT EXISTS recruiter_decision_table (
        decision_id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        composite_fit_score INTEGER,
        experience_level TEXT,
        resume_weightage INTEGER,
        test_weightage INTEGER,
        weighted_resume_score INTEGER,
        weighted_test_score INTEGER,
        hiring_status TEXT CHECK(hiring_status IN ('pending', 'shortlisted', 'rejected', 'hired')),
        decision_comments TEXT,
        decision_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        recruiter_id INTEGER NOT NULL,
        FOREIGN KEY (analysis_id) REFERENCES resume_analysis_table (analysis_id),
        FOREIGN KEY (recruiter_id) REFERENCES users (id)
      )
    `);

    console.log('Updated database schema to match ERD');
  });
};

// Migration function to move existing data to new schema
const migrateExistingData = () => {
  db.serialize(() => {
    // Migrate candidates from applications to candidate_table
    db.run(`
      INSERT OR IGNORE INTO candidate_table (name, email, phone)
      SELECT DISTINCT candidate_name, candidate_email, candidate_phone 
      FROM applications
    `);

    // Migrate jobs to job_role_table
    db.run(`
      INSERT OR IGNORE INTO job_role_table (role_id, role_name, role_description, min_ai_score_threshold, recruiter_id)
      SELECT id, title, description || ' Requirements: ' || requirements, threshold_score, recruiter_id
      FROM jobs
    `);

    // Migrate applications to resume_analysis_table
    db.run(`
      INSERT OR IGNORE INTO resume_analysis_table 
      (analysis_id, candidate_id, role_id, ai_match_score, matched_skills, application_date, resume_path)
      SELECT 
        a.id,
        c.candidate_id,
        a.job_id,
        a.ai_score,
        CASE WHEN a.ai_insights IS NOT NULL THEN a.ai_insights ELSE '[]' END,
        a.created_at,
        a.resume_path
      FROM applications a
      JOIN candidate_table c ON c.email = a.candidate_email
    `);

    // Migrate test results to assessment_table
    db.run(`
      INSERT OR IGNORE INTO assessment_table 
      (assessment_id, analysis_id, objective_test_score, test_completed_at, answers)
      SELECT 
        tr.id,
        tr.application_id,
        tr.score,
        tr.completed_at,
        tr.answers
      FROM test_results tr
    `);

    console.log('Migrated existing data to new schema');
  });
};

module.exports = {
  updateSchemaToMatchERD,
  migrateExistingData
};