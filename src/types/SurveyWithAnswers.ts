import { Answer, AnswerData, Question, Survey } from '@prisma/client';

export type SurveyWithAnswers = Survey & {
  answers: (Answer & {
    answerData: AnswerData[];
  })[];
  questions: Question[];
  displayLogo?: boolean;
  showDisclaimer?: boolean;
  disclaimerTitle?: string;
  disclaimerBody?: string;
  thankYouLogic?: any;
};
