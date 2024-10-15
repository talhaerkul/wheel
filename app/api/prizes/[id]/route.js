import db from "@/lib/db";

export async function DELETE(request, { params }) {
  const { id } = params;
  const stmt = db.prepare("DELETE FROM prizes WHERE id = ?");
  stmt.run(id);
  return new Response(null, { status: 204 });
}
