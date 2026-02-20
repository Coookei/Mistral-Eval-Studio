import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

const DashboardSettingsPage = async () => {
  const { user } = await requireUser();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl">Settings</h1>
      <p>
        Hello, {user.name}. Your role is {user.role ?? 'none'}.
      </p>
    </section>
  );
};

export default DashboardSettingsPage;
