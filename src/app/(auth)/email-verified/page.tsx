import type { Metadata } from 'next';
import EmailVerifiedComponent from './EmailVerifiedComponent';

export const metadata: Metadata = {
  title: 'Email verified',
};

const EmailVerifiedPage = async () => {
  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      <EmailVerifiedComponent />
    </section>
  );
};

export default EmailVerifiedPage;
