import type { Metadata } from 'next';
import { SignInForm } from './SignInForm';
import { getServerSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign in',
};

const SignInPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <SignInForm />
    </section>
  );
};

export default SignInPage;
