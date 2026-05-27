import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

// Check if environment variables are loaded
if (!process.env.POSTGRES_PORT) {
  console.error(
    'Error: Environment variables not loaded. Please check your .env file.',
  );
  process.exit(1);
}

const isDevelopment = process.env.NODE_ENV === 'development';

const dataSource = new DataSource({
  type: 'postgres',
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_NAME || 'dbname',
  host: process.env.POSTGRES_HOST || 'localhost',
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  synchronize: isDevelopment,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
