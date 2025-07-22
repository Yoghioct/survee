import React from 'react';
import LogicalJump from 'features/surveys/features/SurveyCreator/components/LogicalJump/LogicalJump';
import { DraftQuestion } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';
import { ComparisonType } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';

import useTranslation from 'next-translate/useTranslation';
import { getAvailableOptions } from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/utils/getAvailableOptions';
import { getAvailableComparisons } from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/utils/getAvailableComparisons';
import { getAvailableJumps } from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/utils/getAvailableJumps';

interface NumberAdvancedSettingsProps {
  questionData: DraftQuestion;
  questionIndex: number;
}

export default function NumberAdvancedSettings({
  questionData,
  questionIndex,
}: NumberAdvancedSettingsProps) {
  const { questions } = useSurveyCreatorContext();

  const { t } = useTranslation('surveyCreate');

  return (
    <div>
      <LogicalJump
        questionIndex={questionIndex}
        conditions={
          questionData.logicPaths?.map(() => ({
            comparisons: getAvailableComparisons(
              [
                ComparisonType.LESS_THAN,
                ComparisonType.GREATER_THAN,
                ComparisonType.EQUAL,
              ],
              t
            ),
            options: getAvailableOptions([]),
            jumpQuestions: getAvailableJumps(questions, questionData),
          })) ?? []
        }
      />
    </div>
  );
} 