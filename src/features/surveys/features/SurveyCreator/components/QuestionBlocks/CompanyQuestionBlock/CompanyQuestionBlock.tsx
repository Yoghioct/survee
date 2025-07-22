import React from 'react';
import useTranslation from 'next-translate/useTranslation';

interface CompanyQuestionBlockProps {
  questionIndex: number;
}

export default function CompanyQuestionBlock({ 
  questionIndex 
}: CompanyQuestionBlockProps) {
  const { t } = useTranslation('surveyCreate');

  return null;
}
