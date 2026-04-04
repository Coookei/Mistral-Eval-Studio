// -- llm public interface types --

export interface CompletionRequest {
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

export interface LlmUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface CompletionResult {
  text: string;
  latencyMs: number;
  finishReason: string;
  usage: LlmUsage;
  rawId: string; /* provider response Id*/
}

// -- llm internal types used by provider implementations e.g. mistral --

export interface LlmMessage {
  role: 'system' | 'user';
  content: string;
}

export interface LlmRequest {
  model: string;
  messages: LlmMessage[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}
