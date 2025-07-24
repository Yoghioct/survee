import { Form, Formik } from 'formik';
import Link from 'next/link';
import Header from 'shared/components/Header/Header';
import LoginButton from 'shared/components/LoginButton/LoginButton';
import Input from 'shared/components/Input/Input';
import { useRegisterManager } from 'features/authorization/managers/registerManager';
import useTranslation from 'next-translate/useTranslation';
import AuthFormWrapper from 'features/authorization/components/AuthFormWrapper';
import { APP_CONFIG } from 'config/app.config';

export default function SignUpCard() {
  const { t } = useTranslation('signup');

  const { initialValues, onSubmit, SignupSchema, isRegistering } =
    useRegisterManager();

  // If signup is disabled, show disabled form
  if (!APP_CONFIG.SIGNUP_ENABLED) {
    return (
      <AuthFormWrapper>
        <Header>{t('heading')}</Header>
        <div className="flex w-full flex-col">
          <Input
            type="text"
            name="name"
            value=""
            required
            disabled
            placeholder={t('name')}
            className="!my-1 opacity-50"
          />
          <Input
            type="email"
            className="!my-1 opacity-50"
            value=""
            required
            disabled
            placeholder={t('email')}
          />
          <Input
            type="password"
            className="!my-1 opacity-50"
            value=""
            required
            disabled
            placeholder={t('password')}
          />
          
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 mt-1 px-6 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg text-center">
              {t('signUpButton')} - Currently Disabled
            </div>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {APP_CONFIG.SIGNUP_DISABLED_MESSAGE}
            </p>
          </div>
          
          <Link scroll={false} href={'/login'} passHref>
            <p className="mt-2 text-center text-sm text-zinc-600 underline hover:cursor-pointer">
              {t('alreadyHaveAccount')}
            </p>
          </Link>
        </div>
      </AuthFormWrapper>
    );
  }

  // Normal signup form when enabled
  return (
    <AuthFormWrapper>
      <Header>{t('heading')}</Header>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={SignupSchema}
      >
        {({ values, errors, handleChange, handleSubmit, touched }) => (
          <Form className="flex w-full flex-col">
            <Input
              type="text"
              name="name"
              value={values.name}
              required
              error={touched.name ? errors.name : undefined}
              placeholder={t('name')}
              onChange={handleChange('name')}
              className="!my-1"
            />
            <Input
              type="email"
              className="!my-1"
              value={values.email}
              required
              error={touched.email ? errors.email : undefined}
              placeholder={t('email')}
              onChange={handleChange('email')}
            />
            <Input
              type="password"
              className="!my-1"
              value={values.password}
              error={touched.password ? errors.password : undefined}
              required
              placeholder={t('password')}
              onChange={handleChange('password')}
            />
            {!!errors.message && (
              <p className="mb-4 max-w-sm self-center text-center text-sm text-red-300">
                {errors.message}
              </p>
            )}

            <div className="flex flex-col items-center justify-center">
              <LoginButton
                className="mb-2 mt-1 border-purple-200 !bg-purple-200 !text-purple-900 hover:!bg-purple-300"
                type="submit"
                onClick={handleSubmit}
                isLoading={isRegistering}
              >
                {t('signUpButton')}
              </LoginButton>
            </div>
            <Link scroll={false} href={'/login'} passHref>
              <p className="mt-2 text-center text-sm text-zinc-600 underline hover:cursor-pointer">
                {t('alreadyHaveAccount')}
              </p>
            </Link>
          </Form>
        )}
      </Formik>
    </AuthFormWrapper>
  );
}
