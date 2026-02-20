'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  email: string;
}

export function VerifyBanner({ email }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-background/95">
      <div className="container mx-auto max-w-6xl px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 sm:mt-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="min-w-0 text-sm leading-5 text-foreground">
              Please verify your email address to access all features.
              <span className="block break-all text-muted-foreground sm:ml-1 sm:inline sm:break-normal">
                {email}
              </span>
            </p>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button asChild variant="outline" size="sm" className="h-8 flex-1 px-3 sm:flex-none">
              <Link href="/verify-email">Verify email</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
