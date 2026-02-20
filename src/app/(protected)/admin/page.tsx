import { requireAdmin } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import { ListUsers } from './ListUsers';

export const metadata: Metadata = {
  title: 'Admin',
};

const AdminPage = async () => {
  const { user } = await requireAdmin();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl">Welcome to the Admin page</h1>
      <p>
        Hello, {user.name}. Your role is {user.role ?? 'none'}.
      </p>
      <ListUsers />
    </section>
  );
};

export default AdminPage;
