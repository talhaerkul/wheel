import db from "@/lib/db";

export async function GET() {
  const users = db.prepare("SELECT * FROM users").all();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const {
    name,
    instagramUsername,
    linkedinUsername,
    prize,
    instaFollow,
    linkedinFollow,
  } = await request.json();
  const stmt = db.prepare(
    "INSERT INTO users (name, instagramUsername, linkedinUsername, prize, instaFollow, linkedinFollow) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    name,
    instagramUsername,
    linkedinUsername,
    prize,
    instaFollow === true ? 1 : 0,
    linkedinFollow === true ? 1 : 0
  );
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request) {
  const { id, instaFollow, linkedinFollow } = await request.json();
  const stmt = db.prepare(
    "UPDATE users SET instaFollow = ?, linkedinFollow = ? WHERE id = ?"
  );
  const info = stmt.run(instaFollow, linkedinFollow, id);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
