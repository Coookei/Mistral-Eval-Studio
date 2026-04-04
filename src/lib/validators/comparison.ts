import z from 'zod';

export const MODELS = [
  'mistral-small-latest',
  'mistral-medium-latest',
  'mistral-large-latest',
] as const;
export type Model = (typeof MODELS)[number];

const samplingConfigSchema = z.object({
  temperature: z.number().min(0).max(1),
  topP: z.number().min(0).max(1),
  maxTokens: z.number().int().min(1).max(4096),
});

export const comparisonRunSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt is required' }),
  useSharedInstructions: z.boolean(),
  sharedInstructions: z.string(),
  instructionsA: z.string(),
  instructionsB: z.string(),
  linkSampling: z.boolean(),
  modelA: z.enum(MODELS),
  modelB: z.enum(MODELS),
  sharedConfig: samplingConfigSchema,
  configA: samplingConfigSchema,
  configB: samplingConfigSchema,
});

export const evaluationSchema = z.object({
  winner: z.union([z.enum(['A', 'B', 'Tie']), z.literal('')]),
  notes: z.string().max(1000, { message: 'Notes must be at most 1000 characters' }),
});

export type ComparisonRunValues = z.infer<typeof comparisonRunSchema>;
export type EvaluationValues = z.infer<typeof evaluationSchema>;
