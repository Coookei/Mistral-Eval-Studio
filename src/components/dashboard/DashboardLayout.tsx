'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { VerifyBanner } from '@/components/dashboard/VerifyBanner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { User } from '@/lib/auth';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopSidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        onNavClick={() => setIsMobileMenuOpen(false)}
      />

      <ContentColumn user={user} onMenuClick={() => setIsMobileMenuOpen(true)}>
        {children}
      </ContentColumn>
    </div>
  );
}

interface DesktopSidebarProps {
  onNavClick?: () => void;
}

function DesktopSidebar({ onNavClick }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <Sidebar onNavClick={onNavClick} />
    </aside>
  );
}

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavClick: () => void;
}

function MobileSidebar({ isOpen, onOpenChange, onNavClick }: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-70 bg-sidebar p-0">
        {/* add sheet header with title and description to prevent console errors */}
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Sidebar onNavClick={onNavClick} />
      </SheetContent>
    </Sheet>
  );
}

interface ContentColumnProps {
  children: ReactNode;
  user: User;
  onMenuClick: () => void;
}

function ContentColumn({ children, user, onMenuClick }: ContentColumnProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar user={user} onMenuClick={onMenuClick} />

      {!user.emailVerified && <VerifyBanner email={user.email} />}

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-6xl p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
