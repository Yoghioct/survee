import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '../../../../lib/prismadb';

import serverAuth from '../../../../lib/serverAuth';
import { QuestionType } from 'shared/constants/surveysConfig';
import { ComparisonType } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';
import {
  MAX_LOGIC_PATHS,
  MAX_QUESTIONS,
  MAX_QUESTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_QUESTIONS,
} from 'shared/constants/surveysConfig';

export interface CreateEditSurveyPayload {
  title: string;
  description?: string;
  questions: {
    draftId?: string;
    title: string;
    type: QuestionType;
    description?: string;
    isRequired: boolean;
    options: string[];
    selectedCompanies?: string[];
    logicPaths?: {
      comparisonType: ComparisonType;
      selectedOption: string;
      nextQuestionOrder: number;
    }[];
  }[];
  oneQuestionPerStep: boolean;
  displayTitle: boolean;
  hideProgressBar: boolean;
  accentColor: string;
  displayLogo?: boolean;
  showDisclaimer?: boolean;
  disclaimerTitle?: string;
  disclaimerBody?: string;
  thankYouLogic?: any;
  associatedCompanies?: string[];
}

export async function getAllUserSurveys(userId: string) {
  const surveys = await prismadb.survey.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      questions: false,
      answers: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return surveys;
}

export const isSurveyValid = (survey: CreateEditSurveyPayload) => {
  // Check for multiple Company questions
  const companyQuestions = survey.questions.filter(q => q.type === QuestionType.COMPANY);
  if (companyQuestions.length > 1) {
    return false;
  }

  if (
    survey.title.trim() === '' ||
    survey.title.length > MAX_TITLE_LENGTH ||
    survey.questions.some(
      (question) =>
        question.title.trim() === '' ||
        question.title.length > MAX_QUESTION_LENGTH
    ) ||
    survey.questions.some(
      (question) =>
        question.logicPaths && question.logicPaths.length > MAX_LOGIC_PATHS
    ) ||
    survey.questions.length < MIN_QUESTIONS ||
    survey.questions.length > MAX_QUESTIONS
  ) {
    return false;
  }

  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestMethod = req.method;
    const session = await serverAuth(req, res);

    switch (requestMethod) {
      case 'GET': {
        const surveys = await getAllUserSurveys(session.currentUser.id);
        return res.status(200).json({ surveys });
      }
      case 'POST': {
        const {
          title,
          description,
          questions: payloadQuestions,
          oneQuestionPerStep,
          displayTitle,
          hideProgressBar,
          accentColor,
          displayLogo,
          showDisclaimer,
          disclaimerTitle,
          disclaimerBody,
          thankYouLogic,
        } = req.body as CreateEditSurveyPayload;

        if (!isSurveyValid(req.body)) {
          return res.status(400).end();
        }

        // Extract company IDs from company questions
        const companyQuestions = payloadQuestions.filter(q => q.type === QuestionType.COMPANY);
        const associatedCompanies = companyQuestions.length > 0 
          ? companyQuestions[0].selectedCompanies || []
          : [];


        // Use associatedCompanies from body if available, otherwise extract from company questions
        const finalAssociatedCompanies = req.body.associatedCompanies && req.body.associatedCompanies.length > 0 
          ? req.body.associatedCompanies 
          : associatedCompanies;

        const survey = await prismadb.survey.create({
          data: {
            user: { connect: { id: session.currentUser.id } },
            title,
            description,
            accentColor,
            isActive: true,
            oneQuestionPerStep: Boolean(oneQuestionPerStep),
            displayTitle: Boolean(displayTitle),
            hideProgressBar: hideProgressBar !== null ? Boolean(hideProgressBar) : null,
            displayLogo: displayLogo !== null ? Boolean(displayLogo) : null,
            showDisclaimer: Boolean(showDisclaimer),
            disclaimerTitle,
            disclaimerBody,
            thankYouLogic,
            associatedCompanies: finalAssociatedCompanies,
            questions: {
              create: payloadQuestions.map((question, index) => ({
                type: question.type as any,
                title: question.title,
                description: question.description,
                options: question.options ?? [],
                isRequired: Boolean(question.isRequired),
                order: index,
                logicPaths: question.logicPaths ?? [],
              })),
            },
          } as any,
          include: {
            questions: true,
          },
        });

        // Adding logic paths is seperated because we need all questions to be created first
        survey.questions.forEach(async (question) => {
          const payloadQuestion = payloadQuestions[question.order];
          const logicPaths = payloadQuestion.logicPaths?.map((path) => {
            const nextQuestionId = survey.questions.find(
              (q) => q.order === path.nextQuestionOrder
            )?.id;

            return {
              comparisonType: path.comparisonType,
              selectedOption: path.selectedOption,
              nextQuestionId,
              endSurvey: !nextQuestionId || undefined,
            };
          });

          await prismadb.question.update({
            where: { id: question.id },
            data: {
              logicPaths: logicPaths,
            },
          });
        });

        return res.status(200).json({ id: survey.id });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
