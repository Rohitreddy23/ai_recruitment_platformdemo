const express = require('express');
const db = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  determineExperienceLevel, 
  calculateCompositeFitScore, 
  getWeightageConfig,
  rankCandidates 
} = require('../utils/scoreCalculator');

const router = express.Router();

// Get all candidates (ERD compliant)
router.get('/candidates', authenticateToken, requireRole('recruiter'), (req, res) => {
  db.all(`
    SELECT 
      c.*,
      ra.analysis_id,
      ra.ai_match_score,
      ra.matched_skills,
      ra.application_date,
      jr.role_name,
      a.objective_test_score,
      rd.hiring_status,
      rd.composite_fit_score,
      rd.decision_comments
    FROM candidate_table c
    LEFT JOIN resume_analysis_table ra ON c.candidate_id = ra.candidate_id
    LEFT JOIN job_role_table jr ON ra.role_id = jr.role_id
    LEFT JOIN assessment_table a ON ra.analysis_id = a.analysis_id
    LEFT JOIN recruiter_decision_table rd ON ra.analysis_id = rd.analysis_id
    ORDER BY ra.application_date DESC
  `, (err, candidates) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(candidates);
  });
});

// Get candidate analysis details (ERD compliant)
router.get('/analysis/:analysisId', authenticateToken, requireRole('recruiter'), (req, res) => {
  const { analysisId } = req.params;
  
  db.get(`
    SELECT 
      c.*,
      ra.*,
      jr.role_name,
      jr.role_description,
      jr.min_ai_score_threshold,
      a.objective_test_score,
      a.test_completed_at,
      a.test_duration,
      rd.hiring_status,
      rd.composite_fit_score,
      rd.decision_comments
    FROM resume_analysis_table ra
    JOIN candidate_table c ON ra.candidate_id = c.candidate_id
    JOIN job_role_table jr ON ra.role_id = jr.role_id
    LEFT JOIN assessment_table a ON ra.analysis_id = a.analysis_id
    LEFT JOIN recruiter_decision_table rd ON ra.analysis_id = rd.analysis_id
    WHERE ra.analysis_id = ?
  `, [analysisId], (err, analysis) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Parse JSON fields
    try {
      if (analysis.matched_skills) {
        analysis.matched_skills = JSON.parse(analysis.matched_skills);
      }
      if (analysis.skill_gaps) {
        analysis.skill_gaps = JSON.parse(analysis.skill_gaps);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
    }
    
    res.json(analysis);
  });
});

// Create recruiter decision (ERD compliant)
router.post('/decision', authenticateToken, requireRole('recruiter'), (req, res) => {
  const { analysis_id, hiring_status, decision_comments } = req.body;
  const recruiter_id = req.user.id;
  
  // First get the analysis to calculate composite score
  db.get(`
    SELECT ra.ai_match_score, a.objective_test_score
    FROM resume_analysis_table ra
    LEFT JOIN assessment_table a ON ra.analysis_id = a.analysis_id
    WHERE ra.analysis_id = ?
  `, [analysis_id], (err, analysis) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Get job role and candidate info for experience level determination
    db.get(`
      SELECT 
        jr.role_name,
        ra.experience_years,
        ra.ai_match_score,
        a.objective_test_score
      FROM resume_analysis_table ra
      JOIN job_role_table jr ON ra.role_id = jr.role_id
      LEFT JOIN assessment_table a ON ra.analysis_id = a.analysis_id
      WHERE ra.analysis_id = ?
    `, [analysis_id], (err, fullAnalysis) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Determine experience level and calculate weighted composite score
      const experienceLevel = determineExperienceLevel(
        fullAnalysis.role_name,
        fullAnalysis.experience_years || 0
      );
      
      const scoreCalculation = calculateCompositeFitScore(
        fullAnalysis.ai_match_score || 0,
        fullAnalysis.objective_test_score || 0,
        experienceLevel
      );
      
      const composite_fit_score = scoreCalculation.composite_fit_score;
    
    // Insert or update decision
    db.run(`
      INSERT OR REPLACE INTO recruiter_decision_table 
      (analysis_id, composite_fit_score, hiring_status, decision_comments, recruiter_id)
      VALUES (?, ?, ?, ?, ?)
    `, [analysis_id, composite_fit_score, hiring_status, decision_comments, recruiter_id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save decision' });
      }
      
      res.json({
        message: 'Decision saved successfully',
        decision_id: this.lastID,
        composite_fit_score,
        score_breakdown: scoreCalculation
      });
    });
    });
  });
});

// Get job roles (ERD compliant)
router.get('/job-roles', (req, res) => {
  db.all(`
    SELECT 
      jr.*,
      u.name as recruiter_name,
      COUNT(ra.analysis_id) as application_count,
      AVG(ra.ai_match_score) as avg_ai_score
    FROM job_role_table jr
    JOIN users u ON jr.recruiter_id = u.id
    LEFT JOIN resume_analysis_table ra ON jr.role_id = ra.role_id
    GROUP BY jr.role_id
    ORDER BY jr.created_at DESC
  `, (err, roles) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(roles);
  });
});

// Apply for job role (ERD compliant)
router.post('/apply', async (req, res) => {
  const { role_id, candidate_name, candidate_email, candidate_phone, ai_match_score, matched_skills } = req.body;
  
  try {
    // First, get the job role to check threshold
    db.get(`
      SELECT min_ai_score_threshold FROM job_role_table WHERE role_id = ?
    `, [role_id], (err, jobRole) => {
      if (err || !jobRole) {
        return res.status(404).json({ error: 'Job role not found' });
      }
      
      const isEligibleForTest = ai_match_score >= jobRole.min_ai_score_threshold;
      
      // Insert or get candidate
      db.run(`
        INSERT OR IGNORE INTO candidate_table (name, email, phone)
        VALUES (?, ?, ?)
      `, [candidate_name, candidate_email, candidate_phone], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create candidate' });
        }
        
        // Get candidate ID
        db.get(`
          SELECT candidate_id FROM candidate_table WHERE email = ?
        `, [candidate_email], (err, candidate) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          // Create resume analysis entry
          db.run(`
            INSERT INTO resume_analysis_table 
            (candidate_id, role_id, ai_match_score, matched_skills)
            VALUES (?, ?, ?, ?)
          `, [candidate.candidate_id, role_id, ai_match_score, JSON.stringify(matched_skills)], function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create analysis' });
            }
            
            const analysisId = this.lastID;
            
            // If eligible, create assessment entry with test link token
            if (isEligibleForTest) {
              const test_link_token = require('crypto').randomBytes(32).toString('hex');
              
              db.run(`
                INSERT INTO assessment_table (analysis_id, test_link_token)
                VALUES (?, ?)
              `, [analysisId, test_link_token], (err) => {
                if (err) {
                  console.error('Failed to create assessment entry:', err);
                }
                
                res.json({
                  message: 'Application submitted successfully',
                  analysis_id: analysisId,
                  candidate_id: candidate.candidate_id,
                  ai_match_score,
                  min_ai_score_threshold: jobRole.min_ai_score_threshold,
                  eligible_for_test: isEligibleForTest,
                  test_link_token: isEligibleForTest ? test_link_token : null
                });
              });
            } else {
              res.json({
                message: 'Application submitted successfully',
                analysis_id: analysisId,
                candidate_id: candidate.candidate_id,
                ai_match_score,
                min_ai_score_threshold: jobRole.min_ai_score_threshold,
                eligible_for_test: false,
                test_link_token: null
              });
            }
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get test by token (for candidates taking test)
router.get('/test/:testToken', (req, res) => {
  const { testToken } = req.params;
  
  db.get(`
    SELECT 
      a.assessment_id,
      a.analysis_id,
      ra.candidate_id,
      jr.role_name,
      jr.role_description,
      c.name as candidate_name
    FROM assessment_table a
    JOIN resume_analysis_table ra ON a.analysis_id = ra.analysis_id
    JOIN job_role_table jr ON ra.role_id = jr.role_id
    JOIN candidate_table c ON ra.candidate_id = c.candidate_id
    WHERE a.test_link_token = ? AND a.objective_test_score IS NULL
  `, [testToken], (err, testInfo) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!testInfo) {
      return res.status(404).json({ error: 'Test not found or already completed' });
    }
    
    res.json(testInfo);
  });
});

// Submit test results (ERD compliant)
router.post('/submit-test/:testToken', (req, res) => {
  const { testToken } = req.params;
  const { answers, test_score } = req.body;
  
  // Update assessment with test results
  db.run(`
    UPDATE assessment_table 
    SET objective_test_score = ?, answers = ?, test_completed_at = datetime('now')
    WHERE test_link_token = ?
  `, [test_score, JSON.stringify(answers), testToken], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save test results' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    // Get analysis info to calculate composite score
    db.get(`
      SELECT 
        a.analysis_id,
        ra.ai_match_score,
        a.objective_test_score
      FROM assessment_table a
      JOIN resume_analysis_table ra ON a.analysis_id = ra.analysis_id
      WHERE a.test_link_token = ?
    `, [testToken], (err, analysis) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get job role for experience level determination
      db.get(`
        SELECT jr.role_name, ra.experience_years
        FROM resume_analysis_table ra
        JOIN job_role_table jr ON ra.role_id = jr.role_id
        WHERE ra.analysis_id = ?
      `, [analysis.analysis_id], (err, jobInfo) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Determine experience level and calculate weighted composite score
        const experienceLevel = determineExperienceLevel(
          jobInfo.role_name,
          jobInfo.experience_years || 0
        );
        
        const scoreCalculation = calculateCompositeFitScore(
          analysis.ai_match_score,
          analysis.objective_test_score,
          experienceLevel
        );
        
        const composite_fit_score = scoreCalculation.composite_fit_score;
      
      // Create or update recruiter decision with composite score
      db.run(`
        INSERT OR REPLACE INTO recruiter_decision_table 
        (analysis_id, composite_fit_score, hiring_status)
        VALUES (?, ?, 'pending')
      `, [analysis.analysis_id, composite_fit_score], (err) => {
        if (err) {
          console.error('Failed to update composite score:', err);
        }
        
        res.json({
          message: 'Test submitted successfully',
          test_score,
          ai_match_score: analysis.ai_match_score,
          composite_fit_score,
          score_breakdown: scoreCalculation
        });
      });
      });
    });
  });
});

// Generate test link token (ERD compliant)
router.post('/generate-test-link/:analysisId', authenticateToken, requireRole('recruiter'), (req, res) => {
  const { analysisId } = req.params;
  const test_link_token = require('crypto').randomBytes(32).toString('hex');
  
  db.run(`
    INSERT OR REPLACE INTO assessment_table (analysis_id, test_link_token)
    VALUES (?, ?)
  `, [analysisId, test_link_token], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate test link' });
    }
    
    res.json({
      message: 'Test link generated successfully',
      test_link_token,
      test_url: `/test/${test_link_token}`
    });
  });
});

// Get weightage configuration for a job role
router.get('/weightage/:roleId', (req, res) => {
  const { roleId } = req.params;
  
  db.get(`
    SELECT role_name, role_description FROM job_role_table WHERE role_id = ?
  `, [roleId], (err, role) => {
    if (err || !role) {
      return res.status(404).json({ error: 'Job role not found' });
    }
    
    // Determine experience level from role
    const experienceLevel = determineExperienceLevel(role.role_name, 0);
    const weightageConfig = getWeightageConfig(experienceLevel);
    
    res.json({
      role_name: role.role_name,
      ...weightageConfig
    });
  });
});

// Get candidates with weighted scores
router.get('/candidates-ranked', authenticateToken, requireRole('recruiter'), (req, res) => {
  db.all(`
    SELECT 
      c.*,
      ra.analysis_id,
      ra.ai_match_score,
      ra.matched_skills,
      ra.application_date,
      ra.experience_years,
      jr.role_name,
      a.objective_test_score,
      rd.hiring_status,
      rd.composite_fit_score,
      rd.decision_comments
    FROM candidate_table c
    LEFT JOIN resume_analysis_table ra ON c.candidate_id = ra.candidate_id
    LEFT JOIN job_role_table jr ON ra.role_id = jr.role_id
    LEFT JOIN assessment_table a ON ra.analysis_id = a.analysis_id
    LEFT JOIN recruiter_decision_table rd ON ra.analysis_id = rd.analysis_id
    WHERE ra.analysis_id IS NOT NULL
    ORDER BY ra.application_date DESC
  `, (err, candidates) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Calculate weighted scores and rank candidates
    const rankedCandidates = rankCandidates(candidates);
    
    res.json(rankedCandidates);
  });
});

module.exports = router;