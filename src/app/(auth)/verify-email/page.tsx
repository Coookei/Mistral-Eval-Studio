import type { Metadata } from 'next';
import VerifyEmailComponent from './VerifyEmailComponent';
import { getServerSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Verify email',
};

const VerifyEmailPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect('/sign-in');

  if (user.emailVerified) redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <VerifyEmailComponent email={user.email} />
    </section>
  );
};

export default VerifyEmailPage;
