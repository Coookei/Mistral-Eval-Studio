import { Mistral } from '@mistralai/mistralai';
import type { CompletionResult, LlmRequest } from './types';

let _client: Mistral | undefined;

function getClient(): Mistral {
  if (!_client) {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) throw new Error('MISTRAL_API_KEY is not set');
    _client = new Mistral({ apiKey });
  }
  return _client;
}

// mistral is a provider implementation of the llm interface
export const mistral = {
  async complete(request: LlmRequest): Promise<CompletionResult> {
    const start = Date.now();

    const result = await getClient().chat.complete({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      topP: request.topP,
      maxTokens: request.maxTokens,
    });

    const latencyMs = Date.now() - start;

    const choice = result.choices?.[0];
    if (!choice) throw new Error('Mistral returned no choice objects');
    const content = choice.message.content;
    if (typeof content !== 'string') throw new Error('Mistral returned a non-text response');

    return {
      text: content,
      latencyMs,
      finishReason: choice.finishReason ?? 'unknown',
      usage: {
        promptTokens: result.usage?.promptTokens ?? 0,
        completionTokens: result.usage?.completionTokens ?? 0,
        totalTokens: result.usage?.totalTokens ?? 0,
      },
      rawId: result.id,
    };
  },
};
