import Head from 'next/head';
import withProtectedRoute from 'shared/HOC/withProtectedRoute';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import prismadb from '../../../lib/prismadb';
import SurveyList from 'features/surveys/features/SurveyList/SurveyList';
import useTranslation from 'next-translate/useTranslation';
import StandardPageWrapper from 'layout/StandardPageWrapper';
import withAnimation from 'shared/HOC/withAnimation';

// Function to get accessible surveys (own + company surveys)
async function getAccessibleSurveys(userId: string, userCompanyId?: string) {
  let accessibleSurveys;
  
  if (userCompanyId) {
    // Get user's own surveys
    const ownSurveys = await prismadb.survey.findMany({
      where: {
        userId: userId,
      },
      include: {
        questions: false,
        answers: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get surveys where user's company is in associatedCompanies
    const companySurveys = await prismadb.$queryRaw`
      SELECT s.*
      FROM Survey s
      WHERE s.isActive = 1 
      AND s.userId != ${userId}
      AND JSON_CONTAINS(s.associatedCompanies, ${JSON.stringify(userCompanyId)})
      ORDER BY s.createdAt DESC
    ` as any[];

    // For company surveys, get additional data with separate queries
    const enrichedCompanySurveys = await Promise.all(
      companySurveys.map(async (survey) => {
        const fullSurvey = await prismadb.survey.findUnique({
          where: { id: survey.id },
          include: {
            questions: false,
            answers: false,
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
        userId: userId,
      },
      include: {
        questions: false,
        answers: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return accessibleSurveys;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Get user with company info
  const user = await prismadb.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, companyId: true }
  });

  const surveys = await getAccessibleSurveys(session.user.id, user?.companyId || undefined);

  return {
    props: {
      surveys: JSON.parse(JSON.stringify(surveys)),
    },
  };
}

function SurveyListPage({
  surveys,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('surveys');

  return (
    <StandardPageWrapper>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('content')} />
      </Head>

      <SurveyList initialData={surveys} />
    </StandardPageWrapper>
  );
}
export default withProtectedRoute(withAnimation(SurveyListPage));
