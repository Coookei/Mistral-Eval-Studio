'use server';

import { getServerSession } from '@/lib/getSession';
import prisma from '@/lib/prisma';
import { forbidden, unauthorized } from 'next/navigation';

export async function listUsers() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== 'admin') forbidden();

  const users = await prisma.user.findMany();
  return users;
}
