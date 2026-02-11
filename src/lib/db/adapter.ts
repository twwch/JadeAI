export interface DatabaseAdapter {
  db: any;
  initialize(): Promise<void>;
  close(): Promise<void>;
}
