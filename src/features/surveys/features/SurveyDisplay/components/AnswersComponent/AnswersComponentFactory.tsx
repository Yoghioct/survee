import { QuestionType } from 'shared/constants/surveysConfig';

import useTranslation from 'next-translate/useTranslation';
import Button, {
  ButtonSize,
  ButtonVariant,
} from 'shared/components/Button/Button';
import ChoiceComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/ChoiceComponent/ChoiceComponent';
import ListAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/ListAnswersComponent';
import NumberAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/NumberAnswersComponent';
import RateAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/RateComponent/RateComponent';
import TextAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/TextAnswersComponent';
import DateAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/DateAnswersComponent';
import TextareaAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/TextareaAnswersComponent';
import CompanyAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/CompanyAnswersComponent';
import SectionAnswersComponent from 'features/surveys/features/SurveyDisplay/components/AnswersComponent/SectionAnswersComponent';
import SectionBreakerAnswersComponent from 'features/surveys/features/SurveyDisplay/components/SectionBreakerAnswersComponent/SectionBreakerAnswersComponent';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import { getFontColor } from 'features/surveys/features/SurveyDisplay/utils/getFontColor';

interface AnswersComponentFactoryProps {
  questionIndex: number;
}
export const AnswersComponentFactory = (
  props: AnswersComponentFactoryProps
) => {
  const { t } = useTranslation('survey');

  const {
    isAnswering,
    formData,
    activeQuestionIndex,
    handleNextQuestion,
    handlePreviousQuestion,
  } = useSurveyDisplayContext();

  const isBackButtonVisible =
    !!handlePreviousQuestion &&
    !!activeQuestionIndex &&
    activeQuestionIndex > 0;

  const isNextButtonVisible = !!handleNextQuestion;

  const currentQuestion = formData?.questions[props.questionIndex];
  const isLastQuestion = activeQuestionIndex === formData?.questions.length - 1;

  return (
    <div className="mb-3 rounded-md border bg-white p-4 shadow">
      <div
        className={`rounded-md p-4 ${
          currentQuestion.type === QuestionType.SECTION
            ? 'bg-purple-900 text-white'
            : currentQuestion.type === QuestionType.SECTION_BREAKER
            ? 'bg-purple-800 text-white'
            : ''
        }`}
      >
        {currentQuestion.type !== QuestionType.SECTION && currentQuestion.type !== QuestionType.SECTION_BREAKER ? (
          <h2 className="text-lg font-semibold">
            {currentQuestion.title.trim() || '-'}
          </h2>
        ) : (
          <h1 className="text-2xl font-semibold">
            {currentQuestion.title.trim() || '-'}
          </h1>
        )}

        {currentQuestion.description && (
          <p
            className={`mt-1 text-sm ${
              currentQuestion.type === QuestionType.SECTION || currentQuestion.type === QuestionType.SECTION_BREAKER
                ? 'text-gray-100'
                : 'text-gray-600'
            }`}
          >
            {currentQuestion.description}
          </p>
        )}
      </div>
      {currentQuestion.type === QuestionType.EMOJI && (
        <ListAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.INPUT && (
        <TextAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.CHOICE && (
        <ChoiceComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.NUMBER && (
        <NumberAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.RATE && (
        <RateAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.DATE && (
        <DateAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.TEXTAREA && (
        <TextareaAnswersComponent questionData={currentQuestion} />
      )}
      {currentQuestion.type === QuestionType.COMPANY && (
        <CompanyAnswersComponent questionData={currentQuestion} />
      )}
      {/* {currentQuestion.type === QuestionType.SECTION && (
        <SectionAnswersComponent questionData={currentQuestion} />
      )} */}
      {/* {currentQuestion.type === QuestionType.SECTION_BREAKER && (
        <SectionBreakerAnswersComponent questionData={currentQuestion} />
      )} */}

      {formData.oneQuestionPerStep && (
        <div className="mt-6 flex flex-col-reverse gap-x-4 gap-y-2 sm:flex-row">
          {isBackButtonVisible && (
            <Button
              variant={ButtonVariant.OUTLINE}
              sizeType={ButtonSize.FULL}
              onClick={handlePreviousQuestion}
              disabled={isAnswering}
              className="text-black"
            >
              {t('back')}
            </Button>
          )}

          {isNextButtonVisible && (
            <Button
              variant={ButtonVariant.PRIMARY}
              sizeType={ButtonSize.FULL}
              onClick={handleNextQuestion}
              isLoading={isAnswering}
              style={{
                backgroundColor: formData.accentColor ?? undefined,
                color: getFontColor(formData.accentColor),
              }}
            >
              {isLastQuestion ? t('sendButton') : t('next')}
            </Button>
          )}
        </div>
      )}
    </div>

  );
};
