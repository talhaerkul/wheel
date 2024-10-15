import Database from "better-sqlite3";
const db = new Database("database.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    instagramUsername TEXT,
    linkedinUsername TEXT,
    prize TEXT,
    instaFollow INTEGER DEFAULT 0,
    linkedinFollow INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS prizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    priority INTEGER
  );

  CREATE TABLE IF NOT EXISTS instagram_followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS linkedin_followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;
