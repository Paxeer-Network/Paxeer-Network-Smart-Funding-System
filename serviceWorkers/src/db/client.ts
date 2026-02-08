import pg from "pg";
import { CONFIG } from "../config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: CONFIG.databaseUrl,
});

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err);
});

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}
