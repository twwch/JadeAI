export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    toolCalls?: AIToolCall[];
  };
  createdAt: Date;
}

export interface AIToolCall {
  tool: string;
  args: Record<string, unknown>;
  applied: boolean;
}

export interface AIChatSession {
  id: string;
  resumeId: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
