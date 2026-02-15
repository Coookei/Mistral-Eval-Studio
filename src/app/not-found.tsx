import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, Compass, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-primary/10">
              <Compass className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Error 404
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
            <p className="mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
              The page you requested doesn&apos;t exist or was moved.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3 sm:pt-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 w-full bg-background/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 w-full bg-background/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href="/docs">
                <BookOpenText className="mr-2 h-4 w-4" />
                View Docs
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 w-full bg-background/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Open Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
