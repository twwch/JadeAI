import { config } from '@/lib/config';
import { SQLiteAdapter } from './adapters/sqlite';
import { PostgreSQLAdapter } from './adapters/postgresql';
import type { DatabaseAdapter } from './adapter';

let adapter: DatabaseAdapter;

if (config.db.type === 'postgresql') {
  adapter = new PostgreSQLAdapter(process.env.DATABASE_URL!);
} else {
  adapter = new SQLiteAdapter(process.env.SQLITE_PATH || './data/jade.db');
}

export const db = adapter.db;
export { adapter };
