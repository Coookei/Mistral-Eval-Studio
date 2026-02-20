import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import AccountPageComponent from './AccountPageComponent';

export const metadata: Metadata = {
  title: 'My Account',
};

const AccountPage = async () => {
  const { user } = await requireUser();

  return (
    <section>
      <AccountPageComponent user={user} />
    </section>
  );
};

export default AccountPage;
