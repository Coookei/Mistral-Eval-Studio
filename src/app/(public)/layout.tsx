import { PublicHeader } from '@/components/layout/PublicHeader';
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <PublicHeader />
    </>
  );
}
