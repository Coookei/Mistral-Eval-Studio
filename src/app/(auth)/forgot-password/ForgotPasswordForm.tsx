'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2Icon, Mail, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password', // redirect to after user click link in reset password email
    });

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      setSubmittedEmail(email);
    }
  }

  const loading = form.formState.isSubmitting;
  const isSubmitted = submittedEmail !== null;

  return (
    <div className="w-full max-w-md space-y-4 bg-muted/30">
      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
              {error && (
                <div className="flex items-center justify-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md mt-4">
                  <TriangleAlertIcon className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="min-h-5" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                  {loading && <Loader2Icon className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              If an account exists, we&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-foreground">{submittedEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Click the link in your email to reset your password. The link will expire in 24 hours.
            </p>

            <Button variant="outline" onClick={() => setSubmittedEmail(null)} className="w-full">
              Try a different email
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button variant="ghost" asChild>
          <Link href="/sign-in">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
