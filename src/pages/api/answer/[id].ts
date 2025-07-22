import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '../../../../lib/prismadb';
import { MAX_ANSWER_LENGTH } from 'shared/constants/surveysConfig';

interface AnswerData {
  answersData: { questionId: string; answer?: string }[];
}

export async function getSurveyData(surveyId: string, userId?: string) {
  try {
    // First get the survey with all fields including associatedCompanies
    const surveyData = await prismadb.$queryRaw`
      SELECT * FROM Survey 
      WHERE id = ${surveyId}
    ` as any[];

    if (!surveyData || surveyData.length === 0) {
      return null;
    }

    const survey = surveyData[0];

    // Convert integer boolean fields to actual booleans (MySQL returns 1/0 for BOOLEAN)
    const normalizedSurvey = {
      ...survey,
      isActive: Boolean(survey.isActive),
      oneQuestionPerStep: Boolean(survey.oneQuestionPerStep),
      displayTitle: Boolean(survey.displayTitle),
      hideProgressBar: survey.hideProgressBar ? Boolean(survey.hideProgressBar) : null,
      displayLogo: survey.displayLogo ? Boolean(survey.displayLogo) : null,
      showDisclaimer: Boolean(survey.showDisclaimer),
    };

    // Then get the questions separately
    const questions = await prismadb.question.findMany({
      where: {
        surveyId: surveyId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Combine the data
    return {
      ...normalizedSurvey,
      questions,
    };
  } catch (error) {
    console.error('Error in getSurveyData:', error);
    return null;
  }
}

const isAnswerDataValid = (answerData: AnswerData) => {
  if (
    answerData.answersData.some(
      (answer) => answer.answer && answer.answer.length > MAX_ANSWER_LENGTH
    )
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

    const { id } = req.query;

    const survey = await getSurveyData(id as string);

    switch (requestMethod) {
      case 'GET': {
        return res.status(200).json(survey);
      }
      case 'POST': {
        const { answersData } = req.body as AnswerData;

        if (!isAnswerDataValid(req.body) || !survey?.isActive) {
          return res.status(400).end();
        }

        await prismadb.answer.create({
          data: {
            survey: {
              connect: {
                id: id as string,
              },
            },
            answerData: {
              create: answersData.map((answerData) => ({
                providedAnswer: answerData.answer,
                questionId: answerData.questionId,
              })),
            },
          },
        });

        return res.status(200).end();
      }

      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
