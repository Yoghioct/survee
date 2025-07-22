import React, { ChangeEvent } from 'react';
import Input from 'shared/components/Input/Input';
import useTranslation from 'next-translate/useTranslation';
import { DraftQuestionWithAnswer } from 'features/surveys/features/SurveyDisplay/managers/surveyAnswerManager';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';

interface TextareaAnswersComponentProps {
  questionData: DraftQuestionWithAnswer;
}

export default function TextareaAnswersComponent({ questionData }: TextareaAnswersComponentProps) {
  const { t } = useTranslation('survey');
  const { handleAnswerChange, isSubmitted } = useSurveyDisplayContext();

  const onAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        className="w-full rounded border p-2 text-sm"
        value={questionData.answer}
        onInput={onAnswerChange}
        placeholder={t('textareaPlaceholder')}
        rows={4}
      />
      {getAnswerError() && <p className="mt-2 text-sm text-red-500">{getAnswerError()}</p>}
    </div>
  );
} 