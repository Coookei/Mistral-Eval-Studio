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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/authClient';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const dateFormatted = createdAt.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">Account created</div>
          <div className="text-sm text-muted-foreground">{dateFormatted}</div>
        </div>

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
