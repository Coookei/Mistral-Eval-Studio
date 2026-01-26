import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import EmailVerifiedComponent from './EmailVerifiedComponent';

export const metadata: Metadata = {
  title: 'Email verified',
};

const EmailVerifiedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) => {
  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <Suspense fallback={<Loader2 />}>
        <EmailVerifiedComponent searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default EmailVerifiedPage;
