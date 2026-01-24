export interface LLMProvider {
  complete(prompt: string, signal?: AbortSignal): Promise<string>;
}
