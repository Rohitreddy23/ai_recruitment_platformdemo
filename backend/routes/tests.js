const express = require('express');
const db = require('../database/init');
const { getTestForJobTitle } = require('../data/testQuestions');

const router = express.Router();

// Get test questions for an application
router.get('/application/:applicationId', (req, res) => {
  const { applicationId } = req.params;

  // Get application and job details
  db.get(`
    SELECT a.*, j.title as job_title, j.description 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.id = ? AND a.status = 'eligible'
  `, [applicationId], (err, application) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not eligible for test' });
    }

    // Get test questions based on job title
    const questions = getTestForJobTitle(application.job_title);
    
    // Remove correct answers from response
    const questionsForCandidate = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      points: q.points
    }));

    res.json({
      application_id: applicationId,
      job_title: application.job_title,
      candidate_name: application.candidate_name,
      questions: questionsForCandidate,
      total_points: questions.reduce((sum, q) => sum + q.points, 0)
    });
  });
});

// Submit test answers
router.post('/submit/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const { answers } = req.body; // Array of {questionId, selectedOption}

  // Get application and job details
  db.get(`
    SELECT a.*, j.title as job_title 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.id = ? AND a.status = 'eligible'
  `, [applicationId], (err, application) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not eligible for test' });
    }

    // Get correct answers
    const questions = getTestForJobTitle(application.job_title);
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (userAnswer && userAnswer.selectedOption === question.correct) {
        totalScore += question.points;
        results.push({
          questionId: question.id,
          correct: true,
          points: question.points
        });
      } else {
        results.push({
          questionId: question.id,
          correct: false,
          points: 0
        });
      }
    });

    const percentageScore = Math.round((totalScore / maxScore) * 100);

    // Save test results
    db.run(
      'INSERT INTO test_results (application_id, answers, score) VALUES (?, ?, ?)',
      [applicationId, JSON.stringify(answers), percentageScore],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save test results' });
        }

        // Update application status and test score
        db.run(
          'UPDATE applications SET test_score = ?, status = ? WHERE id = ?',
          [percentageScore, 'test_completed', applicationId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update application' });
            }

            res.json({
              message: 'Test submitted successfully',
              score: percentageScore,
              total_points: totalScore,
              max_points: maxScore,
              results: results
            });
          }
        );
      }
    );
  });
});

// Get test results for an application (for recruiters)
router.get('/results/:applicationId', (req, res) => {
  const { applicationId } = req.params;

  db.get(`
    SELECT tr.*, a.candidate_name, a.ai_score, j.title as job_title
    FROM test_results tr
    JOIN applications a ON tr.application_id = a.id
    JOIN jobs j ON a.job_id = j.id
    WHERE tr.application_id = ?
  `, [applicationId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Test results not found' });
    }

    res.json(result);
  });
});

module.exports = router;