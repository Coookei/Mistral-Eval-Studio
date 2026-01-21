import { requireNotAuthenticated } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

const SignInPage = async () => {
  await requireNotAuthenticated();

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <SignInForm />
    </section>
  );
};

export default SignInPage;
