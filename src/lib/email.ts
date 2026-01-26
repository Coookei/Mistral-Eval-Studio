import { CreateEmailResponse, Resend } from 'resend';

let resendClient: Resend | null = null;

const isTestEnv = () => {
  return process.env.NODE_ENV === 'test' || process.env.CI === 'true';
};

const getResendClient = (): Resend => {
  if (isTestEnv()) {
    throw new Error('Resend client is not available in test/CI environment');
  }

  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  resendClient = new Resend(apiKey);
  return resendClient;
};

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export function sendEmail({ to, subject, text }: SendEmailValues): Promise<CreateEmailResponse> {
  const resend = getResendClient();

  // return resend promise, which is then scheduled to run as appropriate
  return resend.emails.send({
    from: `Mistral Eval Studio <noreply@${process.env.RESEND_SENDING_EMAIL}>`,
    to,
    subject,
    text,
  });
}
