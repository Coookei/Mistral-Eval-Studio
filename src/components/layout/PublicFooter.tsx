import Link from 'next/link';

export function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 sm:px-6 md:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <Link
              href="/docs"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/privacy"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            &copy; {year} Mistral Eval Studio. Built by Tom.
          </p>
        </div>
      </div>
    </footer>
  );
}
