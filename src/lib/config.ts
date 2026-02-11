export const config = {
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    providers: ['google'] as const,
  },
  db: {
    type: (process.env.DB_TYPE || 'sqlite') as 'postgresql' | 'sqlite',
  },
  ai: {
    apiKey: process.env.AI_API_KEY || '',
    baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.AI_MODEL || 'gpt-4o',
  },
  i18n: {
    defaultLocale: 'zh' as const,
    locales: ['zh', 'en'] as const,
  },
};
