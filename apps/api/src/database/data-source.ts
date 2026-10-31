import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const dataSource = new DataSource({
  type: 'postgres',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USERNAME || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_NAME || 'dbname',
  host: process.env.POSTGRES_HOST || 'localhost',
  entities: [path.resolve(currentDir, '..') + '/**/*.entity{.ts,.js}'],
  migrations: [path.resolve(currentDir, 'migrations') + '/*{.ts,.js}'],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
