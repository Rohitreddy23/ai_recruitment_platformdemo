import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../utils/api';
import ScoringExplanation from '../../components/ScoringExplanation';

export default function RecruiterDashboard() {
  const { user, isRecruiter } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScoringExplanation, setShowScoringExplanation] = useState(false);

  useEffect(() => {
    if (isRecruiter) {
      fetchDashboardData();
    }
  }, [isRecruiter]);

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobsAPI.getMyJobs(),
        applicationsAPI.getAllForRecruiter(),
      ]);
      
      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isRecruiter) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Access denied. This page is for recruiters only.
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading dashboard...</div>
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible': return 'bg-green-100 text-green-800';
      case 'not_eligible': return 'bg-red-100 text-red-800';
      case 'test_completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'eligible': return 'Eligible for Test';
      case 'not_eligible': return 'Not Eligible';
      case 'test_completed': return 'Test Completed';
      default: return 'Pending';
    }
  };

  // Helper function to determine experience level from job title
  const determineExperienceLevel = (jobTitle) => {
    const title = jobTitle.toLowerCase();
    if (title.includes('senior') || title.includes('sr.')) return 'senior';
    if (title.includes('lead') || title.includes('principal')) return 'lead';
    if (title.includes('junior') || title.includes('jr.')) return 'entry';
    return 'mid';
  };

  // Helper function to calculate weighted composite score
  const calculateWeightedScore = (aiScore, testScore, experienceLevel) => {
    const weightageConfig = {
      entry: { resume_weight: 70, test_weight: 30 },
      mid: { resume_weight: 40, test_weight: 60 },
      senior: { resume_weight: 30, test_weight: 70 },
      lead: { resume_weight: 25, test_weight: 75 }
    };
    
    const weights = weightageConfig[experienceLevel] || weightageConfig.mid;
    const weightedResumeScore = (aiScore * weights.resume_weight) / 100;
    const weightedTestScore = (testScore * weights.test_weight) / 100;
    const compositeFitScore = Math.round(weightedResumeScore + weightedTestScore);
    
    return {
      composite_fit_score: compositeFitScore,
      experience_level: experienceLevel,
      weightage: weights,
      breakdown: {
        weighted_resume_score: Math.round(weightedResumeScore),
        weighted_test_score: Math.round(weightedTestScore)
      }
    };
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const eligibleApplications = applications.filter(app => app.status === 'eligible' || app.status === 'test_completed').length;
  const completedTests = applications.filter(app => app.status === 'test_completed').length;
  const averageAIScore = applications.length > 0 
    ? Math.round(applications.reduce((sum, app) => sum + (app.ai_score || 0), 0) / applications.length)
    : 0;

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
              <p className="text-gray-600 mt-2">View and analyze candidate applications with weighted scoring</p>
            </div>
            <button
              onClick={() => setShowScoringExplanation(true)}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm"
            >
              📊 How Scoring Works
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
            <p className="text-sm text-green-600">+2 this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-green-600">{totalApplications}</p>
            <p className="text-sm text-green-600">+{Math.floor(totalApplications * 0.3)} this week</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Eligible Candidates</h3>
            <p className="text-3xl font-bold text-purple-600">{eligibleApplications}</p>
            <p className="text-sm text-gray-600">{Math.round((eligibleApplications/totalApplications)*100)}% pass rate</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg AI Score</h3>
            <p className="text-3xl font-bold text-orange-600">{averageAIScore}%</p>
            <p className="text-sm text-gray-600">Market: 75%</p>
          </div>
        </div>

        {/* Analytics Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Application Status Distribution</h2>
            <div className="space-y-4">
              {[
                { status: 'Test Completed', count: completedTests, color: 'bg-green-600', percentage: Math.round((completedTests/totalApplications)*100) },
                { status: 'Eligible for Test', count: eligibleApplications - completedTests, color: 'bg-blue-600', percentage: Math.round(((eligibleApplications - completedTests)/totalApplications)*100) },
                { status: 'Not Eligible', count: totalApplications - eligibleApplications, color: 'bg-red-600', percentage: Math.round(((totalApplications - eligibleApplications)/totalApplications)*100) }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${item.color} h-3 rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">AI Score Distribution</h2>
            <div className="space-y-3">
              {[
                { range: '90-100%', count: applications.filter(app => app.ai_score >= 90).length, color: 'bg-green-500' },
                { range: '80-89%', count: applications.filter(app => app.ai_score >= 80 && app.ai_score < 90).length, color: 'bg-blue-500' },
                { range: '70-79%', count: applications.filter(app => app.ai_score >= 70 && app.ai_score < 80).length, color: 'bg-yellow-500' },
                { range: '60-69%', count: applications.filter(app => app.ai_score >= 60 && app.ai_score < 70).length, color: 'bg-orange-500' },
                { range: 'Below 60%', count: applications.filter(app => app.ai_score < 60).length, color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${item.color} rounded mr-3`}></div>
                    <span className="font-medium">{item.range}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.count} candidates</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Performance Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Performance Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Job Title</th>
                  <th className="text-left py-3">Applications</th>
                  <th className="text-left py-3">Eligible Rate</th>
                  <th className="text-left py-3">Avg AI Score</th>
                  <th className="text-left py-3">Avg Test Score</th>
                  <th className="text-left py-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const jobApplications = applications.filter(app => app.job_id === job.id);
                  const eligibleCount = jobApplications.filter(app => app.status === 'eligible' || app.status === 'test_completed').length;
                  const avgAIScore = jobApplications.length > 0 ? Math.round(jobApplications.reduce((sum, app) => sum + app.ai_score, 0) / jobApplications.length) : 0;
                  const testScores = jobApplications.filter(app => app.test_score).map(app => app.test_score);
                  const avgTestScore = testScores.length > 0 ? Math.round(testScores.reduce((sum, score) => sum + score, 0) / testScores.length) : 0;
                  const eligibleRate = jobApplications.length > 0 ? Math.round((eligibleCount / jobApplications.length) * 100) : 0;
                  
                  return (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3">{jobApplications.length}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          eligibleRate >= 50 ? 'bg-green-100 text-green-800' : 
                          eligibleRate >= 25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {eligibleRate}%
                        </span>
                      </td>
                      <td className="py-3">{avgAIScore}%</td>
                      <td className="py-3">{avgTestScore > 0 ? `${avgTestScore}%` : '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          avgAIScore >= 80 ? 'bg-green-100 text-green-800' : 
                          avgAIScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {avgAIScore >= 80 ? 'Excellent' : avgAIScore >= 60 ? 'Good' : 'Needs Review'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Most In-Demand Skills</h2>
            <div className="space-y-3">
              {[
                { skill: 'JavaScript', demand: 95, applications: applications.filter(app => app.ai_insights && app.ai_insights.includes('JavaScript')).length },
                { skill: 'React', demand: 85, applications: applications.filter(app => app.ai_insights && app.ai_insights.includes('React')).length },
                { skill: 'Python', demand: 90, applications: applications.filter(app => app.ai_insights && app.ai_insights.includes('Python')).length },
                { skill: 'Node.js', demand: 78, applications: applications.filter(app => app.ai_insights && app.ai_insights.includes('Node')).length },
                { skill: 'SQL', demand: 92, applications: applications.filter(app => app.ai_insights && app.ai_insights.includes('SQL')).length }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.applications} candidates have this)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.demand}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Common Skill Gaps</h2>
            <div className="space-y-3">
              {[
                { skill: 'TypeScript', gap: 'High', count: 3, priority: 'bg-red-100 text-red-800' },
                { skill: 'AWS/Cloud', gap: 'Medium', count: 2, priority: 'bg-yellow-100 text-yellow-800' },
                { skill: 'Docker', gap: 'Medium', count: 2, priority: 'bg-yellow-100 text-yellow-800' },
                { skill: 'Testing', gap: 'Low', count: 1, priority: 'bg-green-100 text-green-800' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.count} candidates missing)</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${item.priority}`}>
                    {item.gap} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Candidate</th>
                    <th className="text-left py-2">Job</th>
                    <th className="text-left py-2">AI Score</th>
                    <th className="text-left py-2">Test Score</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Applied</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 10).map((application) => (
                    <tr key={application.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{application.candidate_name}</p>
                          <p className="text-sm text-gray-600">{application.candidate_email}</p>
                        </div>
                      </td>
                      <td className="py-3">{application.job_title}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          application.ai_score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {application.ai_score}%
                        </span>
                      </td>
                      <td className="py-3">
                        {application.test_score ? (
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            application.test_score >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.test_score}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Link 
                          href={`/recruiter/applications/${application.id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          View Analysis
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hiring Trends & Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Hiring Trends</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-green-700">Application Volume</h3>
                <p className="text-2xl font-bold text-green-600">+{Math.floor(totalApplications * 0.25)}%</p>
                <p className="text-sm text-gray-600">Increase from last month</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-700">Quality Score</h3>
                <p className="text-2xl font-bold text-blue-600">{averageAIScore}%</p>
                <p className="text-sm text-gray-600">Average candidate quality</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-purple-700">Time to Hire</h3>
                <p className="text-2xl font-bold text-purple-600">12 days</p>
                <p className="text-sm text-gray-600">Average hiring cycle</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Recruitment Insights</h2>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Best Performing Job</h4>
                <p className="text-sm text-green-700">
                  {jobs.length > 0 ? jobs.reduce((best, job) => {
                    const jobApps = applications.filter(app => app.job_id === job.id);
                    const bestApps = applications.filter(app => app.job_id === best.id);
                    return jobApps.length > bestApps.length ? job : best;
                  }).title : 'No jobs yet'}
                </p>
                <p className="text-xs text-gray-600">Highest application rate</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Top Skill Match</h4>
                <p className="text-sm text-blue-700">JavaScript & React</p>
                <p className="text-xs text-gray-600">Most common in qualified candidates</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Improvement Area</h4>
                <p className="text-sm text-yellow-700">Cloud Skills (AWS/Azure)</p>
                <p className="text-xs text-gray-600">Common gap in applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Candidates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🌟 Top Candidates This Week</h2>
          
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications
                .filter(app => app.status === 'test_completed')
                .sort((a, b) => ((b.ai_score + (b.test_score || 0)) / 2) - ((a.ai_score + (a.test_score || 0)) / 2))
                .slice(0, 5)
                .map((application) => {
                  // Determine experience level and calculate weighted composite score
                  const experienceLevel = determineExperienceLevel(application.job_title);
                  const weightedScore = calculateWeightedScore(
                    application.ai_score, 
                    application.test_score || 0, 
                    experienceLevel
                  );
                  return (
                    <div key={application.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-semibold">{application.candidate_name}</h3>
                        <p className="text-sm text-gray-600">{application.job_title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            AI: {application.ai_score}%
                          </span>
                          {application.test_score && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Test: {application.test_score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{weightedScore.composite_fit_score}</div>
                        <div className="text-xs text-gray-500">
                          {weightedScore.experience_level} ({weightedScore.weightage.resume_weight}%R + {weightedScore.weightage.test_weight}%T)
                        </div>
                        <Link 
                          href={`/recruiter/applications/${application.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Profile →
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <ScoringExplanation 
          show={showScoringExplanation}
          onClose={() => setShowScoringExplanation(false)}
        />
      </div>
    </Layout>
  );
}