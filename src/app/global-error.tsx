'use client';

/**
 * This root global error fallback replaces the full app when a root level error occurs,
 * so layout and global styles may not be available. It is fully self-contained.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main role="alert" aria-live="assertive">
          <h1>Something went wrong</h1>
          <p>
            An unexpected application error occurred. You can try again or return to the home page.
          </p>

          <p>
            <button type="button" onClick={reset}>
              Try again
            </button>{' '}
            <button type="button" onClick={() => (window.location.href = '/')}>
              Return home
            </button>
          </p>

          {error.digest ? <p>Error ID: {error.digest}</p> : null}
        </main>
      </body>
    </html>
  );
}
