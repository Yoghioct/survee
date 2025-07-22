import React from 'react';
import { CompanyList } from '../../features/company/CompanyList';
import withAdminRoute from '../../shared/HOC/withAdminRoute';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import prismadb from '../../../lib/prismadb';

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

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
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

const CompanyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-[var(--navigation-height)]">
      <CompanyList />
    </div>
  );
};

export default withAdminRoute(CompanyPage); 