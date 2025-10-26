const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
  role: Joi.string().valid('candidate', 'recruiter').required()
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Job creation validation
const jobSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(50).max(2000).required(),
  requirements: Joi.string().min(50).max(2000).required(),
  threshold_score: Joi.number().integer().min(0).max(100).default(70)
});

// Application validation
const applicationSchema = Joi.object({
  job_id: Joi.number().integer().positive().required(),
  candidate_name: Joi.string().min(2).max(50).required(),
  candidate_email: Joi.string().email().required(),
  candidate_phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
});

// Test submission validation
const testSubmissionSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().positive().required(),
      selectedOption: Joi.number().integer().min(0).max(3).required()
    })
  ).min(1).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  jobSchema,
  applicationSchema,
  testSubmissionSchema
};