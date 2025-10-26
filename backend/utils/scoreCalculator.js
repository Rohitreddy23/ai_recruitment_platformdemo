// Composite Fit Score Calculator with Experience Level Weightage

const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid', 
  SENIOR: 'senior',
  LEAD: 'lead'
};

const WEIGHTAGE_CONFIG = {
  [EXPERIENCE_LEVELS.ENTRY]: {
    resume_weight: 0.70,  // 70% resume score
    test_weight: 0.30     // 30% test score
  },
  [EXPERIENCE_LEVELS.MID]: {
    resume_weight: 0.40,  // 40% resume score  
    test_weight: 0.60     // 60% test score
  },
  [EXPERIENCE_LEVELS.SENIOR]: {
    resume_weight: 0.30,  // 30% resume score
    test_weight: 0.70     // 70% test score
  },
  [EXPERIENCE_LEVELS.LEAD]: {
    resume_weight: 0.25,  // 25% resume score
    test_weight: 0.75     // 75% test score
  }
};

/**
 * Determine experience level based on job role and candidate profile
 * @param {string} roleTitle - Job role title
 * @param {number} experienceYears - Candidate's years of experience
 * @param {object} candidateProfile - Additional candidate information
 * @returns {string} Experience level
 */
const determineExperienceLevel = (roleTitle, experienceYears = 0, candidateProfile = {}) => {
  const roleLower = roleTitle.toLowerCase();
  
  // Check role title keywords first
  if (roleLower.includes('senior') || roleLower.includes('sr.')) {
    return EXPERIENCE_LEVELS.SENIOR;
  }
  
  if (roleLower.includes('lead') || roleLower.includes('principal') || roleLower.includes('architect')) {
    return EXPERIENCE_LEVELS.LEAD;
  }
  
  if (roleLower.includes('junior') || roleLower.includes('jr.') || roleLower.includes('intern')) {
    return EXPERIENCE_LEVELS.ENTRY;
  }
  
  // Fallback to experience years
  if (experienceYears >= 8) {
    return EXPERIENCE_LEVELS.LEAD;
  } else if (experienceYears >= 5) {
    return EXPERIENCE_LEVELS.SENIOR;
  } else if (experienceYears >= 2) {
    return EXPERIENCE_LEVELS.MID;
  } else {
    return EXPERIENCE_LEVELS.ENTRY;
  }
};

/**
 * Calculate weighted composite fit score
 * @param {number} aiScore - AI resume analysis score (0-100)
 * @param {number} testScore - Objective test score (0-100)
 * @param {string} experienceLevel - Experience level
 * @returns {object} Calculation details
 */
const calculateCompositeFitScore = (aiScore, testScore, experienceLevel) => {
  const weights = WEIGHTAGE_CONFIG[experienceLevel] || WEIGHTAGE_CONFIG[EXPERIENCE_LEVELS.MID];
  
  // Calculate weighted score
  const weightedResumeScore = aiScore * weights.resume_weight;
  const weightedTestScore = testScore * weights.test_weight;
  const compositeFitScore = Math.round(weightedResumeScore + weightedTestScore);
  
  return {
    composite_fit_score: compositeFitScore,
    experience_level: experienceLevel,
    weightage: {
      resume_weight: Math.round(weights.resume_weight * 100),
      test_weight: Math.round(weights.test_weight * 100)
    },
    breakdown: {
      ai_score: aiScore,
      test_score: testScore,
      weighted_resume_score: Math.round(weightedResumeScore),
      weighted_test_score: Math.round(weightedTestScore)
    }
  };
};

/**
 * Get weightage configuration for display
 * @param {string} experienceLevel - Experience level
 * @returns {object} Weightage configuration
 */
const getWeightageConfig = (experienceLevel) => {
  const weights = WEIGHTAGE_CONFIG[experienceLevel] || WEIGHTAGE_CONFIG[EXPERIENCE_LEVELS.MID];
  return {
    experience_level: experienceLevel,
    resume_weight: Math.round(weights.resume_weight * 100),
    test_weight: Math.round(weights.test_weight * 100),
    description: getWeightageDescription(experienceLevel)
  };
};

/**
 * Get description for weightage rationale
 * @param {string} experienceLevel - Experience level
 * @returns {string} Description
 */
const getWeightageDescription = (experienceLevel) => {
  switch (experienceLevel) {
    case EXPERIENCE_LEVELS.ENTRY:
      return 'Entry-level: Higher weightage on resume/potential (70%) vs practical skills (30%)';
    case EXPERIENCE_LEVELS.MID:
      return 'Mid-level: Balanced evaluation with more emphasis on practical skills (60% test, 40% resume)';
    case EXPERIENCE_LEVELS.SENIOR:
      return 'Senior-level: Strong emphasis on practical skills and problem-solving (70% test, 30% resume)';
    case EXPERIENCE_LEVELS.LEAD:
      return 'Lead-level: Maximum emphasis on practical skills and leadership capabilities (75% test, 25% resume)';
    default:
      return 'Balanced evaluation approach';
  }
};

/**
 * Calculate composite score for multiple candidates (for ranking)
 * @param {Array} candidates - Array of candidate objects
 * @returns {Array} Sorted candidates with composite scores
 */
const rankCandidates = (candidates) => {
  return candidates.map(candidate => {
    const experienceLevel = determineExperienceLevel(
      candidate.role_name || candidate.job_title,
      candidate.experience_years,
      candidate
    );
    
    const scoreCalculation = calculateCompositeFitScore(
      candidate.ai_score || candidate.ai_match_score,
      candidate.test_score || candidate.objective_test_score || 0,
      experienceLevel
    );
    
    return {
      ...candidate,
      ...scoreCalculation
    };
  }).sort((a, b) => b.composite_fit_score - a.composite_fit_score);
};

module.exports = {
  EXPERIENCE_LEVELS,
  WEIGHTAGE_CONFIG,
  determineExperienceLevel,
  calculateCompositeFitScore,
  getWeightageConfig,
  getWeightageDescription,
  rankCandidates
};