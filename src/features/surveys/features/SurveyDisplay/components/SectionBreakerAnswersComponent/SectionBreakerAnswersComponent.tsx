import React from 'react';
import { QuestionWithLogicPath } from 'types/QuestionWithLogicPath';

interface SectionBreakerAnswersComponentProps {
  questionData: QuestionWithLogicPath;
}

export default function SectionBreakerAnswersComponent({ 
  questionData 
}: SectionBreakerAnswersComponentProps) {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h7" 
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {questionData.title && (
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {questionData.title}
              </h3>
            )}
            {questionData.description && (
              <p className="text-sm text-gray-600 mb-3">
                {questionData.description}
              </p>
            )}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Step Break
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
