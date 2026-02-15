'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, LifeBuoy, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO log error to remote logging service like Sentry
    console.error('Error page:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Error 500
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
              An unexpected error has occurred. You can try again or return to the home page.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={reset} size="lg" variant="outline" className="bg-background/70">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return home
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-left sm:p-5">
            <div className="flex flex-col gap-2">
              {error.digest && (
                <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
              )}

              <a
                href="mailto:hello@tomfox.tech"
                className="inline-flex items-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
