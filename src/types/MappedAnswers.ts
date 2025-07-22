import { QuestionType } from 'shared/constants/surveysConfig';
import { MappedAnswerData } from 'types/MappedAnswerData';

export type MappedAnswers = {
  [key: string]: {
    questionType: QuestionType;
    question: string;
    options: string[];
    answers: MappedAnswerData[];
  };
};
