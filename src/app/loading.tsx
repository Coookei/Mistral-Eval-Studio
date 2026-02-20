export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        Loading...
      </div>
    </div>
  );
}
