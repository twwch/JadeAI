import { createOpenAI } from '@ai-sdk/openai';
import { config } from '@/lib/config';

const provider = createOpenAI({
  apiKey: config.ai.apiKey,
  baseURL: config.ai.baseURL,
});

export function getModel(modelId?: string) {
  return provider.chat(modelId || config.ai.model);
}
