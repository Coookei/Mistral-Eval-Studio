import type { CompletionRequestBody } from '@/app/api/llm/complete/schema';
import type { StreamChunk } from '@/app/api/llm/stream/service';
import type { RunMetrics } from './NewComparisonPageComponent';

export async function streamCompletion(
  body: CompletionRequestBody,
  onChunk: (text: string) => void
): Promise<RunMetrics> {
  const response = await fetch('/api/llm/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // can add more user friendly error messages here in future
    throw new Error(`Request failed with status ${response.status}`);
  }

  // browser side reader to process stream of JSON lines from API
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as StreamChunk;
      if (event.type === 'chunk') {
        onChunk(event.text); // browser onChunk which adds the new text to the UI
      } else if (event.type === 'done') {
        return {
          latency: event.metrics.latencyMs,
          inputTokens: event.metrics.usage.promptTokens,
          outputTokens: event.metrics.usage.completionTokens,
          finishReason: event.metrics.finishReason,
        };
      } else if (event.type === 'error') {
        throw new Error(event.message);
      }
    }
  }

  throw new Error('Stream ended without a done event');
}
