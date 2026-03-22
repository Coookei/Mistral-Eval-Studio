import { mistral } from './mistral';
import type { CompletionRequest, CompletionResult, LlmMessage } from './types';

export const llm = {
  async complete(request: CompletionRequest): Promise<CompletionResult> {
    const messages: LlmMessage[] = [];

    // build any system messages
    if (request.systemPrompt?.trim()) {
      const systemPrompt = request.maxTokens
        ? request.systemPrompt.trim().replace(/{maxTokens}/g, request.maxTokens.toString())
        : request.systemPrompt.trim();
      messages.push({ role: 'system', content: systemPrompt });
    }

    // add user prompt
    messages.push({ role: 'user', content: request.prompt });

    // can easily swap between llm providers as have a public interface
    return mistral.complete({
      model: request.model,
      messages,
      temperature: request.temperature,
      topP: request.topP,
      maxTokens: request.maxTokens,
    });
  },
};
