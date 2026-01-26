import { TriangleAlertIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
};

interface Props {
  searchParams: Promise<{ token: string }>;
}

const ResetPasswordPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  return (
    <section className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 p-3 text-sm min-w-sm text-red-600 bg-red-50 rounded-md mt-4"
        >
          <TriangleAlertIcon className="h-4 w-4" />A valid reset token is required.
        </div>
      )}
    </section>
  );
};

export default ResetPasswordPage;
