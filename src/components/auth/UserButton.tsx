'use client';

import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthButtons from './AuthButtons';
import UserDropdown from './UserDropdown';

const UserButton = () => {
  const session = authClient.useSession();
  const router = useRouter();

  if (session.isPending) return null;

  const user = session.data?.user;

  if (!user) return <AuthButtons />;

  return (
    <UserDropdown
      user={user}
      onSignOut={async () => {
        const { error } = await authClient.signOut();
        if (error) {
          toast.error(error.message || 'Something went wrong');
        } else {
          toast.success('Signed out successfully');
          router.push('/sign-in');
        }
      }}
    />
  );
};

export default UserButton;
