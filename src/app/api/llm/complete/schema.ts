import { MODELS } from '@/lib/validators/comparison';
import z from 'zod';

export const completionRequestSchema = z.object({
  model: z.enum(MODELS),
  prompt: z.string().min(1, { message: 'Prompt is required' }),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  topP: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().min(1).max(4096).optional(),
});

export type CompletionRequestBody = z.infer<typeof completionRequestSchema>;
