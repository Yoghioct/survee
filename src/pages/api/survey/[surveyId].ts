import { NextApiRequest, NextApiResponse } from 'next';
import { QuestionType } from '@prisma/client';

import prismadb from '../../../../lib/prismadb';
import serverAuth from '../../../../lib/serverAuth';
import { CreateEditSurveyPayload, isSurveyValid } from '.';

export enum SurveyActionTypes {
  UPDATE_ACTIVE = 'UPDATE_ACTIVE',
}
interface SurveyPatchPayloadI {
  actionType: SurveyActionTypes;
}

export async function getSurveyWithAnswers(surveyId: string, userId: string) {
  try {
    // Get user's company info first
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: { companyId: true, company: { select: { name: true } } }
    });

    // First, try to find survey owned by user
    let survey = await prismadb.survey.findFirst({
      where: {
        id: surveyId,
        userId: userId,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
        answers: {
          include: {
            answerData: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // If found and user owns the survey, return all answers (survey owner can see everything)
    if (survey) {
      return survey;
    }

    // If not found, check if user has company access to this survey
    if (user?.companyId && user?.company?.name) {
      // Use raw query to check company access due to JSON field
      const companySurveys = await prismadb.$queryRaw`
        SELECT s.*
        FROM Survey s
        WHERE s.id = ${surveyId}
        AND s.isActive = 1
        AND JSON_CONTAINS(s.associatedCompanies, ${JSON.stringify(user.companyId)})
      ` as any[];

      if (companySurveys.length > 0) {
        // First, find the company question in this survey
        const companyQuestion = await prismadb.question.findFirst({
          where: {
            surveyId: surveyId,
            type: 'COMPANY' as any,
          },
        });

        let answersFilter = {};
        
        if (companyQuestion) {
          // Filter answers where the company question was answered with user's company name
          answersFilter = {
            answerData: {
              some: {
                questionId: companyQuestion.id,
                providedAnswer: user.company.name, // Only answers where they selected this company
              },
            },
          };
        } else {
          // If no company question exists, no answers should be visible to company users
          answersFilter = {
            id: 'nonexistent', // This will return no answers
          };
        }

        // Get the survey with filtered answers (only where participant selected user's company)
        survey = await prismadb.survey.findFirst({
          where: {
            id: surveyId,
          },
          include: {
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
            answers: {
              where: answersFilter,
              include: {
                answerData: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
      }
    }

    return survey;
  } catch (error) {
    console.error('Error in getSurveyWithAnswers:', error);
    return null;
  }
}

export async function updateSurveyActiveStatus({
  surveyId,
  isActive,
}: {
  surveyId: string;
  isActive: boolean;
}) {
  const survey = await prismadb.survey.update({
    data: { isActive },
    where: {
      id: surveyId,
    },
  });
  return survey;
}

export async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  const surveyId = String(req.query.surveyId);
  const { actionType } = req.body as SurveyPatchPayloadI;
  const session = await serverAuth(req, res);
  const userId = session.currentUser.id;
  const surveyFound = await prismadb.survey.findFirst({
    where: { id: surveyId, userId },
  });
  if (!surveyFound?.id) {
    return res.status(404).end();
  }
  switch (actionType) {
    case SurveyActionTypes.UPDATE_ACTIVE: {
      const isActive = !!req.body.isActive;
      const survey = await updateSurveyActiveStatus({
        surveyId,
        isActive,
      });
      if (survey?.id) {
        return res.status(200).json(survey);
      }
      return res.status(500).json({ message: 'Failed to change status' });
    }
    default: {
      return res.status(400).json({ message: 'actionType is invalid' });
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestMethod = req.method;
    const session = await serverAuth(req, res);
    const userId = session.currentUser.id;
    const { surveyId } = req.query;

    switch (requestMethod) {
      case 'GET': {
        const survey = await getSurveyWithAnswers(
          surveyId as string,
          session.currentUser.id
        );

        return res.status(200).json(survey);
      }
      case 'DELETE': {
        const survey = await prismadb.survey.findFirst({
          where: {
            id: surveyId as string,
            userId: session.currentUser.id,
          },
        });

        if (!survey) {
          return res.status(404).end();
        }

        await prismadb.survey.delete({
          where: {
            id: surveyId as string,
          },
        });

        return res.status(200).end();
      }
      case 'PATCH': {
        return handlePatch(req, res);
      }
      case 'PUT': {
        const {
          title,
          description,
          questions,
          oneQuestionPerStep,
          displayTitle,
          accentColor,
          hideProgressBar,
          // displayLogo,
          showDisclaimer,
          disclaimerTitle,
          disclaimerBody,
          thankYouLogic,
        } = req.body as CreateEditSurveyPayload;

        if (!isSurveyValid(req.body)) {
          return res.status(400).end();
        }

        const surveyFound = await prismadb.survey.findFirst({
          where: { id: surveyId as string, userId },
        });

        if (!surveyFound?.id) {
          return res.status(404).end();
        }

        const surveyQuestions = await prismadb.question.findMany({
          where: {
            surveyId: surveyId as string,
          },
        });

        const newQuestions = [];

        surveyQuestions.forEach(async (question) => {
          const foundQuestionIndex = questions.findIndex(
            (q) => q.draftId === question.id
          );

          if (foundQuestionIndex === -1) return;

          const questionFound = questions[foundQuestionIndex];

          const newQuestion = await prismadb.question.update({
            where: {
              id: question.id,
            },
            data: {
              title: questionFound.title,
              description: questionFound.description,
              isRequired: Boolean(questionFound.isRequired),
              order: foundQuestionIndex,
            },
          });

          newQuestions.push(newQuestion);
        });

        const survey = await prismadb.survey.update({
          where: {
            id: surveyId as string,
          },
          data: {
            title,
            description,
            oneQuestionPerStep: Boolean(oneQuestionPerStep),
            displayTitle: Boolean(displayTitle),
            accentColor,
            hideProgressBar: hideProgressBar !== null ? Boolean(hideProgressBar) : null,
            // displayLogo,
            showDisclaimer: Boolean(showDisclaimer),
            disclaimerTitle,
            disclaimerBody,
            thankYouLogic,
          },
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
