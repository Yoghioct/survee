import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from 'shared/components/Header/Header';
import Button, {
  ButtonSize,
  ButtonVariant,
} from 'shared/components/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import { AnswersComponentFactory } from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/AnswersComponentFactory';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import { getFontColor } from 'features/surveys/features/SurveyDisplay/utils/getFontColor';

export default function MultiStepView() {
  const { t } = useTranslation('survey');
  const { handleSave, isAnswering, formData } = useSurveyDisplayContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidationError, setShowValidationError] = useState(false);

  // Group questions by SECTION_BREAKER
  const groupQuestionsBySteps = () => {
    const steps: number[][] = [];
    let currentStepQuestions: number[] = [];

    formData?.questions.forEach((question, index) => {
      if (question.type === 'SECTION_BREAKER' && currentStepQuestions.length > 0) {
        // Save current step and start new one
        steps.push([...currentStepQuestions]);
        currentStepQuestions = [];
      }
      
      // Add non-section-breaker questions to current step
      if (question.type !== 'SECTION_BREAKER') {
        currentStepQuestions.push(index);
      }
    });

    // Add remaining questions to final step
    if (currentStepQuestions.length > 0) {
      steps.push(currentStepQuestions);
    }

    return steps.length > 0 ? steps : [[...Array(formData?.questions.length || 0).keys()]];
  };

  const steps = groupQuestionsBySteps();
  const totalSteps = steps.length;
  const currentStepQuestions = useMemo(() => steps[currentStep] || [], [steps, currentStep]);
  const isLastStep = currentStep === totalSteps - 1;

  // Validate current step required fields
  const isCurrentStepValid = useCallback(() => {
    return currentStepQuestions.every(questionIndex => {
      const question = formData?.questions[questionIndex];
      if (!question) return true;
      
      // Skip validation for SECTION and SECTION_BREAKER
      if (question.type === 'SECTION' || question.type === 'SECTION_BREAKER') {
        return true;
      }
      
      // If question is required, check if it has an answer
      if (question.isRequired) {
        const answer = question.answer;
        
        // Different validation based on question type
        switch (question.type) {
          case 'CHOICE':
          case 'EMOJI':
          case 'RATE':
          case 'COMPANY':
            return answer && answer.trim() !== '';
          case 'INPUT':
          case 'TEXTAREA':
          case 'NUMBER':
          case 'DATE':
            return answer && answer.trim() !== '';
          default:
            return answer && answer.trim() !== '';
        }
      }
      
      return true;
    });
  }, [currentStepQuestions, formData?.questions]);

  // Clear validation error when answers change
  useEffect(() => {
    if (showValidationError && isCurrentStepValid()) {
      setShowValidationError(false);
    }
  }, [formData?.questions, showValidationError, isCurrentStepValid]);

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      setShowValidationError(true);
      return;
    }
    
    setShowValidationError(false);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setShowValidationError(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!isCurrentStepValid()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    handleSave();
  };

  return (
    <>
      {formData?.displayTitle && (
        <Header>{formData?.title.trim() || '-'}</Header>
      )}

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              backgroundColor: formData?.accentColor || '#2563eb'
            }}
          ></div>
        </div>
      </div>

      {/* Current step questions */}
      <div className="space-y-4">
        {currentStepQuestions.map((questionIndex) => (
          <AnswersComponentFactory key={formData?.questions[questionIndex]?.id} questionIndex={questionIndex} />
        ))}
      </div>

      {/* Validation error message */}
      {showValidationError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-700 text-sm">
              {t('fillRequiredFields')}
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          variant={ButtonVariant.OUTLINE}
          sizeType={ButtonSize.MEDIUM}
          disabled={currentStep === 0}
        >
          {t('back')}
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            variant={ButtonVariant.PRIMARY}
            sizeType={ButtonSize.MEDIUM}
            isLoading={isAnswering}
            disabled={!isCurrentStepValid()}
            style={{
              backgroundColor: formData?.accentColor ?? undefined,
              color: getFontColor(formData?.accentColor),
            }}
          >
            {t('sendButton')}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant={ButtonVariant.PRIMARY}
            sizeType={ButtonSize.MEDIUM}
            disabled={!isCurrentStepValid()}
            style={{
              backgroundColor: formData?.accentColor ?? undefined,
              color: getFontColor(formData?.accentColor),
            }}
          >
            {t('next')}
          </Button>
        )}
      </div>
    </>
  );
}