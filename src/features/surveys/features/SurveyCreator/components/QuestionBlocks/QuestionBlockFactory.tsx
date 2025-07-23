import { QuestionType } from 'shared/constants/surveysConfig';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import ChoiceQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/ChoiceQuestionBlock/ChoiceQuestionBlock';
import EmojiQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/EmojiQuestionBlock/EmojiQuestionBlock';
import InputQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/InputQuestionBlock/InputQuestionBlock';
import NumberQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/NumberQuestionBlock/NumberQuestionBlock';
import QuestionBlockWrapper from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/QuestionBlockWrapper/QuestionBlockWrapper';
import RateQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/RateQuestionBlock/RateQuestionBlock';
import { DraftQuestion } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';
import RateAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/RateAdvancedSettings';
import ChoiceAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/ChoiceAdvancedSettings';
import EmojiAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/EmojiAdvancedSettings';
import InputAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/InputAdvancedSettings';
import NumberAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/NumberAdvancedSettings';
import DateQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/DateQuestionBlock/DateQuestionBlock';
import TextareaQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/TextareaQuestionBlock/TextareaQuestionBlock';
import CompanyQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/CompanyQuestionBlock/CompanyQuestionBlock';
import SectionQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/SectionQuestionBlock/SectionQuestionBlock';
import SectionBreakerQuestionBlock from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/SectionBreakerQuestionBlock/SectionBreakerQuestionBlock';
import CompanyAdvancedSettings from 'features/surveys/features/SurveyCreator/components/QuestionBlocks/AdvancedSettings/CompanyAdvancedSettings';

interface QuestionBlockFactoryProps {
  questionData: DraftQuestion;
  questionIndex: number;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function QuestionBlockFactory({
  questionIndex,
  dragHandleProps,
  questionData,
}: QuestionBlockFactoryProps) {
  const getAdvancedSettings = () => {
    if (questionData.type === QuestionType.EMOJI) {
      return (
        <EmojiAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.RATE) {
      return (
        <RateAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.CHOICE) {
      return (
        <ChoiceAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.INPUT) {
      return (
        <InputAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.NUMBER) {
      return (
        <NumberAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.COMPANY) {
      return (
        <CompanyAdvancedSettings
          questionData={questionData}
          questionIndex={questionIndex}
        />
      );
    }

    if (questionData.type === QuestionType.DATE) {
      return null; // or DateAdvancedSettings if needed
    }
    if (questionData.type === QuestionType.TEXTAREA) {
      return null; // or TextareaAdvancedSettings if needed
    }

    if (questionData.type === QuestionType.SECTION) {
      return null; // Section breaks don't need advanced settings
    }

    if (questionData.type === QuestionType.SECTION_BREAKER) {
      return null; // Section breakers don't need advanced settings
    }

    return null;
  };

  return (
    <QuestionBlockWrapper
      dragHandleProps={dragHandleProps}
      index={questionIndex}
      questionData={questionData}
      advancedSettings={getAdvancedSettings()}
    >
      {questionData.type === QuestionType.RATE && <RateQuestionBlock />}
      {questionData.type === QuestionType.INPUT && <InputQuestionBlock />}
      {questionData.type === QuestionType.CHOICE && (
        <ChoiceQuestionBlock
          options={questionData.options ?? []}
          questionIndex={questionIndex}
        />
      )}
      {questionData.type === QuestionType.EMOJI && (
        <EmojiQuestionBlock
          pack={questionData.options ?? []}
          questionIndex={questionIndex}
        />
      )}
      {questionData.type === QuestionType.NUMBER && <NumberQuestionBlock />}
      {questionData.type === QuestionType.DATE && <DateQuestionBlock />}
      {questionData.type === QuestionType.TEXTAREA && <TextareaQuestionBlock />}
      {questionData.type === QuestionType.COMPANY && (
        <CompanyQuestionBlock
          questionIndex={questionIndex}
        />
      )}
      {/* {questionData.type === QuestionType.SECTION && (
        <SectionQuestionBlock
          questionIndex={questionIndex}
        />
      )} */}
      {/* {questionData.type === QuestionType.SECTION_BREAKER && (
        <SectionBreakerQuestionBlock
          questionIndex={questionIndex}
        />
      )} */}
    </QuestionBlockWrapper>
  );
}
