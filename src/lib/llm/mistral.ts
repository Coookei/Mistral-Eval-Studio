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

  async stream(request: LlmRequest, onChunk: (text: string) => void): Promise<CompletionResult> {
    const start = Date.now();

    const eventStream = await getClient().chat.stream({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      topP: request.topP,
      maxTokens: request.maxTokens,
    });

    let text = '';
    let finishReason = 'unknown';
    let promptTokens = 0;
    let completionTokens = 0;
    let totalTokens = 0;
    let rawId = '';

    for await (const event of eventStream) {
      const chunk = event.data;
      rawId = chunk.id;

      const delta = chunk.choices?.[0]?.delta.content;
      if (typeof delta === 'string' && delta) {
        text += delta;
        onChunk(delta); // this method is passed from the API streamingService, each delta is written as an JSON line to the HTTP stream to be read by browser
      }

      const chunkFinishReason = chunk.choices?.[0]?.finishReason;
      if (chunkFinishReason) finishReason = chunkFinishReason;

      if (chunk.usage) {
        promptTokens = chunk.usage.promptTokens ?? 0;
        completionTokens = chunk.usage.completionTokens ?? 0;
        totalTokens = chunk.usage.totalTokens ?? 0;
      }
    }

    return {
      text,
      latencyMs: Date.now() - start,
      finishReason,
      usage: { promptTokens, completionTokens, totalTokens },
      rawId,
    };
  },
};
