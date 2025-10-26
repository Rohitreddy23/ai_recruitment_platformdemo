const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseResume = async (resumeText, jobRequirements) => {
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log('Using mock AI service - no OpenAI API key provided');
    return generateMockAnalysis(resumeText, jobRequirements);
  }

  try {
    const prompt = `
    Analyze this resume against the job requirements and provide a score from 0-100 based on skill match, experience relevance, and qualifications.

    Job Requirements:
    ${jobRequirements}

    Resume Content:
    ${resumeText}

    Please respond with a JSON object containing:
    {
      "score": <number between 0-100>,
      "skills_matched": ["skill1", "skill2"],
      "experience_years": <number>,
      "key_qualifications": ["qualification1", "qualification2"],
      "summary": "Brief explanation of the score"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('AI parsing error:', error);
    return generateMockAnalysis(resumeText, jobRequirements);
  }
};

const generateMockAnalysis = (resumeText, jobRequirements) => {
  const resumeLower = resumeText.toLowerCase();
  const requirementsLower = jobRequirements.toLowerCase();
  
  // Comprehensive skill categories
  const skillCategories = {
    programming: ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript'],
    frontend: ['react', 'vue', 'angular', 'html', 'css', 'sass', 'bootstrap', 'tailwind'],
    backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', '.net'],
    database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'],
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
    tools: ['git', 'jenkins', 'jira', 'confluence', 'slack', 'figma', 'photoshop'],
    marketing: ['seo', 'sem', 'google ads', 'facebook ads', 'analytics', 'hubspot', 'mailchimp'],
    data: ['machine learning', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'tableau', 'power bi'],
    soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'project management']
  };
  
  let matchedSkills = [];
  let skillGaps = [];
  let certifications = [];
  let baseScore = 50;
  
  // Analyze skills
  Object.entries(skillCategories).forEach(([category, skills]) => {
    skills.forEach(skill => {
      if (resumeLower.includes(skill)) {
        if (requirementsLower.includes(skill)) {
          matchedSkills.push({ skill, category, level: getSkillLevel(resumeText, skill) });
          baseScore += 4;
        }
      } else if (requirementsLower.includes(skill)) {
        skillGaps.push({ skill, category, priority: 'high' });
      }
    });
  });
  
  // Detect certifications
  const certPatterns = [
    'aws certified', 'azure certified', 'google cloud certified', 'pmp certified',
    'scrum master', 'cissp', 'comptia', 'cisco certified', 'microsoft certified',
    'salesforce certified', 'hubspot certified', 'google analytics certified'
  ];
  
  certPatterns.forEach(cert => {
    if (resumeLower.includes(cert)) {
      certifications.push(cert);
      baseScore += 8;
    }
  });
  
  // Detect education level
  const education = detectEducation(resumeText);
  if (education.level === 'masters' || education.level === 'phd') baseScore += 10;
  else if (education.level === 'bachelors') baseScore += 5;
  
  // Experience analysis
  const experienceYears = calculateExperience(resumeText);
  baseScore += Math.min(experienceYears * 2, 20);
  
  // Industry experience
  const industryMatch = analyzeIndustryExperience(resumeText, jobRequirements);
  baseScore += industryMatch.score;
  
  const finalScore = Math.min(95, Math.max(35, baseScore));
  
  return {
    score: finalScore,
    skills_matched: matchedSkills,
    skill_gaps: skillGaps,
    certifications: certifications,
    experience_years: experienceYears,
    education: education,
    industry_experience: industryMatch.industries,
    key_qualifications: generateQualifications(matchedSkills, certifications, experienceYears),
    strengths: generateStrengths(matchedSkills, certifications, experienceYears),
    recommendations: generateRecommendations(skillGaps, experienceYears),
    summary: generateDetailedSummary(finalScore, matchedSkills, skillGaps, experienceYears)
  };
};

const getSkillLevel = (resumeText, skill) => {
  const skillMentions = (resumeText.toLowerCase().match(new RegExp(skill, 'g')) || []).length;
  if (skillMentions >= 3) return 'expert';
  if (skillMentions >= 2) return 'intermediate';
  return 'beginner';
};

const detectEducation = (resumeText) => {
  const text = resumeText.toLowerCase();
  if (text.includes('phd') || text.includes('doctorate')) {
    return { level: 'phd', field: extractEducationField(resumeText) };
  }
  if (text.includes('master') || text.includes('mba') || text.includes('ms ') || text.includes('ma ')) {
    return { level: 'masters', field: extractEducationField(resumeText) };
  }
  if (text.includes('bachelor') || text.includes('bs ') || text.includes('ba ') || text.includes('btech')) {
    return { level: 'bachelors', field: extractEducationField(resumeText) };
  }
  return { level: 'other', field: 'Not specified' };
};

const extractEducationField = (resumeText) => {
  const fields = ['computer science', 'engineering', 'business', 'marketing', 'data science', 'mathematics', 'statistics'];
  const text = resumeText.toLowerCase();
  
  for (const field of fields) {
    if (text.includes(field)) return field;
  }
  return 'Not specified';
};

const calculateExperience = (resumeText) => {
  const text = resumeText.toLowerCase();
  const yearMatches = text.match(/(\d+)\s*years?\s*(of\s*)?(experience|exp)/g);
  
  if (yearMatches) {
    const years = yearMatches.map(match => parseInt(match.match(/\d+/)[0]));
    return Math.max(...years);
  }
  
  // Estimate based on resume length and structure
  if (text.length > 2000) return Math.floor(Math.random() * 3) + 5;
  if (text.length > 1000) return Math.floor(Math.random() * 3) + 2;
  return Math.floor(Math.random() * 2) + 1;
};

const analyzeIndustryExperience = (resumeText, jobRequirements) => {
  const industries = ['fintech', 'healthcare', 'e-commerce', 'saas', 'startup', 'enterprise', 'consulting'];
  const text = resumeText.toLowerCase();
  const requirements = jobRequirements.toLowerCase();
  
  let matchedIndustries = [];
  let score = 0;
  
  industries.forEach(industry => {
    if (text.includes(industry)) {
      matchedIndustries.push(industry);
      if (requirements.includes(industry)) score += 5;
    }
  });
  
  return { industries: matchedIndustries, score };
};

const generateQualifications = (matchedSkills, certifications, experienceYears) => {
  const qualifications = [];
  
  if (experienceYears >= 5) qualifications.push('Senior level experience');
  else if (experienceYears >= 2) qualifications.push('Mid-level experience');
  else qualifications.push('Entry to junior level experience');
  
  if (matchedSkills.length >= 5) qualifications.push('Strong technical skill set');
  if (certifications.length > 0) qualifications.push('Industry certifications');
  
  const expertSkills = matchedSkills.filter(s => s.level === 'expert');
  if (expertSkills.length > 0) qualifications.push(`Expert in ${expertSkills[0].skill}`);
  
  return qualifications;
};

const generateStrengths = (matchedSkills, certifications, experienceYears) => {
  const strengths = [];
  
  const skillsByCategory = matchedSkills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(skillsByCategory).forEach(([category, count]) => {
    if (count >= 3) strengths.push(`Strong ${category} skills`);
  });
  
  if (certifications.length >= 2) strengths.push('Multiple industry certifications');
  if (experienceYears >= 7) strengths.push('Extensive industry experience');
  
  return strengths.length > 0 ? strengths : ['Foundational skills in relevant areas'];
};

const generateRecommendations = (skillGaps, experienceYears) => {
  const recommendations = [];
  
  if (skillGaps.length > 0) {
    const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'high').slice(0, 3);
    if (highPriorityGaps.length > 0) {
      recommendations.push(`Consider developing skills in: ${highPriorityGaps.map(g => g.skill).join(', ')}`);
    }
  }
  
  if (experienceYears < 2) {
    recommendations.push('Gain more hands-on project experience');
  }
  
  return recommendations.length > 0 ? recommendations : ['Continue building on existing strengths'];
};

const generateDetailedSummary = (score, matchedSkills, skillGaps, experienceYears) => {
  let summary = `Candidate scored ${score}% compatibility. `;
  
  if (matchedSkills.length > 0) {
    summary += `Strong matches in ${matchedSkills.length} key skills including ${matchedSkills.slice(0, 2).map(s => s.skill).join(' and ')}. `;
  }
  
  if (skillGaps.length > 0) {
    summary += `${skillGaps.length} skill gaps identified for optimal role fit. `;
  }
  
  summary += `${experienceYears} years of relevant experience.`;
  
  return summary;
};

module.exports = { parseResume };