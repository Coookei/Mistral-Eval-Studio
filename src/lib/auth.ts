import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware } from 'better-auth/api';
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
    changeEmail: {
      enabled: true,
      async sendChangeEmailConfirmation({ user, newEmail, url }) {
        // authed action so no need for after here.
        // note: the jwt token in email also expires after 24 hours as above
        const { error } = await sendEmail({
          to: user.email, // send to CURRENT email to confirm change
          subject: 'Approve your email change',
          text: `You have requested to change your account email to ${newEmail}. To start this change, please click the following link: ${url}. An email will then be sent to ${newEmail} which you must approve to complete the change. This link will expire after 24 hours.`,
        });
        if (error) console.error('Error sending email change confirmation email:', error);
      },
    },
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        input: false, // not user settable
      },
    },
  },
  account: {
    accountLinking: {
      allowDifferentEmails: false, // all oauth accounts must match main email
    },
  },
  socialProviders: {
    google: {
      prompt: 'select_account', // to always ask user to select which account
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      prompt: 'select_account',
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14, // users session lasts 14 days
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === '/sign-up/email' ||
        ctx.path === '/reset-password' ||
        ctx.path === '/change-password'
      ) {
        // apply password validation logic on the server-side to the
        // sign up, reset password, and change password pages.
        const password = ctx.body.password || ctx.body.newPassword;
        const validation = passwordSchema.safeParse(password);
        if (!validation.success) {
          throw new APIError('BAD_REQUEST', {
            message: 'Password does not meet strength requirements',
          });
        }
      }
    }),
  },
  plugins: [lastLoginMethod({ storeInDatabase: true })],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
