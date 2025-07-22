import React, { useState, useEffect } from 'react';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import { CompanyManager, Company } from 'features/company/companyManager';
import { ExclamationIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { QuestionWithLogicPath } from 'types/QuestionWithLogicPath';

interface CompanyAnswersComponentProps {
  questionData: QuestionWithLogicPath;
}

const CompanyAnswersComponent: React.FC<CompanyAnswersComponentProps> = ({
  questionData,
}) => {
  const { handleAnswerChange, isSubmitted } = useSurveyDisplayContext();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRequired = questionData.isRequired;
  const currentAnswer = questionData.answer;
  const hasError = isSubmitted && isRequired && !currentAnswer;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const companiesData = await CompanyManager.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelectionChange = (companyId: string) => {
    const selectedCompany = companies.find(company => company.id === companyId);
    if (selectedCompany) {
      handleAnswerChange(selectedCompany.name, questionData.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading companies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-600">
        <ExclamationIcon className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        <span>No companies available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {companies.map((company) => {
        const isSelected = currentAnswer === company.name;
        
        return (
          <label
            key={company.id}
            className={`
              flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${isSelected 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${hasError ? 'border-red-300' : ''}
            `}
          >
            <input
              type="radio"
              name={`company-${questionData.id}`}
              value={company.id}
              checked={isSelected}
              onChange={() => handleSelectionChange(company.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span 
              className={`ml-3 text-sm font-medium ${
                isSelected ? 'text-blue-900' : 'text-gray-700'
              }`}
            >
              {company.name}
            </span>
            {isSelected && (
              <CheckCircleIcon className="h-5 w-5 ml-auto text-blue-500" />
            )}
          </label>
        );
      })}
      
      {hasError && (
        <div className="flex items-center mt-2 text-red-600 text-sm">
          <ExclamationIcon className="h-4 w-4 mr-1" />
          <span>This field is required</span>
        </div>
      )}
    </div>
  );
};

export default CompanyAnswersComponent;
