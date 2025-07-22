import useTranslation from 'next-translate/useTranslation';

import React from 'react';
import StyledDialog from 'shared/components/StyledDialog/StyledDialog';
import { DraftQuestion } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';
import { QuestionType } from 'shared/constants/surveysConfig';
import { v4 } from 'uuid';
import NewQuestionModalButton from 'features/surveys/features/SurveyCreator/components/NewQuestionModal/components/NewQuestionModalButton';
import EmojiIcon from 'shared/components/QuestionTypeIcons/EmojiIcon';
import InputIcon from 'shared/components/QuestionTypeIcons/InputIcon';
import ChoiceIcon from 'shared/components/QuestionTypeIcons/ChoiceIcon';
import RateIcon from 'shared/components/QuestionTypeIcons/RateIcon';
import NumberIcon from 'shared/components/QuestionTypeIcons/NumberIcon';
import SectionIcon from 'shared/components/QuestionTypeIcons/SectionIcon';
import SectionBreakerIcon from 'shared/components/QuestionTypeIcons/SectionBreakerIcon';
import DateIcon from 'shared/components/QuestionTypeIcons/DateIcon';
import TextareaIcon from 'shared/components/QuestionTypeIcons/TextareaIcon';
import CompanyIcon from 'shared/components/QuestionTypeIcons/CompanyIcon';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';

type NewQuestionModalProps = {
  isOpened: boolean;
  closeModal: () => void;
  onSuccess?: (newQuestion: DraftQuestion) => void;
};

export default function NewQuestionModal({
  isOpened,
  closeModal,
  onSuccess,
}: NewQuestionModalProps) {
  const { t } = useTranslation('surveyCreate');
  const { questions } = useSurveyCreatorContext();
  
  // Check if a Company question already exists
  const hasCompanyQuestion = questions.some(question => question.type === QuestionType.COMPANY);
  const addEmojiQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.EMOJI,
      title: 'How are you feeling today?',
      isRequired: true,
      options: [
        ':rage:',
        ':slightly_frowning_face:',
        ':slightly_smiling_face:',
        ':smiley:',
      ],
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addInputQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.INPUT,
      title: 'Tell us more',
      isRequired: true,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addChoiceQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.CHOICE,
      title: 'Are you happy?',
      isRequired: true,
      options: ['Ya', 'Tidak'],
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addRateQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.RATE,
      title: 'How do you rate the process?',
      isRequired: true,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addNumberQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.NUMBER,
      title: 'How many?',
      isRequired: true,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addSectionQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.SECTION,
      title: 'Section Title',
      isRequired: false,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addSectionBreakerQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.SECTION_BREAKER,
      title: 'Step Break',
      isRequired: false,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addDateQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.DATE,
      title: 'Select a date',
      isRequired: true,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };
  const addTextareaQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.TEXTAREA,
      title: 'Describe your experience',
      isRequired: true,
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  const addCompanyQuestion = () => {
    closeModal();
    onSuccess?.({
      draftId: v4(),
      type: QuestionType.COMPANY,
      title: 'Select your company',
      isRequired: true,
      options: [],
      selectedCompanies: [],
      expanded: true,
      advancedSettingsExpanded: false,
      description: '',
    });
  };

  return (
    <StyledDialog
      isOpen={isOpened}
      onClose={closeModal}
      title={'Choose block type'}
      content={
        <div className="m-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <NewQuestionModalButton
            onClick={addSectionQuestion}
            icon={<SectionIcon />}
            text="Section"
            test-selector="section-question-button"
          />
          <NewQuestionModalButton
            onClick={addSectionBreakerQuestion}
            icon={<SectionBreakerIcon />}
            text="Step Break"
            test-selector="section-breaker-question-button"
          />
          <NewQuestionModalButton
            onClick={addEmojiQuestion}
            icon={<EmojiIcon />}
            text="Emoji"
            testSelector="emoji-question-button"
          />
          <NewQuestionModalButton
            onClick={addInputQuestion}
            icon={<InputIcon />}
            text="Text"
            testSelector="input-question-button"
          />
          <NewQuestionModalButton
            onClick={addChoiceQuestion}
            icon={<ChoiceIcon />}
            text="Choice"
            test-selector="choice-question-button"
          />
          <NewQuestionModalButton
            onClick={addNumberQuestion}
            icon={<NumberIcon />}
            text="Number"
            test-selector="number-question-button"
          />
          <NewQuestionModalButton
            onClick={addRateQuestion}
            icon={<RateIcon />}
            text="Rate"
            test-selector="rate-question-button"
          />
          <NewQuestionModalButton
            onClick={addDateQuestion}
            icon={<DateIcon />}
            text="Date"
            test-selector="date-question-button"
          />
          <NewQuestionModalButton
            onClick={addTextareaQuestion}
            icon={<TextareaIcon />}
            text="Textarea"
            test-selector="textarea-question-button"
          />
          <NewQuestionModalButton
            onClick={addCompanyQuestion}
            icon={<CompanyIcon />}
            text="Company"
            test-selector="company-question-button"
            disabled={hasCompanyQuestion}
            disabledReason={hasCompanyQuestion ? t('companyQuestionRestriction') : undefined}
          />
        </div>
      }
    />
  );
}
