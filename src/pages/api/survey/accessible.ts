import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '../../../../lib/prismadb';
import serverAuth from '../../../../lib/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const session = await serverAuth(req, res);
    const user = session.currentUser;

    // Get surveys that the user can access
    let accessibleSurveys;
    
    if (user.companyId) {
      // Get surveys using Prisma with proper includes
      const ownSurveys = await prismadb.survey.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          questions: true,
          answers: {
            include: {
              answerData: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Get surveys where user's company is in associatedCompanies using raw query
      const companySurveys = await prismadb.$queryRaw`
        SELECT s.*
        FROM Survey s
        WHERE s.isActive = 1 
        AND s.userId != ${user.id}
        AND JSON_CONTAINS(s.associatedCompanies, ${JSON.stringify(user.companyId)})
        ORDER BY s.createdAt DESC
      ` as any[];

      // For company surveys, get additional data with separate queries
      const enrichedCompanySurveys = await Promise.all(
        companySurveys.map(async (survey) => {
          const fullSurvey = await prismadb.survey.findUnique({
            where: { id: survey.id },
            include: {
              questions: true,
              answers: {
                include: {
                  answerData: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          return fullSurvey;
        })
      );

      // Combine both arrays and remove duplicates
      const allSurveys = [...ownSurveys, ...enrichedCompanySurveys.filter(Boolean)];
      const uniqueSurveys = allSurveys.filter((survey, index, self) =>
        survey && index === self.findIndex((s) => s && s.id === survey.id)
      );
      
      accessibleSurveys = uniqueSurveys;
    } else {
      // User without company can only see their own surveys
      accessibleSurveys = await prismadb.survey.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          questions: true,
          answers: {
            include: {
              answerData: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return res.status(200).json({ surveys: accessibleSurveys });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
