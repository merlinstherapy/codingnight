import { supabase } from "./supabase";

/** All helpers fail soft: if the user isn't logged in or the network
 *  drops, the app keeps working in demo mode and we just log a warning. */

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function saveCheckin(input: {
  painLevel: number;          // 0–10
  tensionAreas: string[];
  stiffness: string;          // none | mild | moderate | high
}) {
  const user = await getUser();
  if (!user) return { saved: false, reason: "not-logged-in" };
  const { error } = await supabase.from("checkins").upsert(
    {
      user_id: user.id,
      checkin_date: new Date().toISOString().slice(0, 10),
      pain_level: input.painLevel,
      tension_areas: input.tensionAreas,
      stiffness: input.stiffness,
    },
    { onConflict: "user_id,checkin_date" }
  );
  if (error) {
    console.warn("saveCheckin failed:", error.message);
    return { saved: false, reason: error.message };
  }
  return { saved: true };
}

export async function saveSession(input: {
  exercisesCompleted: number;
  totalExercises: number;
}) {
  const user = await getUser();
  if (!user) return { saved: false, reason: "not-logged-in" };
  const { error } = await supabase.from("sessions").insert({
    user_id: user.id,
    completed_at: new Date().toISOString(),
    exercises_completed: input.exercisesCompleted,
    total_exercises: input.totalExercises,
  });
  if (error) {
    console.warn("saveSession failed:", error.message);
    return { saved: false, reason: error.message };
  }
  return { saved: true };
}

export async function getRecentCheckins(days = 14) {
  const user = await getUser();
  if (!user) return [];
  const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("checkins")
    .select("checkin_date, pain_level, stiffness")
    .gte("checkin_date", since)
    .order("checkin_date", { ascending: true });
  if (error) { console.warn(error.message); return []; }
  return data ?? [];
}

export async function getRecentSessions(days = 14) {
  const user = await getUser();
  if (!user) return [];
  const since = new Date(Date.now() - days * 86400_000).toISOString();
  const { data, error } = await supabase
    .from("sessions")
    .select("completed_at, exercises_completed, total_exercises")
    .gte("completed_at", since)
    .order("completed_at", { ascending: true });
  if (error) { console.warn(error.message); return []; }
  return data ?? [];
}
