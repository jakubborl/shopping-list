import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "database.db";

const db = new Database(dbPath);

export default db;
