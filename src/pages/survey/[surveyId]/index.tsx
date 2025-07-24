import useTranslation from 'next-translate/useTranslation';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { getSurveyData } from 'pages/api/answer/[id]';

import SurveyDisplay from 'features/surveys/features/SurveyDisplay/SurveyDisplay';
import ExternalPageWrapper from 'layout/ExternalRouteWrapper';
import SeoHead from 'shared/components/SeoHead';

export async function getServerSideProps(context: NextPageContext) {
  const surveyData = await getSurveyData(context.query.surveyId as string);

  if (surveyData) {
    surveyData.questions = surveyData?.questions.map((question: any) => {
      return {
        ...question,
        answer: '',
      };
    });
  }

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(surveyData)),
    },
  };
}

function AnswerPage({
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('survey');

  const surveyTitle = initialData?.title || 'Survey';
  const surveyDescription = initialData?.description || t('content');

  return (
    <ExternalPageWrapper>
      <SeoHead 
        title={`${surveyTitle} - Survey`}
        description={surveyDescription}
        url={`https://survey.otsuka.co.id/survey/${initialData?.id}`}
        type="article"
      />

      <SurveyDisplay initialData={initialData} />
    </ExternalPageWrapper>
  );
}

export default AnswerPage;
