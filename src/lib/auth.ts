import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { lastLoginMethod } from 'better-auth/plugins';
import { after } from 'next/server';
import { sendEmail } from './email';
import { passwordSchema } from './validators';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60 * 24, // token in email/database expires after 24 hours
    async sendResetPassword({ user, url }) {
      // after extends lifetime on serverless platforms so emails can still get sent
      after(async () => {
        // schedule email sending after the response to reduce timing differences
        // and timing based attacks, and keep auth fast
        const { error } = await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          text: `Please reset your password by clicking the following link: ${url}. This link will expire after 24 hours.`,
        });
        if (error) console.error('Error sending password reset email:', error);
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // jwt validation token in email expires after 24 hours
    async sendVerificationEmail({ user, url }) {
      // after extends lifetime on serverless platforms so emails can still get sent
      after(async () => {
        // schedule email sending after the response to reduce timing differences
        // and timing based attacks, and keep auth fast
        const { error } = await sendEmail({
          to: user.email,
          subject: 'Verify your email address',
          text: `Please verify your email by clicking the following link: ${url}. This link will expire after 24 hours.`,
        });
        if (error) console.error('Error sending verification email:', error);
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        input: false, // not user settable
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14, // users session lasts 14 days
  },
  plugins: [lastLoginMethod()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
