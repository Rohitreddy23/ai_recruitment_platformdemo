import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { testsAPI } from '../../utils/api';

export default function SkillTest() {
  const router = useRouter();
  const { applicationId } = router.query;
  
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    if (applicationId) {
      fetchTest();
    }
  }, [applicationId]);

  useEffect(() => {
    if (testData && !result) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testData, result]);

  const fetchTest = async () => {
    try {
      const response = await testsAPI.getQuestions(applicationId);
      setTestData(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId),
      selectedOption: parseInt(selectedOption),
    }));

    try {
      const response = await testsAPI.submitAnswers(applicationId, formattedAnswers);
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading test...</div>
      </Layout>
    );
  }

  if (error && !testData) {
    return (
      <Layout>
        <div className="text-center text-red-600">{error}</div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-6 text-green-600">Test Completed!</h1>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Score</h3>
                <p className="text-3xl font-bold text-blue-600">{result.score}%</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Points Earned</h3>
                <p className="text-3xl font-bold text-green-600">
                  {result.total_points}/{result.max_points}
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {result.results.filter(r => r.correct).length}/{result.results.length}
                </p>
              </div>
            </div>

            <div className="text-left mb-6">
              <h3 className="text-xl font-semibold mb-4">Question Results</h3>
              {testData.questions.map((question, index) => {
                const questionResult = result.results.find(r => r.questionId === question.id);
                return (
                  <div key={question.id} className={`p-4 rounded-lg mb-3 ${
                    questionResult.correct ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                  }`}>
                    <p className="font-medium mb-2">
                      Question {index + 1}: {question.question}
                    </p>
                    <p className={`text-sm ${questionResult.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {questionResult.correct ? '✓ Correct' : '✗ Incorrect'} 
                      ({questionResult.points} points)
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-gray-600 mb-6">
              Your test results have been sent to the recruiter. They will review your application 
              and contact you if you're selected for the next round.
            </p>

            <button
              onClick={() => router.push('/jobs')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Browse More Jobs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Skill Assessment</h1>
              <p className="text-gray-600">
                {testData.job_title} - {testData.candidate_name}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600">Time remaining</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {testData.questions.map((question, index) => (
                <div key={question.id} className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Question {index + 1} ({question.points} points)
                  </h3>
                  <p className="text-gray-800 mb-4">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={optionIndex}
                          checked={answers[question.id] === optionIndex}
                          onChange={() => handleAnswerChange(question.id, optionIndex)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={submitting || Object.keys(answers).length !== testData.questions.length}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
              
              {Object.keys(answers).length !== testData.questions.length && (
                <p className="text-sm text-gray-600 mt-2">
                  Please answer all questions before submitting
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}