import Layout from '../components/Layout';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isRecruiter } = useAuth();

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          AI-Powered Recruitment Platform
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Streamline your hiring process with AI resume parsing and skill assessments. 
          Find the right candidates faster and more accurately.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">For Recruiters</h2>
            <p className="text-gray-600 mb-6">
              Access detailed candidate insights with AI-powered resume analysis, skill gap identification, 
              certification tracking, and comprehensive candidate profiles.
            </p>
            {isAuthenticated && isRecruiter ? (
              <Link href="/recruiter/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
                View Candidate Insights
              </Link>
            ) : (
              <Link href="/register?role=recruiter" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
                Register as Recruiter
              </Link>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">For Candidates</h2>
            <p className="text-gray-600 mb-6">
              Access comprehensive market insights including salary benchmarking, job trends, 
              skills in demand, and personalized career recommendations.
            </p>
            {isAuthenticated && !isRecruiter ? (
              <div className="space-y-3">
                <Link href="/candidate/insights" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 inline-block w-full text-center">
                  View Market Insights
                </Link>
                <Link href="/jobs" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block w-full text-center">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <Link href="/jobs" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 inline-block">
                View Jobs
              </Link>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Upload Resume</h4>
              <p className="text-gray-600">Candidates upload their resume when applying for jobs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-gray-600">AI parses resume and generates compatibility score</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Skill Assessment</h4>
              <p className="text-gray-600">Eligible candidates take role-specific tests</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}