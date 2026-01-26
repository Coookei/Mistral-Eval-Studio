import UserButton from '@/components/auth/UserButton';
import { EmailVerificationBanner } from '@/components/layout/EmailVerificationBanner';
import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const { user } = await requireUser();

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
