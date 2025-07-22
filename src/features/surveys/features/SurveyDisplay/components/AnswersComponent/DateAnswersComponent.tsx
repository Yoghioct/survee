import React, { ChangeEvent } from 'react';
import Input from 'shared/components/Input/Input';
import useTranslation from 'next-translate/useTranslation';
import { DraftQuestionWithAnswer } from 'features/surveys/features/SurveyDisplay/managers/surveyAnswerManager';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';

interface DateAnswersComponentProps {
  questionData: DraftQuestionWithAnswer;
}

export default function DateAnswersComponent({ questionData }: DateAnswersComponentProps) {
  const { t } = useTranslation('survey');
  const { handleAnswerChange, isSubmitted } = useSurveyDisplayContext();

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleAnswerChange(e.target.value, questionData.id);
  };

  const getAnswerError = () => {
    if (!questionData.answer && isSubmitted && questionData.isRequired) {
      return t('requiredField');
    }
    return undefined;
  };

  return (
    <div>
      <Input
        type="date"
        value={questionData.answer}
        onInput={onAnswerChange}
        placeholder="Select a date..."
        error={getAnswerError()}
        centeredError
      />
    </div>
  );
} 