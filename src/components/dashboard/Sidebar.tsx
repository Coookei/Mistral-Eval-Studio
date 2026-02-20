'use client';

import { cn } from '@/lib/utils';
import { FileText, LayoutDashboard, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onNavClick?: () => void;
}

// this component is used in both desktop and mobile sidebar
// the optional prop is for mobile which will close the sheet when any nav link is clicked
export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <Logo onNavClick={onNavClick} />

      <nav className="flex-1 p-3 lg:p-4 space-y-1">
        <Links pathname={pathname} onNavClick={onNavClick} />
      </nav>

      <div className="space-y-1.5 border-t border-sidebar-border p-3 lg:p-4">
        <Bottom onNavClick={onNavClick} />
      </div>
    </div>
  );
}

function Logo({ onNavClick }: SidebarProps) {
  return (
    <div className="p-4 lg:p-6 border-b border-sidebar-border">
      <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
        <div className="relative grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-md bg-foreground text-background shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">M</span>
          <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-border/40" />
        </div>
        <span className="font-semibold text-base sm:text-lg">Mistral Eval Studio</span>
      </Link>
    </div>
  );
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  // TODO add page links here for the software
  { name: 'New comparison', href: '/dashboard/compare/new', icon: Plus },
];

function Links({ pathname, onNavClick }: { pathname: string; onNavClick?: () => void }) {
  return navItems.map((item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
        )}
      >
        <Icon className="h-4 w-4" />
        {item.name}
      </Link>
    );
  });
}

function Bottom({ onNavClick }: SidebarProps) {
  return (
    <>
      <Link
        href="/docs"
        onClick={onNavClick}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
      >
        <FileText className="h-4 w-4" />
        Docs
      </Link>

      <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/65">
        {/* TODO wire up to API health check */}
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Service Status: Online
      </div>
    </>
  );
}
