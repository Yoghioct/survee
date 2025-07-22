import React from 'react';
import useTranslation from 'next-translate/useTranslation';

interface SectionBreakerQuestionBlockProps {
  questionIndex: number;
}

export default function SectionBreakerQuestionBlock({ 
  questionIndex 
}: SectionBreakerQuestionBlockProps) {
  const { t } = useTranslation('surveyCreate');

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
            <h3 className="text-lg font-medium text-gray-900">
              Step Break
            </h3>
            <p className="text-sm text-gray-600">
              This creates a step break in your survey. When "One question per step" is disabled, questions will be grouped into multiple steps using these breaks.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Step {Math.floor(questionIndex / 10) + 1}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 italic">
        💡 Tip: Step breaks work when "One question per step" is OFF to create multi-step forms
      </div>
    </div>
  );
}
