import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from './getSession';

export async function requireNotAuthenticated() {
  // use very different function name to avoid confusion with requireUser
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect('/dashboard');
}

export async function requireUser() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    const headerList = await headers();
    const pathname = headerList.get('x-pathname') ?? null;
    const redirectQuery = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
    redirect(`/sign-in${redirectQuery}`);
  }

  return { session, user };
}

export async function requireAdmin() {
  const { session, user } = await requireUser();

  if (user.role !== 'admin') redirect('/dashboard');

  return { session, user };
}
