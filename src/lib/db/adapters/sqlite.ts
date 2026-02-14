import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../schema';
import type { DatabaseAdapter } from '../adapter';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

export class SQLiteAdapter implements DatabaseAdapter {
  db;
  private sqlite: Database.Database;

  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true });
    this.sqlite = new Database(path);
    this.sqlite.pragma('journal_mode = WAL');
    this.sqlite.pragma('foreign_keys = ON');
    this.db = drizzle(this.sqlite, { schema });

    // Auto-run migrations (synchronous for SQLite)
    try {
      migrate(this.db, { migrationsFolder: resolve(process.cwd(), 'drizzle/migrations') });
    } catch (e) {
      console.error('[DB] SQLite migration failed:', e);
    }
  }

  async initialize(): Promise<void> {
    try {
      const row = this.sqlite.prepare('SELECT count(*) as count FROM users').get() as any;
      if (row?.count === 0) {
        const { seedDemoUser } = await import('../seed-demo');
        await seedDemoUser(this.db);
        console.log('[DB] SQLite auto-seed complete');
      }
    } catch (e) {
      console.error('[DB] SQLite auto-seed failed:', e);
    }
  }

  async close(): Promise<void> {
    this.sqlite.close();
  }
}
