'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { initials } from '@/lib/utils';
import { imageUrlSchema, ImageUrlValues, profileSchema, ProfileValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Camera, CheckCircle2, Link2, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type Props = {
  defaultName: string;
  defaultImageUrl: string | null;
};

export function ProfileSettingsCard({ defaultName, defaultImageUrl }: Props) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultName,
      image: defaultImageUrl,
    },
    mode: 'onChange',
  });

  // useWatch shows using field subscription and avoids form.watch() lint issues
  const nameValue = useWatch({ control: form.control, name: 'name' });
  const imageValue = useWatch({ control: form.control, name: 'image' });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ name, image }: ProfileValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.updateUser({ name, image });

    if (error) {
      setError(error.message || 'Unable to update profile');
    } else {
      setSuccess('Profile updated');
    }
  }

  function updateImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result ? String(reader.result) : null;
      form.setValue('image', base64, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  }

  function setImageUrl(value: string) {
    const nextValue = value.trim();
    form.setValue('image', nextValue.length > 0 ? nextValue : null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function clearImage() {
    form.setValue('image', null, { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const currentUrl =
    imageValue && (imageValue.startsWith('http://') || imageValue.startsWith('https://'))
      ? imageValue
      : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={imageValue || undefined} />
                        <AvatarFallback className="text-xl">
                          {initials(nameValue || defaultName)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        disabled={loading}
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change profile picture</span>
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Profile picture</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 5MB. Or use a hosted image URL.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <ImageUrlDialog
                          open={urlDialogOpen}
                          onOpenChange={setUrlDialogOpen}
                          defaultValue={currentUrl}
                          disabled={loading}
                          onSubmit={(url) => {
                            setImageUrl(url);
                            setUrlDialogOpen(false);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          disabled={loading || !imageValue}
                        >
                          Reset
                        </Button>
                      </div>
                      <FormMessage />
                    </div>
                  </div>
                  <FormControl>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        updateImage(file);
                      }}
                      className="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} className="max-w-md" disabled={loading} />
                  </FormControl>
                  <FormMessage className="min-h-5" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
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
}

type ImageUrlDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  disabled: boolean;
  onSubmit: (url: string) => void;
};

function ImageUrlDialog({
  open,
  onOpenChange,
  defaultValue,
  disabled,
  onSubmit,
}: ImageUrlDialogProps) {
  const form = useForm<ImageUrlValues>({
    resolver: zodResolver(imageUrlSchema),
    defaultValues: {
      url: defaultValue || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      form.reset({ url: defaultValue || '' });
    }
  }, [defaultValue, form, open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          <Link2 className="h-4 w-4" />
          Use image URL
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Use an image URL</AlertDialogTitle>
          <AlertDialogDescription>
            Paste a direct link to a self-hosted image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              onSubmit(values.url.trim());
            })}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="profile-image-url">Image URL</FormLabel>
                  <FormControl>
                    <Input
                      id="profile-image-url"
                      type="url"
                      placeholder="https://example.com/avatar.png"
                      disabled={disabled}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit" disabled={disabled || !form.formState.isValid}>
                Use URL
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
