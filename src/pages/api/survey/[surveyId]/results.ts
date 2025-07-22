import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '../../../../../lib/prismadb';
import serverAuth from '../../../../../lib/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { surveyId } = req.query;
    const session = await serverAuth(req, res);
    const user = session.currentUser;

    if (!surveyId || typeof surveyId !== 'string') {
      return res.status(400).json({ error: 'Survey ID is required' });
    }

    // First, check if user has access to this survey
    const survey = await prismadb.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: true,
      },
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Check if user can access this survey
    const surveyWithCompanies = survey as any;
    const canAccess = survey.userId === user.id || 
      (user.companyId && surveyWithCompanies.associatedCompanies && 
       Array.isArray(surveyWithCompanies.associatedCompanies) && 
       surveyWithCompanies.associatedCompanies.includes(user.companyId));

    if (!canAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get filtered answers based on user's role
    let answersQuery: any = {
      where: {
        surveyId: surveyId,
      },
      include: {
        answerData: true,
        user: {
          select: {
            id: true,
            name: true,
            companyId: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // If user is not the survey creator and has a company, filter by their company
    if (survey.userId !== user.id && user.companyId) {
      answersQuery.where.companyId = user.companyId;
    }

    const answers = await prismadb.answer.findMany(answersQuery);

    return res.status(200).json({ 
      survey,
      answers,
      userRole: survey.userId === user.id ? 'creator' : 'company_member'
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
