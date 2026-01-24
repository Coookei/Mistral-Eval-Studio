import z from 'zod';

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const DATA_URL_PREFIX = /^data:image\/[a-zA-Z0-9.+-]+;base64,/; // regex to validate base64 image data urls

export const imageUrlSchema = z.object({
  url: z
    .url({ message: 'Enter a valid URL' })
    .trim()
    .refine((value) => value.startsWith('http://') || value.startsWith('https://'), {
      message: 'URL must start with http:// or https://',
    }),
});

const profileImageSchema = z
  .string()
  .trim()
  .nullable()
  .superRefine((value, ctx) => {
    if (!value) return; // allow null or empty values
    if (value.startsWith('http://') || value.startsWith('https://')) return; // allow normal hosted image urls

    // if not a URL, it must be a valid base64 data URL
    if (!DATA_URL_PREFIX.test(value)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Image must be a valid data URL',
      });
      return;
    }

    // extract the base64 portion after the comma
    const base64 = value.split(',')[1] ?? '';

    // and calculate padding which is characters at the end
    const paddingMatch = base64.match(/=*$/);
    const padding = paddingMatch ? paddingMatch[0].length : 0;

    // convert base64 length to byte size
    const size = Math.floor((base64.length * 3) / 4) - padding;

    // enforce max size validation
    if (size > MAX_PROFILE_IMAGE_BYTES) {
      ctx.addIssue({
        code: 'custom',
        message: 'Image must be 5MB or smaller',
      });
    }
  });

export const profileSchema = z.object({
  name: z.string().min(1, { message: 'Full name is required' }),
  image: profileImageSchema,
});

export const changeEmailSchema = z.object({
  email: z.email({ message: 'Please enter a valid email' }),
});

export type ImageUrlValues = z.infer<typeof imageUrlSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
