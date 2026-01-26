'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';

interface Props {
  email: string;
}

export function EmailVerificationBanner({ email }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              Please verify your email address to access all features.{' '}
              <span className="text-amber-600">{email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              <Link href="/verify-email">Verify email</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
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
