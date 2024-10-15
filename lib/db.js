import { Pool } from "pg";
import { sql } from "@vercel/postgres";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        instagramUsername TEXT,
        linkedinUsername TEXT,
        prize TEXT,
        instaFollow BOOLEAN DEFAULT FALSE,
        linkedinFollow BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS prizes (
        id SERIAL PRIMARY KEY,
        name TEXT,
        priority INTEGER
      );

      CREATE TABLE IF NOT EXISTS instagram_followers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS linkedin_followers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

initDatabase();

export { sql, pool };
