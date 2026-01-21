import UserButton from '@/components/auth/UserButton';
import { EmailVerificationBanner } from '@/components/layout/EmailVerificationBanner';
import { getServerSession } from '@/lib/getSession';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect('/sign-in');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <div className="flex flex-col gap-4">
        {!user.emailVerified && <EmailVerificationBanner email={user.email} />}

        <div className="flex flex-row gap-5 items-center justify-center">
          Welcome to the Dashboard {user.name}. Your role is {user.role ?? 'none'}.
          <UserButton />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
