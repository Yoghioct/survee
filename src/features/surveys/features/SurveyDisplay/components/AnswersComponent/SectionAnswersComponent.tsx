import React from 'react';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';

interface SectionAnswersComponentProps {
  questionData: any;
}

export default function SectionAnswersComponent({ 
  questionData 
}: SectionAnswersComponentProps) {
  const { formData } = useSurveyDisplayContext();

  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
        <svg 
          className="w-8 h-8 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {questionData.title || 'Section Break'}
      </h2>
      
      {questionData.description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {questionData.description}
        </p>
      )}
      
      <div className="text-sm text-gray-500">
        Ready to continue? Click next to proceed.
      </div>
    </div>
  );
}
