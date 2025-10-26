import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

() {
  const { user, isCandidate } = useAuth();
  const [marketData, setMarketData] = useS
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

() => {
    fetchMarketInsi);
  }, []);

  con{
    try {

      setMarketData(response.data);
    } catr) {
      setError('Failed to load market data');
      console.error('Market data er
    } finally {
      setLoading(false);
    }
  };

  if{
rn (
      <Layout>
        <divdiv>
      </Layout>
    );
  }

  if (error || ta) {
    re (
   
'}</div>
      </Layout>
    );
  }

  const { overvData;

  r
ut>
      <div>
        <div cla
   d</h1>
p>
        </div>

        {/w */}
        <div
          <">
            <h3 className="tex3>
            <p className="text-3xl font-bold text-blue-600">{overview.totals}</p>
            <p className="text-sm text-green-600">{overview.jobGrowth} this month</p>
          </di>
    
          <div clasw-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg AI Threshold</h3>
            <p clas>
            <p cd</p>
          </div>

          <div className="bg-whw-md">
            <h3 className="text-lg font-semibold text-gr
            <p className="text-3xl font-bold text-green-600">>
            <p className="text-sm text-green-600">{overview.salaryGrowth} YoY growth</p>
          </div>
          
          <div c">
          
            <p className="text-3xl font-bold text-orange-600">
            <p className="text-sm text-gray-600">3-5 applicants/role</p>
          </div>
        </div>

        <d
          {/* Job Categories Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Job Categories Distribution</h2>
            <div className="space-y-4">
              {O=> {
           * 100);
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category}</span>
                )</span>
              v>
">
                      <div 
                        className="bg-blue-60ll" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills in Demand */}
          <div className="">
            <h2 className="text-xl font-semibold mb-4">Top Skills in Dema</h2>
            <div className=>
              {skillsInDemand.map((item, index) => (
                <div key={index} className="flex justify-be
                  <div>
                    <span >
                    <spa
                  
                 v>
                  center">
                2 mr-2">
<div 
                        className=
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-grspan>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Benchmar
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Salary 
          <div className="ove
            <table classNa">
              <thead>
                <tr clas>
                  <th h>
                 </th>
                  
                >
              >
   </tr>
              </thead>
              <tbody>
                {Object.entries(salaryData).map(([title, data]) => (
                  <tr key={title} className">
                    <td className="py-3 font-medi}</td>
                    <>
                    <td className="py-3 f/td>
                    <td className="py-3 text-gray-600">${data.m/td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded texsm ${
                        data.trend === 'up' ? 'bg-green-100 text00'
                      }`}>
                     }
                      
                    <>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white 
          <h2 className="text
          <div className=
            {marketTren
              <div >
                <div c">
                  <h
                 ${
              800'

                    {trend.imt} impact
                  </span>
                </div>
                <p className="text-2xl font-bold text
                <p className="text-gray-600 text-
                <p className="text-xs text-gray-500">{trend.jobCole</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bmd p-6">
          <h2 classNam</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="
              c"
            >
              /h3>
ns</p>
            </Link>
            
            <div className="p-4 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green
              <p c>
            </div>
            
            <">
              <h3 className="font-semibold text-purple-600 mb-2">Career Path</h
              <p className="text-sm text-gray-600">Get personalized career recommendations</p>
            </div>
          </div>
        </div>

        {/* Market Update Info */}
        <div class">
          La
        </div>
      </div>
    </Layout>
  );
}