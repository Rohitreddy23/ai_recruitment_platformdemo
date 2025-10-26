import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { jobsAPI, applicationsAPI } from '../../utils/api';

export default function JobDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicationResult, setApplicationResult] = useState(null);
  
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    resume: null,
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getById(id);
      setJob(response.data);
    } catch (error) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    setSuccess('');

    const submitData = new FormData();
    submitData.append('job_id', id);
    submitData.append('candidate_name', formData.candidate_name);
    submitData.append('candidate_email', formData.candidate_email);
    submitData.append('candidate_phone', formData.candidate_phone);
    submitData.append('resume', formData.resume);

    try {
      const response = await applicationsAPI.apply(submitData);
      setApplicationResult(response.data.application);
      setSuccess('Application submitted successfully!');
      
      // Reset form
      setFormData({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        resume: null,
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading job details...</div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="text-center text-red-600">Job not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <p className="text-gray-600 mb-2">Posted by {job.recruiter_name}</p>
          <p className="text-sm text-gray-500 mb-6">
            Posted on {new Date(job.created_at).toLocaleDateString()}
          </p>
          
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              AI Score Threshold: {job.threshold_score}%
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
          </div>
        </div>

        {applicationResult ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-green-600">Application Submitted!</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">AI Resume Analysis</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {applicationResult.ai_score}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Threshold: {job.threshold_score}%
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    applicationResult.eligible_for_test 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {applicationResult.eligible_for_test ? 'Eligible for Test' : 'Not Eligible'}
                  </span>
                </div>
              </div>
            </div>

            {applicationResult.eligible_for_test && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Next Steps</h3>
                <p className="text-green-700 mb-4">
                  Congratulations! Your resume meets the requirements. You can now take the skill assessment.
                </p>
                <a 
                  href={`/test/${applicationResult.id}`}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 inline-block"
                >
                  Take Skill Assessment
                </a>
              </div>
            )}

            {applicationResult.ai_insights && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">AI Insights</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Summary:</strong> {applicationResult.ai_insights.summary}
                  </p>
                  {applicationResult.ai_insights.skills_matched && (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Skills Matched:</strong> {applicationResult.ai_insights.skills_matched.join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    <strong>Experience:</strong> {applicationResult.ai_insights.experience_years} years
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Apply for this Position</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="candidate_name"
                    value={formData.candidate_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="candidate_email"
                    value={formData.candidate_email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="candidate_phone"
                  value={formData.candidate_phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Resume (PDF only) *
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Your resume will be analyzed by AI to determine compatibility with this role.
                </p>
              </div>

              <button
                type="submit"
                disabled={applying}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {applying ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}