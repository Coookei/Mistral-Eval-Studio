import { requireNotAuthenticated } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = {
  title: 'Sign up',
};

const SignUpPage = async () => {
  await requireNotAuthenticated();

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
