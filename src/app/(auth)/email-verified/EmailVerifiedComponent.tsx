'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function EmailVerifiedComponent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [countdown, setCountdown] = useState(30);
  const { error } = use(searchParams);

  const isInvalidToken = Boolean(error);

  useEffect(() => {
    if (isInvalidToken) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInvalidToken]);

  return (
    <div className="w-full max-w-md space-y-4 bg-muted/30">
      <Card>
        <CardHeader className="text-center">
          {isInvalidToken ? (
            <>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <TriangleAlertIcon className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Verification failed</CardTitle>
              <CardDescription>This verification link is invalid or has expired.</CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Email verified!</CardTitle>
              <CardDescription>Your email has been successfully verified</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isInvalidToken ? (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Please request a new verification email.
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/verify-email">Verify email</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Your account is now fully activated. You can access all features of Mistral Eval
                Studio.
              </p>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard">Continue to dashboard</Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Redirecting automatically in {countdown} seconds...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
