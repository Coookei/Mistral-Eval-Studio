import type { Metadata } from 'next';
import { SignUpForm } from './SignUpForm';
import { getServerSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up',
};

const SignUpPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
