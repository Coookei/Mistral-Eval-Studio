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
import { Separator } from '@/components/ui/separator';
import type { Session as AuthSession } from '@/lib/auth';
import { authClient } from '@/lib/authClient';
import { formatDateTime, getRelativeTime } from '@/lib/utils';
import { AlertCircle, Loader2, LogOut, Monitor, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  createdAt: Date;
}

export function SecuritySettingsCard({ createdAt }: Props) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();

  const handleSignOutEverywhere = async () => {
    setIsSigningOut(true);

    const { error } = await authClient.revokeSessions();
    setIsSigningOut(false);

    if (error) {
      toast.error(error.message || 'Something went wrong');
    } else {
      toast.success('Signed out of all devices');
      router.push('/sign-in');
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const { error } = await authClient.signOut();
    setIsSigningOut(false);

    if (error) {
      toast.error(error.message || 'Something went wrong');
    } else {
      toast.success('Signed out successfully');
      router.push('/sign-in');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">Account created</div>
          <div className="text-sm text-muted-foreground">{formatDateTime(createdAt)}</div>
        </div>

        <Separator />

        <ActiveSessions />

        <Separator />

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Sign out of all devices</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This will sign you out of all devices and sessions, including this one.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out everywhere
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out of all devices and sessions, including this one. You will
                  need to sign in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOutEverywhere} disabled={isSigningOut}>
                  {isSigningOut ? 'Signing out...' : 'Sign out everywhere'}
                  {isSigningOut && <Loader2 className="animate-spin" />}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? 'Signing out...' : 'Sign out'}
            {isSigningOut && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type Session = AuthSession['session'];

function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [revokingSession, setRevokingSession] = useState<string | null>(null); // token used here
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const session = authClient.useSession();
  const currentSessionId = session.data?.session.id;

  const loadSessions = async () => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await authClient.listSessions();
    setIsLoading(false);

    if (error) {
      setError(error.message || 'Unable to load sessions');
    } else {
      setSessions(data);
    }
  };

  const handleRevokeSession = async (token: string) => {
    setRevokingSession(token);

    const { error } = await authClient.revokeSession({ token });

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success('Session revoked');
    }

    setRevokingSession(null);
  };

  useEffect(() => {
    // defer to avoid react-hooks/set-state-in-effect warning
    // caused by synchronous setState calls inside loadSessions call
    const timeoutId = setTimeout(() => {
      void loadSessions();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium">Active sessions</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Devices where you are currently signed in
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md max-w-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading sessions...
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((session) => {
          const { browser, os, device } = parseUserAgent(session.userAgent);
          const isCurrentSession = session.id === currentSessionId;
          const DeviceIcon = device === 'mobile' ? Smartphone : Monitor;

          return (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${isCurrentSession ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${isCurrentSession ? 'bg-primary/10' : 'bg-muted'}`}
                >
                  <DeviceIcon
                    className={`h-5 w-5 ${isCurrentSession ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {browser} on {os}
                    </p>
                    {isCurrentSession && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{session.ipAddress === '::1' ? 'localhost' : session.ipAddress}</span>
                    <span>·</span>
                    <span>Last active {getRelativeTime(session.updatedAt)}</span>
                  </div>
                </div>
              </div>
              {!isCurrentSession && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={revokingSession === session.token}
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      {revokingSession === session.token ? 'Revoking...' : 'Revoke'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign out the device ({browser} on {os}). They will need to sign in
                        again to access their account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRevokeSession(session.token)}>
                        Revoke session
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseUserAgent(userAgent: string | null | undefined): {
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet';
} {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';

  if (!userAgent) {
    return { browser, os, device };
  }

  // parse browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    browser = `Chrome ${match?.[1]?.split('.')[0] || ''}`;
  } else if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    browser = `Firefox ${match?.[1]?.split('.')[0] || ''}`;
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/([\d.]+)/);
    browser = `Safari ${match?.[1]?.split('.')[0] || ''}`;
  } else if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/([\d.]+)/);
    browser = `Edge ${match?.[1]?.split('.')[0] || ''}`;
  }

  // parse operating system
  if (userAgent.includes('Mac OS X')) {
    os = 'macOS';
  } else if (userAgent.includes('Windows NT 10')) {
    os = 'Windows 10/11';
  } else if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
    device = 'mobile';
  } else if (userAgent.includes('iPhone')) {
    os = 'iOS';
    device = 'mobile';
  } else if (userAgent.includes('iPad')) {
    os = 'iPadOS';
    device = 'tablet';
  }

  // check if mobile device
  if (userAgent.includes('Mobile') && device === 'desktop') {
    device = 'mobile';
  }

  return { browser, os, device };
}
