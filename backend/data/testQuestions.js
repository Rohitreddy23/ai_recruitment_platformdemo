// Hardcoded test questions for different job roles
const testQuestions = {
  'software developer': [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1,
      points: 10
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Object"],
      correct: 2,
      points: 10
    },
    {
      id: 3,
      question: "What does REST stand for in web services?",
      options: [
        "Representational State Transfer",
        "Remote State Transfer", 
        "Relational State Transfer",
        "Resource State Transfer"
      ],
      correct: 0,
      points: 15
    },
    {
      id: 4,
      question: "In React, what is the purpose of useEffect hook?",
      options: [
        "To manage component state",
        "To handle side effects",
        "To create components",
        "To style components"
      ],
      correct: 1,
      points: 15
    },
    {
      id: 5,
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        "No difference",
        "=== checks type and value, == only checks value",
        "== checks type and value, === only checks value", 
        "=== is faster than =="
      ],
      correct: 1,
      points: 20
    }
  ],
  
  'data scientist': [
    {
      id: 1,
      question: "What is overfitting in machine learning?",
      options: [
        "Model performs well on training data but poorly on test data",
        "Model performs poorly on both training and test data",
        "Model performs well on test data but poorly on training data",
        "Model has too few parameters"
      ],
      correct: 0,
      points: 15
    },
    {
      id: 2,
      question: "Which Python library is primarily used for data manipulation?",
      options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
      correct: 1,
      points: 10
    },
    {
      id: 3,
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "Sequential Query Language"
      ],
      correct: 0,
      points: 10
    },
    {
      id: 4,
      question: "In statistics, what does p-value represent?",
      options: [
        "Probability of the hypothesis being true",
        "Probability of observing the data given null hypothesis is true",
        "Percentage of variance explained",
        "Power of the test"
      ],
      correct: 1,
      points: 20
    },
    {
      id: 5,
      question: "Which algorithm is best for classification with small datasets?",
      options: ["Deep Neural Networks", "Random Forest", "SVM", "Linear Regression"],
      correct: 2,
      points: 15
    }
  ],

  'marketing manager': [
    {
      id: 1,
      question: "What does CTR stand for in digital marketing?",
      options: ["Click Through Rate", "Cost To Revenue", "Customer Target Reach", "Conversion Track Rate"],
      correct: 0,
      points: 10
    },
    {
      id: 2,
      question: "Which metric is most important for measuring brand awareness?",
      options: ["Conversion Rate", "Reach and Impressions", "Cost Per Click", "Return on Investment"],
      correct: 1,
      points: 15
    },
    {
      id: 3,
      question: "What is A/B testing used for?",
      options: [
        "Testing two different versions to see which performs better",
        "Testing website load times",
        "Testing database performance",
        "Testing user authentication"
      ],
      correct: 0,
      points: 15
    },
    {
      id: 4,
      question: "What does ROAS stand for?",
      options: [
        "Return on Advertising Spend",
        "Rate of Active Sales",
        "Revenue on Ad Sales",
        "Reach of Advertising Strategy"
      ],
      correct: 0,
      points: 20
    },
    {
      id: 5,
      question: "Which social media platform is best for B2B marketing?",
      options: ["Instagram", "TikTok", "LinkedIn", "Snapchat"],
      correct: 2,
      points: 10
    }
  ]
};

const getTestForJobTitle = (jobTitle) => {
  const normalizedTitle = jobTitle.toLowerCase();
  
  // Find matching test based on job title keywords
  for (const [key, questions] of Object.entries(testQuestions)) {
    if (normalizedTitle.includes(key)) {
      return questions;
    }
  }
  
  // Default to software developer test if no match found
  return testQuestions['software developer'];
};

module.exports = { testQuestions, getTestForJobTitle };