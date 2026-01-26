'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/authClient';
import { ArrowLeft, CheckCircle2, Loader2, Mail, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  email: string;
}

const VerifyEmailComponent = ({ email }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setSuccess(null);
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/email-verified', // redirect to after user click link in verification email
    });

    setIsLoading(false);

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      setSuccess('Verification email sent successfully');
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 ">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-foreground">{email}.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Click the link in your email to verify your account and get started. This will expire
            after 24 hours.
          </p>

          <div className="flex flex-col gap-2">
            {error && (
              <div className="flex items-center justify-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <TriangleAlertIcon className="h-4 w-4" />
                {error}
              </div>
            )}
            {success ? (
              <div className="flex items-center justify-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-transparent"
              >
                {isLoading ? 'Resending...' : 'Resend verification email'}
                {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailComponent;
