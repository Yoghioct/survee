import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { useApplicationContext } from 'features/application/context';

const withAdminRoute = <T extends object>(
  WrappedComponent: FunctionComponent<T>
) => {
  const HocComponent: FunctionComponent<T> = ({ ...props }) => {
    const { user, loading, error } = useApplicationContext();
    const isLoggedIn = user && !error;
    const isAdmin = user?.role === 'ADMIN';
    const location = useRouter();

    if (!loading && !isLoggedIn) {
      location.push('/login', undefined, { scroll: false });
      return null;
    }

    if (!loading && isLoggedIn && !isAdmin) {
      location.push('/', undefined, { scroll: false });
      return null;
    }

    if (isLoggedIn && isAdmin) {
      return <WrappedComponent {...props} />;
    }
    
    return null;
  };

  return HocComponent;
};

export default withAdminRoute; 