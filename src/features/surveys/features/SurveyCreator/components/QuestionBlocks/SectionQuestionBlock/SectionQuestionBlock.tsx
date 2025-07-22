import React from 'react';
import useTranslation from 'next-translate/useTranslation';

interface SectionQuestionBlockProps {
  questionIndex: number;
}

export default function SectionQuestionBlock({ 
  questionIndex 
}: SectionQuestionBlockProps) {
  const { t } = useTranslation('surveyCreate');

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-purple-600" 
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
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900">
              Section Break
            </h3>
            <p className="text-sm text-gray-600">
              This creates a section break in your survey. Questions after this will be displayed on a separate step.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Section {Math.floor(questionIndex / 10) + 1}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 italic">
        💡 Tip: Section breaks will automatically enable multiple-step mode in your survey preview
      </div>
    </div>
  );
}
