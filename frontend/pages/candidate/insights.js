import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function CandidateInsights() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarketInsights();
  }, []);

  const fetchMarketInsights = async () => {
    try {
      const response = await api.get('/insights/market');
      setMarketData(response.data);
    } catch (error) {
      setError('Failed to load market data');
      console.error('Market data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading market insights...</div>
      </Layout>
    );
  }

  if (error || !marketData) {
    return (
      <Layout>
        <div className="text-center text-red-600">{error || 'Failed to load market data'}</div>
      </Layout>
    );
  }

  const { overview, jobCategories, salaryData, skillsInDemand, marketTrends } = marketData;

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Market Insights Dashboard</h1>
          <p className="text-gray-600 mt-2">Stay informed about job market trends and opportunities</p>
        </div>

        {/* Market Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">{overview.totalJobs}</p>
            <p className="text-sm text-green-600">{overview.jobGrowth} this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg AI Threshold</h3>
            <p className="text-3xl font-bold text-purple-600">{overview.avgThreshold}%</p>
            <p className="text-sm text-gray-600">Market standard</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Salary Range</h3>
            <p className="text-3xl font-bold text-green-600">${(overview.avgSalary / 1000).toFixed(0)}K</p>
            <p className="text-sm text-green-600">{overview.salaryGrowth} YoY growth</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Competition Level</h3>
            <p className="text-3xl font-bold text-orange-600">{overview.competitionLevel}</p>
            <p className="text-sm text-gray-600">3-5 applicants/role</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Job Categories Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Job Categories Distribution</h2>
            <div className="space-y-4">
              {Object.entries(jobCategories).map(([category, count]) => {
                const percentage = Math.round((count / overview.totalJobs) * 100);
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm text-gray-600">{count} jobs ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills in Demand */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Top Skills in Demand</h2>
            <div className="space-y-3">
              {skillsInDemand.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-sm text-green-600 ml-2">{item.growth}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.jobs} jobs)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.demand}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Benchmarking */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">💰 Salary Benchmarking</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Job Title</th>
                  <th className="text-left py-3">Min Salary</th>
                  <th className="text-left py-3">Average</th>
                  <th className="text-left py-3">Max Salary</th>
                  <th className="text-left py-3">Market Trend</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(salaryData).map(([title, data]) => (
                  <tr key={title} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{title}</td>
                    <td className="py-3 text-gray-600">${data.min.toLocaleString()}</td>
                    <td className="py-3 font-semibold text-green-600">${data.avg.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">${data.max.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        data.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {data.trend === 'up' ? '↗ Growing' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📈 Market Trends & Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {marketTrends.map((trend, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{trend.trend}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    trend.impact === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trend.impact} impact
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">{trend.growth}</p>
                <p className="text-gray-600 text-sm mb-2">{trend.description}</p>
                <p className="text-xs text-gray-500">{trend.jobCount} related jobs available</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Recommended Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/jobs"
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Browse Jobs</h3>
              <p className="text-sm text-gray-600">Explore {overview.totalJobs} available positions</p>
            </Link>
            
            <div className="p-4 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">Skill Assessment</h3>
              <p className="text-sm text-gray-600">Test your skills against market standards</p>
            </div>
            
            <div className="p-4 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-600 mb-2">Career Path</h3>
              <p className="text-sm text-gray-600">Get personalized career recommendations</p>
            </div>
          </div>
        </div>

        {/* Market Update Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date(marketData.lastUpdated).toLocaleDateString()} at {new Date(marketData.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </Layout>
  );
}