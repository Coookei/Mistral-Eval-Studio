// import { JSX } from "react";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
  // template: JSX.Element;
}

export function sendEmail({ to, subject, text }: SendEmailValues) {
  // return resend promise, which is then scheduled to run as appropriate
  return resend.emails.send({
    from: `Mistral Eval Studio <noreply@${process.env.RESEND_SENDING_EMAIL}>`,
    to,
    subject,
    text,
    // react: template,
  });
}
