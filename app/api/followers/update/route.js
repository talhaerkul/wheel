import db from "@/lib/db";

export async function POST() {
  // This is a mock implementation. In a real-world scenario, you'd need to
  // integrate with Instagram and LinkedIn APIs to check the follow status.
  const users = db.prepare("SELECT * FROM users").all();

  for (const user of users) {
    const instagramFollowed = Math.random() < 0.5;
    const linkedinFollowed = Math.random() < 0.5;

    db.prepare(
      "UPDATE users SET instaFollow = ?, linkedinFollow = ? WHERE id = ?"
    ).run(instagramFollowed ? 1 : 0, linkedinFollowed ? 1 : 0, user.id);

    if (instagramFollowed) {
      db.prepare(
        "INSERT OR IGNORE INTO instagram_followers (user_id) VALUES (?)"
      ).run(user.id);
    } else {
      db.prepare("DELETE FROM instagram_followers WHERE user_id = ?").run(
        user.id
      );
    }

    if (linkedinFollowed) {
      db.prepare(
        "INSERT OR IGNORE INTO linkedin_followers (user_id) VALUES (?)"
      ).run(user.id);
    } else {
      db.prepare("DELETE FROM linkedin_followers WHERE user_id = ?").run(
        user.id
      );
    }
  }

  return new Response(null, { status: 204 });
}
