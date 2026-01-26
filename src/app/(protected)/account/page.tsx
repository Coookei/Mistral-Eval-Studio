import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import AccountPageComponent from './AccountPageComponent';

export const metadata: Metadata = {
  title: 'My Account',
};

const AccountPage = async () => {
  const { user } = await requireUser();

  return (
    <section className="flex min-h-svh items-center justify-center px-4 py-8">
      <AccountPageComponent user={user} />
    </section>
  );
};

export default AccountPage;
