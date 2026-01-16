import prisma from '@/lib/prisma';

export default async function Home() {
  const users = await prisma.user.findMany(); // test prisma connection
  return <>Hello World! {JSON.stringify(users)}</>;
}
