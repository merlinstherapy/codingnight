"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { searchExercises, sortByPhase, PHASE_LABEL, type LibraryExercise } from "@/lib/exercises";
import { saveRoutine } from "@/lib/db";

type Added = LibraryExercise & { sets: number; reps: number; hold: number };

export default function AddPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Added[]>([]);
  const [stage, setStage] = useState<"search" | "order">("search");
  const [saving, setSaving] = useState(false);

  const results = searchExercises(query);

  function add(e: LibraryExercise) {
    if (added.some((a) => a.id === e.id)) return;
    setAdded([...added, { ...e, sets: e.defaultSets, reps: e.defaultReps, hold: e.defaultHold }]);
  }
  function remove(id: string) { setAdded(added.filter((a) => a.id !== id)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= added.length) return;
    const next = [...added];
    [next[i], next[j]] = [next[j], next[i]];
    setAdded(next);
  }

  async function startSession() {
    setSaving(true);
    await saveRoutine({
      name: "My routine",
      exercises: added.map((a) => ({
        name: a.name, area: a.area, type: a.type, reps: a.reps,
        hold_seconds: a.hold, sets: a.sets, rest_seconds: a.defaultRest,
        cue: a.cue, phase: a.phase,
      })),
    });
    router.push("/checkin");
  }

  const metaOf = (a: Added) => (a.type === "hold" ? `hold ${a.hold}s × ${a.sets}` : `${a.sets} × ${a.reps}`);

  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        {stage === "search" ? (
          <>
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/home" style={{ textDecoration: "none", fontSize: 20, color: "#6f6a63" }}>‹</Link>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-.01em", flex: 1 }}>Add your exercises</div>
              <Link href="/import" style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700, textDecoration: "none" }}>📷 Snap</Link>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#6f6a63" }}>Type what&apos;s on your handout — we&apos;ll match it.</div>

            <div style={{ marginTop: 14, background: "#fff", border: "1.5px solid #1f7a6d", borderRadius: 14, padding: "3px 15px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, color: "#1f7a6d" }}>🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. glute bridge"
                autoFocus
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, padding: "11px 0", fontFamily: "inherit", background: "transparent", color: "#21201d" }}
              />
            </div>

            {/* results */}
            <div style={{ marginTop: 10, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 30px -18px rgba(20,30,40,.3)" }}>
              {results.length === 0 && (
                <div style={{ padding: "16px 14px", fontSize: 13, color: "#9a958c" }}>
                  No match — try another name, or <Link href="/import" style={{ color: "#1f7a6d", fontWeight: 700 }}>snap the handout</Link>.
                </div>
              )}
              {results.map((e, i) => {
                const isAdded = added.some((a) => a.id === e.id);
                return (
                  <div key={e.id} onClick={() => add(e)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderTop: i > 0 ? "1px solid #f0ede6" : "none", cursor: "pointer", background: isAdded ? "#e7f1ef" : "#fff" }}>
                    <div style={{ width: 52, height: 40, borderRadius: 9, flexShrink: 0, background: `repeating-linear-gradient(135deg,${isAdded ? "#cfe5e0" : "#efece5"} 0 8px,${isAdded ? "#dcede9" : "#f6f3ec"} 8px 16px)` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: isAdded ? 700 : 600, fontSize: 14 }}>{e.name}</div>
                      <div style={{ fontSize: 11.5, color: isAdded ? "#5f7d77" : "#9a958c" }}>
                        {e.area}{e.popular ? " · most prescribed" : ""}
                      </div>
                    </div>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: isAdded ? "#1f7a6d" : "#f3f1ec", color: isAdded ? "#fff" : "#6f6a63", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                      {isAdded ? "✓" : "+"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* added so far */}
            {added.length > 0 && (
              <>
                <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".07em", color: "#9a958c" }}>ADDED SO FAR · {added.length}</div>
                  <div style={{ fontSize: 12, color: "#9a958c" }}>tap ✕ to remove</div>
                </div>
                <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 8 }}>
                  {added.map((a) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 13, padding: "10px 12px" }}>
                      <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, background: "#f3f1ec", borderRadius: 8, padding: "5px 10px" }}>{metaOf(a)}</span>
                      <span onClick={() => remove(a.id)} style={{ color: "#c9c4ba", fontSize: 15, cursor: "pointer" }}>✕</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: "auto", paddingTop: 16, paddingBottom: 30 }}>
              <button
                onClick={() => { setAdded(sortByPhase(added)); setStage("order"); }}
                disabled={added.length === 0}
                style={{
                  width: "100%", background: added.length ? "#1f7a6d" : "#c9c4ba", color: "#fff",
                  padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, border: "none",
                  cursor: added.length ? "pointer" : "default", fontFamily: "inherit",
                  boxShadow: added.length ? "0 12px 24px -10px rgba(31,122,109,.6)" : "none",
                }}
              >
                Next — order my flow →
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── ORDER STAGE ── */}
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
              <span onClick={() => setStage("search")} style={{ fontSize: 20, color: "#6f6a63", cursor: "pointer" }}>‹</span>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-.01em", flex: 1 }}>Your flow</div>
              <span onClick={() => setAdded(sortByPhase(added))} style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700, cursor: "pointer" }}>↻ Reset order</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#6f6a63", lineHeight: 1.5 }}>
              Mend ordered these for recovery — <b>warm-up → activate → stabilize → cool-down</b>. Use ↑↓ to make it yours.
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
              {added.map((a, i) => {
                const p = PHASE_LABEL[a.phase];
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "12px 13px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span onClick={() => move(i, -1)} style={{ cursor: "pointer", color: i === 0 ? "#e3e0d8" : "#6f6a63", fontSize: 13, lineHeight: 1 }}>▲</span>
                      <span onClick={() => move(i, 1)} style={{ cursor: "pointer", color: i === added.length - 1 ? "#e3e0d8" : "#6f6a63", fontSize: 13, lineHeight: 1 }}>▼</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9a958c" }}>{metaOf(a)}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".06em", background: p.bg, color: p.color, padding: "4px 9px", borderRadius: 7 }}>{p.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, background: "#e7f1ef", borderRadius: 13, padding: "11px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <div style={{ fontSize: 12, color: "#2f4641", lineHeight: 1.45 }}>
                Moving an exercise before warm-up? We&apos;ll gently suggest warming up first — but it&apos;s your call. Your order is saved.
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: 16, paddingBottom: 30 }}>
              <button
                onClick={startSession}
                disabled={saving}
                style={{
                  width: "100%", background: "#1f7a6d", color: "#fff", padding: 16, borderRadius: 15,
                  fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit",
                  opacity: saving ? 0.6 : 1, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)",
                }}
              >
                {saving ? "Saving…" : `▶ Start session · ~${Math.max(2, Math.round(added.reduce((t, a) => t + a.sets, 0) * 1.2))} min`}
              </button>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
