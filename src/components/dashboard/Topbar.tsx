'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { User as BetterAuthUser } from '@/lib/auth';
import { authClient } from '@/lib/authClient';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserDropdown from './UserDropdown';

interface TopbarProps {
  user: BetterAuthUser;
  onMenuClick?: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || 'Something went wrong');
    } else {
      toast.success('Signed out successfully');
      router.push('/sign-in');
    }
  };

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileMenuTrigger onMenuClick={onMenuClick} />

        {/* show full breadcrumbs on desktop but only show current page on mobile */}
        <DesktopBreadcrumbs breadcrumbs={breadcrumbs} />
        <MobileCurrentPage breadcrumbs={breadcrumbs} />
      </div>

      <TopbarActions user={user} onSignOut={handleSignOut} />
    </header>
  );
}

interface MobileTriggerProps {
  onMenuClick?: () => void;
}

function MobileMenuTrigger({ onMenuClick }: MobileTriggerProps) {
  return (
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

type Breadcrumb = {
  label: string;
  href: string;
  isLast: boolean;
};

function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }));
}

interface DesktopBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

function DesktopBreadcrumbs({ breadcrumbs }: DesktopBreadcrumbsProps) {
  return (
    <nav className="hidden sm:flex items-center gap-1 lg:gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1 lg:gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {crumb.isLast ? (
            <span className="text-foreground font-medium truncate max-w-37.5 lg:max-w-none">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-25 lg:max-w-none"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

interface MobileCurrentPageProps {
  breadcrumbs: Breadcrumb[];
}

function MobileCurrentPage({ breadcrumbs }: MobileCurrentPageProps) {
  return (
    <span className="sm:hidden text-sm font-medium truncate max-w-45">
      {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
    </span>
  );
}

interface TopbarActionsProps {
  user: BetterAuthUser;
  onSignOut: () => Promise<void>;
}

function TopbarActions({ user, onSignOut }: TopbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <UserDropdown user={user} onSignOut={onSignOut} />
    </div>
  );
}
