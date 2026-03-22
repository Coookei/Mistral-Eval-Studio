import { llm } from '@/lib/llm';
import type { CompletionRequestBody } from './schema';

export type StreamChunk =
  | { type: 'chunk'; text: string }
  | {
      type: 'done';
      metrics: {
        latencyMs: number;
        finishReason: string;
        usage: { promptTokens: number; completionTokens: number; totalTokens: number };
      };
    }
  | { type: 'error'; message: string };

export const streamingService = {
  stream(request: CompletionRequestBody): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const enqueue = (chunk: StreamChunk) => {
          controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
        };

        try {
          // call stream and set up the onChunk callback to write a line of JSON to the stream
          const result = await llm.stream(request, (text) => {
            enqueue({ type: 'chunk', text }); // method called by mistral.ts each time a token arrives from the API
          });

          // when stream finished, add final line
          enqueue({
            type: 'done',
            metrics: {
              latencyMs: result.latencyMs,
              finishReason: result.finishReason,
              usage: result.usage,
            },
          });
        } catch (error) {
          enqueue({
            type: 'error',
            message: error instanceof Error ? error.message : 'Internal server error',
          });
        } finally {
          controller.close();
        }
      },
    });
  },
};
