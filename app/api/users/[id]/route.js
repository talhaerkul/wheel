import db from "@/lib/db";

export async function PUT(request, { params }) {
  const { id } = params;
  const { prize, instaFollow, linkedinFollow } = await request.json();
  const stmt = db.prepare(
    "UPDATE users SET prize = ?, instaFollow = ?, linkedinFollow = ? WHERE id = ?"
  );
  const info = stmt.run(prize, instaFollow ? 1 : 0, linkedinFollow ? 1 : 0, id);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
