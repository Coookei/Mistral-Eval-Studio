import { mistral } from './mistral';
import type { CompletionRequest, CompletionResult, LlmMessage } from './types';

function buildMessages(request: CompletionRequest): LlmMessage[] {
  const messages: LlmMessage[] = [];

  if (request.systemPrompt?.trim()) {
    const systemPrompt = request.maxTokens
      ? request.systemPrompt.trim().replace(/{maxTokens}/g, request.maxTokens.toString())
      : request.systemPrompt.trim();
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: request.prompt });

  return messages;
}

export const llm = {
  async complete(request: CompletionRequest): Promise<CompletionResult> {
    return mistral.complete({
      model: request.model,
      messages: buildMessages(request),
      temperature: request.temperature,
      topP: request.topP,
      maxTokens: request.maxTokens,
    });
  },

  async stream(
    request: CompletionRequest,
    onChunk: (text: string) => void
  ): Promise<CompletionResult> {
    return mistral.stream(
      {
        model: request.model,
        messages: buildMessages(request),
        temperature: request.temperature,
        topP: request.topP,
        maxTokens: request.maxTokens,
      },
      onChunk
    );
  },
};
