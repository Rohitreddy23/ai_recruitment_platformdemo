# ERD Alignment Summary

## ✅ **Perfect Alignment Achieved**

### **Key Corrections Made:**

#### **1. Threshold Score Logic:**
- **ERD Field:** `min_ai_score_threshold` 
- **Our Implementation:** `threshold_score`
- **Logic:** Candidate must score ≥ `min_ai_score_threshold` on AI analysis to be eligible for test

#### **2. Composite Fit Score Logic (ENHANCED WITH WEIGHTAGE):**
- **ERD Field:** `composite_fit_score`
- **Calculation:** Weighted based on experience level
  - **Entry Level:** `(ai_score × 70%) + (test_score × 30%)`
  - **Mid Level:** `(ai_score × 40%) + (test_score × 60%)`
  - **Senior Level:** `(ai_score × 30%) + (test_score × 70%)`
  - **Lead Level:** `(ai_score × 25%) + (test_score × 75%)`
- **Purpose:** Experience-appropriate evaluation for hiring decisions

### **Database Schema Mapping:**

#### **Candidate_table:**
```sql
- candidate_id (PK)
- name
- email  
- phone
```

#### **Job_Role_Table:**
```sql
- role_id (PK)
- role_name
- role_description
- min_ai_score_threshold  -- This is our threshold_score
- recruiter_id (FK)
```

#### **Resume_Analysis_table:**
```sql
- analysis_id (PK)
- candidate_id (FK)
- role_id (FK)
- ai_match_score         -- This is our ai_score
- matched_skills
- application_date
```

#### **Assessment_table:**
```sql
- assessment_id (PK)
- analysis_id (FK)
- objective_test_score   -- This is our test_score
- test_link_token
```

#### **Recruiter_decision_table:**
```sql
- decision_id (PK)
- analysis_id (FK)
- composite_fit_score    -- ai_match_score + objective_test_score
- hiring_status
- decision_comments
```

### **Application Flow (ERD Compliant):**

1. **Candidate applies** → Creates entries in `candidate_table` and `resume_analysis_table`
2. **AI analyzes resume** → Stores `ai_match_score` in `resume_analysis_table`
3. **Eligibility check** → If `ai_match_score >= min_ai_score_threshold`, create `assessment_table` entry
4. **Test taking** → Candidate uses `test_link_token` to take test
5. **Test completion** → Updates `objective_test_score` in `assessment_table`
6. **Composite calculation** → `composite_fit_score = ai_match_score + objective_test_score`
7. **Recruiter decision** → Stores final decision in `recruiter_decision_table`

### **API Endpoints (ERD Compliant):**

- `GET /api/erd/candidates` - Get all candidates with analysis
- `GET /api/erd/analysis/:analysisId` - Get detailed candidate analysis
- `POST /api/erd/apply` - Submit application (creates candidate + analysis)
- `GET /api/erd/test/:testToken` - Get test for candidate
- `POST /api/erd/submit-test/:testToken` - Submit test results
- `POST /api/erd/decision` - Make hiring decision

### **Score Calculations:**

#### **Eligibility:**
```javascript
const isEligible = ai_match_score >= min_ai_score_threshold;
```

#### **Weighted Composite Fit Score:**
```javascript
// Determine experience level from job title and years of experience
const experienceLevel = determineExperienceLevel(jobTitle, experienceYears);

// Apply appropriate weightage
const weightage = getWeightageConfig(experienceLevel);
const composite_fit_score = (ai_score × weightage.resume_weight) + (test_score × weightage.test_weight);
```

#### **Examples:**

**Entry-Level Developer:**
- AI Score: 75%, Test Score: 65%
- Calculation: (75 × 70%) + (65 × 30%) = 52.5 + 19.5 = **72 points**

**Mid-Level Developer:**
- AI Score: 75%, Test Score: 85%
- Calculation: (75 × 40%) + (85 × 60%) = 30 + 51 = **81 points**

**Senior Developer:**
- AI Score: 75%, Test Score: 90%
- Calculation: (75 × 30%) + (90 × 70%) = 22.5 + 63 = **86 points**

This provides experience-appropriate evaluation where entry-level focuses on potential while senior roles emphasize practical skills.