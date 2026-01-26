'use client';

import { useState } from 'react';
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
import { changeEmailSchema, ChangeEmailValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/authClient';

type Props = {
  currentEmail: string;
};

export const EmailSettingsCard = ({ currentEmail }: Props) => {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ email: newEmail }: ChangeEmailValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: '/email-verified', // taken to after user clicks link in approve change email
    });

    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      form.reset({ email: '' });
      setSuccess(
        'Verification email sent to your current address. Please follow the link in the email'
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email address</CardTitle>
        <CardDescription>
          Change your email address. A verification link will be sent to your email to confirm this
          change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Current email</FormLabel>
              <p className="text-sm text-muted-foreground">{currentEmail}</p>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="newEmail">New email address</FormLabel>
                  <FormControl>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="newemail@example.com"
                      {...field}
                      className="max-w-md"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="min-h-5" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading || !form.formState.isValid}>
                {loading ? 'Sending verification...' : 'Change email'}
                {loading && <Loader2 className="animate-spin" />}
              </Button>
              {success && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </span>
              )}
              {error && (
                <span className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
