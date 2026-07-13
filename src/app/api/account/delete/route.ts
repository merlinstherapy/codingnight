import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** POST /api/account/delete
 *  Authorization: Bearer <user access token>
 *  Verifies the caller's identity from their own token, then deletes the
 *  auth user. All app rows (profile, routines, exercises, checkins,
 *  sessions) cascade via foreign keys. */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Resolve the user from THEIR token — callers can only ever delete themselves.
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(userData.user.id);
  if (delErr) {
    console.error("deleteUser failed:", delErr.message);
    return NextResponse.json({ error: "Delete failed — try again" }, { status: 500 });
  }
  return NextResponse.json({ deleted: true });
}
