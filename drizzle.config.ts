import { defineConfig } from 'drizzle-kit';

const dbType = process.env.DB_TYPE || 'sqlite';

export default defineConfig(
  dbType === 'postgresql'
    ? {
        schema: './src/lib/db/schema.ts',
        out: './drizzle/migrations',
        dialect: 'postgresql',
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      }
    : {
        schema: './src/lib/db/schema.ts',
        out: './drizzle/migrations',
        dialect: 'sqlite',
        dbCredentials: {
          url: process.env.SQLITE_PATH || './data/jade.db',
        },
      }
);
