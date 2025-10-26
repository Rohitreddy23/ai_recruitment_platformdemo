import { useState } from 'react';

const ScoringExplanation = ({ show = false, onClose }) => {
  if (!show) return null;

  const weightageConfig = {
    entry: { resume: 70, test: 30, description: 'Entry-level roles focus more on potential and educational background' },
    mid: { resume: 40, test: 60, description: 'Mid-level roles balance resume credentials with practical skills' },
    senior: { resume: 30, test: 70, description: 'Senior roles emphasize practical skills and problem-solving ability' },
    lead: { resume: 25, test: 75, description: 'Leadership roles require strong practical skills and decision-making' }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Composite Fit Score Calculation</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How It Works</h3>
            <p className="text-blue-700 text-sm">
              The Composite Fit Score uses weighted calculations based on experience level. 
              Different roles require different evaluation approaches.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Weightage by Experience Level</h3>
            
            {Object.entries(weightageConfig).map(([level, config]) => (
              <div key={level} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">{level} Level</span>
                  <span className="text-sm text-gray-600">
                    {config.resume}% Resume + {config.test}% Test
                  </span>
                </div>
                <p className="text-sm text-gray-600">{config.description}</p>
                
                <div className="mt-2 flex space-x-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Resume Weight</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${config.resume}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Test Weight</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${config.test}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Example Calculation</h3>
            <div className="text-sm space-y-1">
              <p><strong>Mid-level Developer:</strong></p>
              <p>• AI Resume Score: 80%</p>
              <p>• Test Score: 90%</p>
              <p>• Calculation: (80 × 40%) + (90 × 60%) = 32 + 54 = <strong>86 points</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringExplanation;