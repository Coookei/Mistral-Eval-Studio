'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navLinks: { href: string; label: string }[] = [
  // { href: '/about', label: 'About' },
  // { href: '/docs', label: 'Docs' },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-14 sm:h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          <DesktopNav />
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <MobileNav open={isOpen} onOpenChange={setIsOpen} />
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-md bg-foreground text-background shadow-sm">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">M</span>
        <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-border/40" />
      </div>
      <span className="font-semibold text-base sm:text-lg">Mistral Eval Studio</span>
    </Link>
  );
}

function DesktopNav() {
  return navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {link.label}
    </Link>
  ));
}

function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-75 sm:w-90 p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="text-left text-lg">Mistral Eval Studio</SheetTitle>
            <SheetDescription>Welcome. Let&apos;s get you started.</SheetDescription>
          </SheetHeader>

          <nav className="flex-1 overflow-auto px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center rounded-md px-2 py-2 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* add back pt-4 to this div if decide to add navbar links */}
            <div className="space-y-3">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/sign-in" onClick={() => onOpenChange(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard" onClick={() => onOpenChange(false)}>
                  Open dashboard
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
