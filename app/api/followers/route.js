import db from "@/lib/db";
import axios from "axios";

const INSTAGRAM_API_URL = "https://graph.instagram.com/v12.0";
const INSTAGRAM_ACCESS_TOKEN =
  "EAAPQCmB9xWcBO9ZCA2Uy7ifd9h1Qya6NEZA4N5tKTOnH80HA5bSfpLaB7slLZAw2Fyd5kG66BR4GO91iyZCn8vOnZAeISPHQcr5RssPgPtrSmvQ4lk91VUO5kC62A8ZAl1ksWyTAYVFHqGORCM23AnAoDkV6GxkwO6VAOmcIXYZCkHGbjwosj6JGIZBEhuqNYRFXd5N60pnW";
const LINKEDIN_API_URL = "https://api.linkedin.com/v2";
const LINKEDIN_ACCESS_TOKEN =
  "AQXWaPoE8pVhj_OLDRDWSJH_f6BVRMvguvpzWi9abQidNtVIejEPCgq745m5DmDpuImebdHeSQRdAL3aJbSDu59NwCl5CWI2jEFyRhH9DQC-h93zle9Kogol6pVVxylVZxbDuYAeUqZDEtARzrwX3LYXcoRGlkGVIWN9Px-NVRGGrMStWhaHhfeZfsbvfjM4zQHjSdg5pWm7ixBZND8Xokh1Wz9VsPL1qQFzH-9-la-lm9o0IiDolMaJ2pSYQ0O00EWEn6NQ51FSkO2Z25c1atQNtakKL1jRtKg7y1ZXOVMOmT7r4a2-DolPXfIy5LOQN83tdhDGqxoZoPyUY57i2f84jgnihw";

export async function GET() {
  try {
    // Fetch Instagram followers
    const instagramFollowers = await fetchInstagramFollowers();

    // Fetch LinkedIn followers
    const linkedinFollowers = await fetchLinkedInFollowers();

    // Update Instagram followers table
    await updateInstagramFollowersTable(instagramFollowers);

    // Update LinkedIn followers table
    await updateLinkedInFollowersTable(linkedinFollowers);

    return new Response(
      JSON.stringify({
        instagramFollowed: instagramFollowers.length > 0,
        linkedinFollowed: linkedinFollowers.length > 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching followers:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch followers" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function fetchInstagramFollowers() {
  try {
    const response = await axios.get(`${INSTAGRAM_API_URL}/me/followers`, {
      params: {
        access_token: INSTAGRAM_ACCESS_TOKEN,
        fields: "id,username",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching Instagram followers:", error);
    throw error;
  }
}

async function fetchLinkedInFollowers() {
  try {
    const response = await axios.get(`${LINKEDIN_API_URL}/connections`, {
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    return response.data.elements;
  } catch (error) {
    console.error("Error fetching LinkedIn followers:", error);
    throw error;
  }
}

async function updateInstagramFollowersTable(followers) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO instagram_followers (id, username) VALUES (?, ?)"
  );
  const deleteStmt = db.prepare(
    "DELETE FROM instagram_followers WHERE id NOT IN (" +
      followers.map(() => "?").join(",") +
      ")"
  );

  db.transaction(() => {
    for (const follower of followers) {
      stmt.run(follower.id, follower.username);
    }
    deleteStmt.run(...followers.map((f) => f.id));
  })();
}

async function updateLinkedInFollowersTable(followers) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO linkedin_followers (id, firstName, lastName) VALUES (?, ?, ?)"
  );
  const deleteStmt = db.prepare(
    "DELETE FROM linkedin_followers WHERE id NOT IN (" +
      followers.map(() => "?").join(",") +
      ")"
  );

  db.transaction(() => {
    for (const follower of followers) {
      stmt.run(follower.id, follower.firstName, follower.lastName);
    }
    deleteStmt.run(...followers.map((f) => f.id));
  })();
}
