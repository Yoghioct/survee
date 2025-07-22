import clsx from 'clsx';
import SurveyDisplay from 'features/surveys/features/SurveyDisplay/SurveyDisplay';
import React from 'react';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';
import { usePreviewPanelContext } from 'features/surveys/features/SurveyCreator/managers/previewPanelManager/context';
import { RefreshIcon, XIcon } from '@heroicons/react/outline';
import { LogicPath } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';
import Button from 'shared/components/Button/Button';
import { SurveyWithQuestions } from 'types/SurveyWithQuestions';
import { QuestionWithLogicPath } from 'types/QuestionWithLogicPath';
import { CreateEditSurveyPayload } from 'pages/api/survey';

export default function PreviewPanel() {
  const { questions, title, surveyOptions, associatedCompanies } = useSurveyCreatorContext();
  const { isPanelOpened, togglePanel, handleRestart, restartTrigger } =
    usePreviewPanelContext();

  // Logic for step behavior:
  // - oneQuestionPerStep: true -> OneQuestionView (one question per step)
  // - oneQuestionPerStep: false + SECTION_BREAKER -> MultiStepView (multiple questions per step with breaks)  
  // - oneQuestionPerStep: false + no SECTION_BREAKER -> AllQuestionsView (all questions in one page)
  const hasSectionBreakers = questions.some(question => question.type === 'SECTION_BREAKER');
  const shouldUseOneQuestionPerStep = surveyOptions.oneQuestionPerStep;
  const shouldUseMultiStep = !surveyOptions.oneQuestionPerStep && hasSectionBreakers;

  return (
    <>
      {isPanelOpened && (
        <div
          onClick={togglePanel}
          className={'fixed h-full w-full bg-black/20 xl:hidden'}
        ></div>
      )}

      <div
        className={clsx(
          'fixed bottom-0 right-0 top-[var(--navigation-height)] w-[550px] max-w-[calc(100vw-(100vw-100%))] items-center overflow-hidden border-l shadow transition-transform duration-500 ease-in-out',
          !isPanelOpened && 'translate-x-full'
        )}
      >
        <div className="flex h-[42px] items-center justify-between border-b bg-zinc-50 px-4 pl-2 text-left font-semibold">
          <div className="flex items-center gap-4">
            <Button onClick={handleRestart} className="h-[26px] text-xs">
              Restart Survey <RefreshIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <XIcon onClick={togglePanel} className="h-5 w-5 cursor-pointer" />
        </div>
        <div className="no-scrollbar h-[calc(100%-42px)] overflow-auto bg-white p-6 ">
          {/* <Background hideAccents /> */}
          <SurveyDisplay
            previewMode
            restartTrigger={restartTrigger}
            initialData={{
              isActive: true,
              description: '',
              id: '',
              displayTitle: surveyOptions.displayTitle,
              oneQuestionPerStep: shouldUseOneQuestionPerStep,
              hideProgressBar: surveyOptions.hideProgressBar,
              userId: '',
              title,
              accentColor: surveyOptions.accentColor,
              createdAt: new Date(),
              questions: questions.map((question: any, index: number) => ({
                surveyId: '',
                options: question.options ?? [],
                selectedCompanies: question.selectedCompanies ?? [],
                order: index,
                createdAt: new Date(),
                id: question.draftId,
                title: question.title,
                type: question.type as import('shared/constants/surveysConfig').QuestionType,
                answers: [],
                description: question.description || '',
                logicPaths: (question.logicPaths as LogicPath[]) ?? [],
                isRequired: question.isRequired,
              })),
              displayLogo: surveyOptions.displayLogo ?? true,
              showDisclaimer: false,
              disclaimerTitle: '',
              disclaimerBody: '',
              thankYouLogic: [],
              associatedCompanies: associatedCompanies,
            }}
          />
        </div>
      </div>
    </>
  );
}
