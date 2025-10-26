const express = require('express');
const db = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (public)
router.get('/', (req, res) => {
  db.all(`
    SELECT j.*, u.name as recruiter_name 
    FROM jobs j 
    JOIN users u ON j.recruiter_id = u.id 
    ORDER BY j.created_at DESC
  `, (err, jobs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(jobs);
  });
});

// Get job by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT j.*, u.name as recruiter_name 
    FROM jobs j 
    JOIN users u ON j.recruiter_id = u.id 
    WHERE j.id = ?
  `, [id], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  });
});

// Create job (recruiter only)
router.post('/', authenticateToken, requireRole('recruiter'), (req, res) => {
  const { title, description, requirements, threshold_score = 70 } = req.body;
  const recruiter_id = req.user.id;

  db.run(
    'INSERT INTO jobs (title, description, requirements, threshold_score, recruiter_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, requirements, threshold_score, recruiter_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create job' });
      }

      res.status(201).json({
        message: 'Job created successfully',
        job: { id: this.lastID, title, description, requirements, threshold_score }
      });
    }
  );
});

// Get recruiter's jobs
router.get('/recruiter/my-jobs', authenticateToken, requireRole('recruiter'), (req, res) => {
  const recruiter_id = req.user.id;

  db.all('SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY created_at DESC', [recruiter_id], (err, jobs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(jobs);
  });
});

module.exports = router;