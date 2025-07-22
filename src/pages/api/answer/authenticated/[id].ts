import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '../../../../../lib/prismadb';
import serverAuth from '../../../../../lib/serverAuth';
import { MAX_ANSWER_LENGTH } from 'shared/constants/surveysConfig';

interface AnswerData {
  answersData: { questionId: string; answer?: string }[];
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
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const session = await serverAuth(req, res);
    const user = session.currentUser;
    const { id } = req.query;
    const { answersData } = req.body as AnswerData;

    if (!isAnswerDataValid(req.body)) {
      return res.status(400).end();
    }

    // Get survey to check if it's active
    const survey = await prismadb.survey.findUnique({
      where: { id: id as string },
    });

    if (!survey || !survey.isActive) {
      return res.status(400).json({ error: 'Survey not found or inactive' });
    }

    // Create answer with user and company information
    await prismadb.answer.create({
      data: {
        survey: {
          connect: {
            id: id as string,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        ...(user.companyId && {
          company: {
            connect: {
              id: user.companyId,
            },
          },
        }),
        answerData: {
          create: answersData.map((answerData) => ({
            providedAnswer: answerData.answer,
            questionId: answerData.questionId,
          })),
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
