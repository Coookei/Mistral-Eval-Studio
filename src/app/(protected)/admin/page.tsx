import UserButton from '@/components/auth/UserButton';
import { requireAdmin } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import { ListUsers } from './ListUsers';

export const metadata: Metadata = {
  title: 'Admin',
};

const AdminPage = async () => {
  const { user } = await requireAdmin();

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      Welcome to the Admin Page {user.name}. Your role is indeed {user.role ?? 'none'}.
      <UserButton />
      <ListUsers />
    </section>
  );
};

export default AdminPage;
