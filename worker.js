// worker.js
// The whole server. Read it before you deploy it.
//
// Cloudflare calls fetch() with every request that reaches the workers.dev URL
// and sends back whatever Response is returned.
//
// Four things to recognize here:
//   env.DB      the D1 binding from wrangler.toml (no connection string, nothing to leak)
//   bind(?)     the user's value goes in as a parameter, never pasted into the SQL
//   status 400  the EARS "unwanted behavior" row, executable
//   CORS        headers telling the browser this page is allowed to call this Worker

// Session B uses "*" so every page works on the first try.
// HW4 Craft credit: narrow this to the page's own origin once it is deployed.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

// The server enforces the same rule the page does, because a user can POST
// straight to this URL and never load the page at all. FEATURES.md E12 is a
// statement about the system, not about the form.
const REQUIRED_FIELDS = [
  { key: "coachName", label: "Coach name" },
  { key: "school", label: "School" },
  { key: "contactDate", label: "Date contacted" },
  { key: "status", label: "Status" },
];
const MAX_FIELD_LENGTH = 200;

export default {
  async fetch(request, env) {
    // Anything that throws below becomes a readable 500 instead of a bare
    // "Error 1101: Worker threw exception". The message names the cause,
    // which is what the verification table needs.
    try {
      return await handle(request, env);
    } catch (err) {
      return new Response("server error: " + err.message, { status: 500, headers: CORS });
    }
  },
};

async function handle(request, env) {
  const url = new URL(request.url);

  // Browsers send an OPTIONS "preflight" before a JSON POST from another
  // origin. Answer it with the CORS headers and nothing else.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // The most common deploy failure: the D1 binding did not attach because
  // wrangler.toml still says PASTE_ID_HERE or the id was pasted badly.
  if (!env.DB) {
    return new Response(
      "server error: no D1 binding. Check database_id in wrangler.toml and redeploy.",
      { status: 500, headers: CORS });
  }

  if (request.method === "GET" && url.pathname === "/entries") {
    // The AS aliases hand the page the same camelCase keys it used when the
    // data came from localStorage, so renderContactLog needed no changes.
    const { results } = await env.DB.prepare(
      `SELECT id,
              coach_name   AS coachName,
              school       AS school,
              contact_date AS contactDate,
              status       AS status
         FROM entries
        ORDER BY id`).all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST" && url.pathname === "/entries") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("body must be JSON", { status: 400, headers: CORS });
    }

    // Traces to FEATURES.md E12: IF a required field is empty when the entry is
    // submitted, THEN THE SYSTEM SHALL reject the entry and name the field that
    // is missing. Naming the field is the part that makes the 400 useful.
    const problem = findFieldProblem(body);
    if (problem !== null) {
      return new Response(problem, { status: 400, headers: CORS });
    }

    // ===================================================================
    // INSERT the validated contact entry into the database.
    // Values are mapped from camelCase request fields to the snake_case schema.
    // ===================================================================
    await env.DB.prepare(
      `INSERT INTO entries (coach_name, school, contact_date, status)
       VALUES (?, ?, ?, ?)`
    ).bind(
      body.coachName,
      body.school,
      body.contactDate,
      body.status
    ).run();

    return new Response(null, { status: 201, headers: CORS });
  }

  return new Response("not found", { status: 404, headers: CORS });
}

function findFieldProblem(body) {
  for (const field of REQUIRED_FIELDS) {
    const value = body[field.key];
    if (typeof value !== "string" || value.trim() === "") {
      return `${field.label} is required.`;
    }
  }
  for (const field of REQUIRED_FIELDS) {
    if (body[field.key].length > MAX_FIELD_LENGTH) {
      return `${field.label} must be ${MAX_FIELD_LENGTH} characters or fewer.`;
    }
  }
  return null;
}
