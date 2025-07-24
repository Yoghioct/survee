import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import LoginCard from 'features/authorization/LoginCard';
import StandardPageWrapper from 'layout/StandardPageWrapper';
import withAnimation from 'shared/HOC/withAnimation';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

function LoginPage() {
  const { t } = useTranslation('login');
  const router = useRouter();
  const showSignupDisabledMessage = router.query.message === 'signup-disabled';

  return (
    <StandardPageWrapper>
      <Head>
        <title>{t('login:title')}</title>
        <meta name="description" content={t('login:content')} />
      </Head>

      {showSignupDisabledMessage && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 text-sm">
            Registration is currently disabled. Please use your existing account to login or contact your administrator for access.
          </p>
        </div>
      )}

      <LoginCard />
    </StandardPageWrapper>
  );
}

export default withAnimation(LoginPage);
