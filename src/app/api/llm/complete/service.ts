import { llm } from '@/lib/llm';
import type { CompletionResult } from '@/lib/llm/types';
import type { CompletionRequestBody } from './schema';

export const completionService = {
  async complete(request: CompletionRequestBody): Promise<CompletionResult> {
    return llm.complete(request);
  },
};
