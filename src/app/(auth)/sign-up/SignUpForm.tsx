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
import { signUpSchema, SignUpValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function SignUpForm() {
  // due to using social logins, we need loading state as cannot use the loading state of the form itself
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  async function onSubmit({ email, password, firstName, lastName }: SignUpValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: firstName + ' ' + lastName,
      callbackURL: '/email-verified', // directed to after user clicks link in verification email
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      toast.success("Welcome to Mistral Eval Studio! Let's get you started!");
      router.push('/dashboard'); // after initial sign up send to dashboard
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'github') {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard', // after oauth sign up redirect
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
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Create a new account to get started
        </CardDescription>{' '}
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Doe" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className={`w-full mt-6`} disabled={loading}>
              {'Create an account'}
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
                Continue with Google
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
                Continue with GitHub
                {lastMethod === 'github' && <Badge className="ml-1 bg-green-700">Last used</Badge>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={'/sign-in'} className="text-primary underline hover:opacity-80">
            Sign in
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
