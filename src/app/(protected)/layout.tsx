import { DashboardLayout as DashboardLayoutShell } from '@/components/dashboard/DashboardLayout';
import { requireUser } from '@/lib/requireAuth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await requireUser();

  return <DashboardLayoutShell user={user}>{children}</DashboardLayoutShell>;
}
