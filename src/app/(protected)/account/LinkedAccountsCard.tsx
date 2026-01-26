'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/authClient';
import { getRelativeTime } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Globe, KeyRound, Link2, Loader2, Unlink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type LinkedAccount = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  scopes: string[];
};

export function LinkedAccountsCard() {
  const [success, setSuccess] = useState<string | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  const hasCredentialAccount = linkedAccounts.some((acc) => acc.providerId === 'credential');
  const hasGoogleAccount = linkedAccounts.some((acc) => acc.providerId === 'google');
  const hasGitHubAccount = linkedAccounts.some((acc) => acc.providerId === 'github');

  const loadAccounts = async () => {
    setAccountsError(null);
    setIsLoadingAccounts(true);

    const { data, error } = await authClient.listAccounts();
    setIsLoadingAccounts(false);

    if (error) {
      setAccountsError(error.message || 'Unable to load accounts. Please reload this page.');
    } else {
      setLinkedAccounts(data);
    }
  };

  const handleLinkAccount = async (provider: 'google' | 'github') => {
    setSuccess(null);
    setLinkingProvider(provider);

    const { error } = await authClient.linkSocial({
      provider: provider,
      callbackURL: '/account',
    });

    if (error) {
      setAccountsError(error.message || 'Unable to link account');
    }
    // no more state changes, as UI changes flash up briefly before being sent to provider
  };

  const handleUnlinkAccount = async (providerId: string) => {
    setSuccess(null);
    setUnlinkingProvider(providerId);

    const { error } = await authClient.unlinkAccount({
      providerId: providerId,
    });

    if (error) {
      setAccountsError(error.message || 'Unable to unlink account');
    } else {
      setSuccess(`Successfully unlinked ${getProviderName(providerId)} account`);
      setLinkedAccounts((prev) => prev.filter((acc) => acc.providerId !== providerId));
    }

    setUnlinkingProvider(null);
  };

  useEffect(() => {
    // defer to avoid react-hooks/set-state-in-effect warning
    // caused by synchronous setState calls inside loadAccounts call
    const timeoutId = setTimeout(() => {
      void loadAccounts();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked accounts</CardTitle>
        <CardDescription>Connect your accounts for easier sign in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accountsError && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md max-w-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {accountsError}
          </div>
        )}
        {isLoadingAccounts && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading account info...
          </div>
        )}

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getProviderIcon('credential')}
            <div>
              <p className={`font-medium ${hasCredentialAccount && 'text-green-600'}`}>
                Email & Password
              </p>
              {hasCredentialAccount ? (
                <p className="text-sm text-muted-foreground">Password is set</p>
              ) : (
                <p className="text-sm text-amber-600">No password set</p>
              )}
            </div>
          </div>
          {hasCredentialAccount ? (
            <Badge variant="secondary">Connected</Badge>
          ) : (
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/forgot-password">Set password</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getProviderIcon('google')}
            <div>
              <p className={`font-medium ${hasGoogleAccount && 'text-green-600'}`}>Google</p>
              {hasGoogleAccount ? (
                <p className="text-sm text-muted-foreground">
                  Linked{' '}
                  {getRelativeTime(
                    linkedAccounts.find((a) => a.providerId === 'google')?.createdAt
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {hasGoogleAccount ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={unlinkingProvider === 'google' || isLoadingAccounts}
                  className="bg-transparent"
                >
                  <Unlink className="mr-2 h-4 w-4" />
                  {unlinkingProvider === 'google' ? 'Unlinking...' : 'Unlink'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unlink Google account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will no longer be able to sign in with Google. Make sure you have another
                    way to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUnlinkAccount('google')}>
                    Unlink Google
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLinkAccount('google')}
              disabled={linkingProvider === 'google' || isLoadingAccounts}
              className="bg-transparent"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {linkingProvider === 'google' ? 'Linking...' : 'Link'}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getProviderIcon('github')}
            <div>
              <p className={`font-medium ${hasGitHubAccount && 'text-green-600'}`}>GitHub</p>
              {hasGitHubAccount ? (
                <p className="text-sm text-muted-foreground">
                  Linked{' '}
                  {getRelativeTime(
                    linkedAccounts.find((a) => a.providerId === 'github')?.createdAt
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {hasGitHubAccount ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={unlinkingProvider === 'github' || isLoadingAccounts}
                  className="bg-transparent"
                >
                  <Unlink className="mr-2 h-4 w-4" />
                  {unlinkingProvider === 'github' ? 'Unlinking...' : 'Unlink'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unlink GitHub account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will no longer be able to sign in with GitHub. Make sure you have another
                    way to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUnlinkAccount('github')}>
                    Unlink GitHub
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLinkAccount('github')}
              disabled={linkingProvider === 'github' || isLoadingAccounts}
              className="bg-transparent"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {linkingProvider === 'github' ? 'Linking...' : 'Link'}
            </Button>
          )}
        </div>
        {success && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

function getProviderName(providerId: string): string {
  switch (providerId) {
    case 'google':
      return 'Google';
    case 'github':
      return 'GitHub';
    case 'credential':
      return 'Email & Password';
    default:
      return providerId;
  }
}

function getProviderIcon(providerId: string) {
  switch (providerId) {
    case 'google':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    case 'github':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'credential':
      return <KeyRound className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Globe className="h-5 w-5 text-muted-foreground" />;
  }
}
