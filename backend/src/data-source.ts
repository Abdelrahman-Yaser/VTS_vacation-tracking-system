// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// import { Product } from './modules/products/entities/product.entity';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'vts',
  entities: [__dirname + '/modules/**/entities/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // false عشان تستخدم migrations
});
