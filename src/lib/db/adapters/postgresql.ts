import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { DatabaseAdapter } from '../adapter';

// Note: PostgreSQL adapter uses a different schema definition
// For now, this is a placeholder that would need pg-specific schema
export class PostgreSQLAdapter implements DatabaseAdapter {
  db;
  private client: ReturnType<typeof postgres>;

  constructor(connectionString: string) {
    this.client = postgres(connectionString);
    this.db = drizzle(this.client);
  }

  async initialize(): Promise<void> {
    // Tables are created via drizzle-kit migrate
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
