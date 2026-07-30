import "reflect-metadata";
import { DataSource } from "typeorm";
import { ProductSchema } from "./product.schema";

// Cache the DataSource on globalThis so Next's dev hot-reload reuses one pool
// instead of opening a new connection on every module reload.
const globalForDb = globalThis as unknown as {
  __andyhairDataSource?: DataSource;
};

function createDataSource(): DataSource {
  // Options shared by both configuration styles.
  const common = {
    type: "postgres" as const,
    schema: process.env.DATABASE_SCHEMA || undefined,
    entities: [ProductSchema],
    // Single tiny table — auto-sync the schema instead of running migrations.
    synchronize: true,
    // Small pool: on Vercel each warm function keeps its own pool, so cap it to
    // avoid exhausting Postgres connections under many concurrent instances.
    poolSize: Number(process.env.DB_POOL_SIZE ?? 5),
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  };

  // Preferred: a single connection string. Vercel's Postgres/Neon integration
  // may inject it as DATABASE_URL or POSTGRES_URL — accept either.
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (url) return new DataSource({ ...common, url });

  // Fallback: discrete vars, convenient for local development.
  const host = process.env.DB_HOST;
  const username = process.env.DB_USERNAME;
  if (!host && !username) {
    throw new Error(
      "Database not configured — set DATABASE_URL, or DB_HOST/DB_PORT/DB_USERNAME/DB_PASSWORD/DB_NAME",
    );
  }
  return new DataSource({
    ...common,
    host: host ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: username ?? "postgres",
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME ?? "andyhair",
  });
}

/** Get the initialized shared DataSource, connecting on first use. */
export async function getDataSource(): Promise<DataSource> {
  const existing = globalForDb.__andyhairDataSource;
  if (existing?.isInitialized) return existing;

  const dataSource = existing ?? createDataSource();
  globalForDb.__andyhairDataSource = dataSource;
  if (!dataSource.isInitialized) await dataSource.initialize();
  return dataSource;
}
