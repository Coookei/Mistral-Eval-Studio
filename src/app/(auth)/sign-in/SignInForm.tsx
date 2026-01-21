'use client';

import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authClient';
import { signInSchema, SignInValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = decodeURIComponent(searchParams.get('redirect') || '');

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      toast.success('Signed in successfully');
      router.push(redirect ?? '/dashboard');
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'github') {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? '/dashboard', // after oauth sign in redirect
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Something went wrong');
    }
  }

  // react hook to read from external sources - avoids hydration issues
  const lastMethod = useSyncExternalStore(
    () => () => {}, // subscribes to store, returns unsubscribe function
    () => {
      // getSnapshot function, returns current value
      const method = authClient.getLastUsedLoginMethod();
      return method === 'google' || method === 'github' || method === 'email' ? method : null;
    },
    () => null // getServerSnapshot function, initial snapshot
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Welcome back! Sign in to your account
        </CardDescription>
        {lastMethod === 'email' && (
          <CardDescription className="text-xs md:text-sm">
            You last signed in with email and password.
          </CardDescription>
        )}{' '}
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                    {lastMethod === 'email' && (
                      <Badge className="ml-1 bg-green-700">Last used</Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="min-h-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      tabIndex={9}
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm text-muted-foreground underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="min-h-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className={`w-full`} disabled={loading}>
              {'Sign In'}
              {loading && <Loader2 className="animate-spin" />}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn('google')}
              >
                <GoogleIcon width="0.98em" height="1em" className="mr-2 h-4 w-4" />
                Sign in with Google
                {lastMethod === 'google' && <Badge className="ml-1 bg-green-700">Last used</Badge>}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn('github')}
              >
                <Github className="mr-2 h-4 w-4" />
                Sign in with GitHub
                {lastMethod === 'github' && <Badge className="ml-1 bg-green-700">Last used</Badge>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={'/sign-up'} className="text-primary underline hover:opacity-80">
            Sign up
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
