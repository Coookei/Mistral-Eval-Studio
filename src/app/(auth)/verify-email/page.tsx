import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import VerifyEmailComponent from './VerifyEmailComponent';

export const metadata: Metadata = {
  title: 'Verify email',
};

const VerifyEmailPage = async () => {
  const { user } = await requireUser();

  if (user.emailVerified) redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <VerifyEmailComponent email={user.email} />
    </section>
  );
};

export default VerifyEmailPage;
