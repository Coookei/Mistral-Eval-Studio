import UserButton from '@/components/auth/UserButton';
import { getServerSession } from '@/lib/getSession';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ListUsers } from './ListUsers';

export const metadata: Metadata = {
  title: 'Admin',
};

const AdminPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect('/sign-in');

  if (user.role !== 'admin') redirect('/dashboard');

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      Welcome to the Admin Page {user.name}. Your role is indeed {user.role ?? 'none'}.
      <UserButton />
      <ListUsers />
    </section>
  );
};

export default AdminPage;
