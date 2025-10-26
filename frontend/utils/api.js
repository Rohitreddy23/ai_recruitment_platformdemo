import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Jobs API
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  getMyJobs: () => api.get('/jobs/recruiter/my-jobs'),
};

// Applications API
export const applicationsAPI = {
  apply: (formData) => api.post('/applications/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByJobId: (jobId) => api.get(`/applications/job/${jobId}`),
  getAllForRecruiter: () => api.get('/applications/recruiter/all'),
  getById: (id) => api.get(`/applications/${id}`),
};

// Tests API
export const testsAPI = {
  getQuestions: (applicationId) => api.get(`/tests/application/${applicationId}`),
  submitAnswers: (applicationId, answers) => api.post(`/tests/submit/${applicationId}`, { answers }),
  getResults: (applicationId) => api.get(`/tests/results/${applicationId}`),
};

export default api;