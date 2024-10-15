import db from "@/lib/db";

export async function GET() {
  const prizes = db.prepare("SELECT * FROM prizes").all();
  return new Response(JSON.stringify(prizes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { name, priority } = await request.json();
  const stmt = db.prepare("INSERT INTO prizes (name, priority) VALUES (?, ?)");
  const info = stmt.run(name, priority);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
