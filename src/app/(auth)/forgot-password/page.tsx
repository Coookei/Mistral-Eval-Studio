import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
};

const ForgotPasswordPage = async () => {
  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <ForgotPasswordForm />
    </section>
  );
};

export default ForgotPasswordPage;
