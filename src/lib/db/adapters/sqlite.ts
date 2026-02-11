import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../schema';
import type { DatabaseAdapter } from '../adapter';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

export class SQLiteAdapter implements DatabaseAdapter {
  db;
  private sqlite: Database.Database;

  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true });
    this.sqlite = new Database(path);
    this.sqlite.pragma('journal_mode = WAL');
    this.sqlite.pragma('foreign_keys = ON');
    this.db = drizzle(this.sqlite, { schema });
  }

  async initialize(): Promise<void> {
    // Tables are created via drizzle-kit migrate
  }

  async close(): Promise<void> {
    this.sqlite.close();
  }
}
