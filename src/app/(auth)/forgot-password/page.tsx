import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';
import { getServerSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Forgot password',
};

const ForgotPasswordPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <ForgotPasswordForm />
    </section>
  );
};

export default ForgotPasswordPage;
