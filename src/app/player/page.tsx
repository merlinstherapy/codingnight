"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";
import { beep, chime, fanfare, speak, stopSpeaking } from "@/lib/audio";
import { saveSession } from "@/lib/db";

type Exercise = {
  name: string;
  area: string;
  type: "reps" | "hold";
  reps: number;
  hold?: number;
  sets: number;
  rest: number;
  cue: string;
};

const EXERCISES: Exercise[] = [
  { name: "Cat–Cow",        area: "Spine mobility", type: "reps", reps: 10, sets: 1, rest: 15, cue: "Move slowly with your breath — round and arch one vertebra at a time." },
  { name: "Pelvic Tilt",    area: "Core · lumbar",  type: "reps", reps: 12, sets: 2, rest: 20, cue: "Flatten your lower back gently into the floor. Small, controlled motion." },
  { name: "Glute Bridge",   area: "Glutes",         type: "reps", reps: 12, sets: 3, rest: 45, cue: "Squeeze your glutes at the top and keep ribs down — don't arch your lower back." },
  { name: "Bird Dog",       area: "Core stability", type: "reps", reps: 10, sets: 3, rest: 40, cue: "Reach opposite arm and leg long. Keep hips level — no rotation." },
  { name: "McGill Curl-up", area: "Deep core",      type: "reps", reps:  8, sets: 2, rest: 30, cue: "Hands under your lower back. Lift head and shoulders just slightly." },
  { name: "Child's Pose",   area: "Cool-down",      type: "hold", reps:  0, hold: 40, sets: 2, rest: 15, cue: "Sink your hips back and breathe into your lower back. Let tension go." },
];

type Phase = "exercise" | "rest" | "done";

interface SessionState {
  idx: number;
  set: number;
  repsDone: number;
  holdLeft: number;
  phase: Phase;
  restLeft: number;
  playing: boolean;
  _after?: "nextset" | "nextex";
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return m + ":" + String(r).padStart(2, "0");
}

export default function PlayerPage() {
  const [mode, setMode] = useState<"focus" | "coach">("coach");
  const [subtick, setSubtick] = useState(0);
  const [s, setS] = useState<SessionState>({
    idx: 2, set: 2, repsDone: 5, holdLeft: 0,
    phase: "exercise", restLeft: 0, playing: false,
  });

  const resetEx = useCallback((state: SessionState) => {
    const ex = EXERCISES[state.idx];
    state.holdLeft = ex.type === "hold" ? (ex.hold ?? 0) : 0;
  }, []);

  const completeSet = useCallback((state: SessionState) => {
    const ex = EXERCISES[state.idx];
    if (state.set < ex.sets) {
      state.phase = "rest"; state.restLeft = ex.rest; state._after = "nextset";
    } else if (state.idx < EXERCISES.length - 1) {
      state.phase = "rest"; state.restLeft = ex.rest > 0 ? ex.rest : 20; state._after = "nextex";
    } else {
      state.phase = "done"; state.playing = false;
    }
  }, []);

  const startNext = useCallback((state: SessionState) => {
    if (state._after === "nextset") {
      state.set += 1; state.repsDone = 0; state.phase = "exercise"; resetEx(state);
    } else {
      state.idx += 1; state.set = 1; state.repsDone = 0; state.phase = "exercise"; resetEx(state);
    }
  }, [resetEx]);

  useEffect(() => {
    const id = setInterval(() => {
      setSubtick((prev) => {
        const next = prev + 1;
        setS((ps) => {
          if (!ps.playing || ps.phase === "done") return ps;
          const ns = { ...ps };
          const ex = EXERCISES[ns.idx];
          if (ns.phase === "rest") {
            ns.restLeft -= 1;
            if (ns.restLeft <= 0) startNext(ns);
            return ns;
          }
          if (ex.type === "hold") {
            ns.holdLeft -= 1;
            if (ns.holdLeft <= 0) completeSet(ns);
          } else {
            if (next % 2 === 0) {
              ns.repsDone += 1;
              if (ns.repsDone >= ex.reps) completeSet(ns);
            }
          }
          return ns;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [startNext, completeSet]);

  const toggle = () => setS((p) => {
    const starting = !p.playing;
    if (starting && p.phase === "exercise") {
      const ex = EXERCISES[p.idx];
      speak(`${ex.name}. Set ${p.set} of ${ex.sets}. ${ex.cue}`);
    }
    if (!starting) stopSpeaking();
    return { ...p, playing: starting, phase: p.phase === "done" ? "exercise" : p.phase };
  });

  // ── Audio guidance: react to state transitions ──
  const prevRef = useRef(s);
  useEffect(() => {
    const p = prevRef.current;
    prevRef.current = s;
    if (p === s) return;

    // Set/exercise finished → rest begins
    if (p.phase === "exercise" && s.phase === "rest") {
      chime();
      speak(`Done. Rest ${s.restLeft} seconds.`);
    }
    // Rest counting down: tick the last 3 seconds
    if (s.phase === "rest" && s.playing && s.restLeft !== p.restLeft && s.restLeft > 0 && s.restLeft <= 3) {
      beep();
    }
    // Hold exercises: tick the last 3 seconds of the hold
    if (s.phase === "exercise" && s.playing && s.holdLeft !== p.holdLeft && s.holdLeft > 0 && s.holdLeft <= 3) {
      beep();
    }
    // Rest over → next set/exercise begins
    if (p.phase === "rest" && s.phase === "exercise") {
      const ex = EXERCISES[s.idx];
      chime();
      speak(`${ex.name}. Set ${s.set} of ${ex.sets}. ${ex.cue}`);
    }
    // Session complete
    if (p.phase !== "done" && s.phase === "done") {
      fanfare();
      speak("Session complete. Nice work.");
      saveSession({ exercisesCompleted: EXERCISES.length, totalExercises: EXERCISES.length });
    }
  }, [s]);

  // Stop narration when leaving the page
  useEffect(() => () => stopSpeaking(), []);

  const countRep = () => setS((p) => {
    const ns = { ...p };
    const ex = EXERCISES[ns.idx];
    if (ex.type !== "reps" || ns.phase !== "exercise") return p;
    ns.repsDone += 1;
    if (ns.repsDone >= ex.reps) completeSet(ns);
    return ns;
  });
  const skip = () => setS((p) => {
    const ns = { ...p };
    if (ns.idx < EXERCISES.length - 1) {
      ns.idx += 1; ns.set = 1; ns.repsDone = 0; ns.phase = "exercise"; resetEx(ns);
    } else { ns.phase = "done"; ns.playing = false; }
    return ns;
  });
  const prev = () => setS((p) => {
    const ns = { ...p };
    if (ns.idx > 0) ns.idx -= 1;
    ns.set = 1; ns.repsDone = 0; ns.phase = "exercise"; ns.restLeft = 0; resetEx(ns);
    return ns;
  });

  const cur = EXERCISES[s.idx] ?? EXERCISES[0];
  const next = EXERCISES[s.idx + 1];
  const isRest = s.phase === "rest";
  const isDone = s.phase === "done";
  const isHold = cur.type === "hold" && !isRest && !isDone;

  let bigNumber: string | number, bigUnit: string, subLine: string;
  if (isDone) { bigNumber = "✓"; bigUnit = "COMPLETE"; subLine = "Nice work — session done"; }
  else if (isRest) { bigNumber = fmt(s.restLeft); bigUnit = "REST"; subLine = "Up next: " + (next?.name ?? cur.name); }
  else if (isHold) { bigNumber = s.holdLeft; bigUnit = "SECONDS"; subLine = "Hold steady, breathe"; }
  else { bigNumber = s.repsDone; bigUnit = "REPS"; subLine = s.repsDone + " of " + cur.reps + " reps"; }

  const dots = cur.type === "reps"
    ? Array.from({ length: cur.reps }, (_, i) => ({ bg: i < s.repsDone ? "#1f7a6d" : "#d9d5cc" }))
    : [];

  const segs = EXERCISES.map((_, i) => ({
    c: i < s.idx ? "#1f7a6d" : i === s.idx ? "#34d0bb" : "rgba(255,255,255,.16)",
  }));

  const totalSets = EXERCISES.reduce((a, e) => a + e.sets, 0);
  let doneSets = 0;
  for (let i = 0; i < s.idx; i++) doneSets += EXERCISES[i].sets;
  doneSets += s.set - 1;
  const pct = isDone ? 100 : Math.min(100, Math.round((doneSets / totalSets) * 100));
  const minsLeft = isDone ? 0 : Math.max(1, Math.round((totalSets - doneSets) * 0.8));

  return (
    <div style={{ position: "relative" }}>
      {/* mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
        {(["focus", "coach"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "6px 18px",
              borderRadius: 20,
              border: "none",
              background: mode === m ? "#1f7a6d" : "#e9e7e1",
              color: mode === m ? "#fff" : "#6f6a63",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {m === "focus" ? "Focus" : "Coach"}
          </button>
        ))}
      </div>

      {mode === "focus" ? (
        /* ── FOCUS (dark) ── */
        <PhoneShell dark>
          <div style={{ position: "absolute", inset: "52px 0 0", display: "flex", flexDirection: "column", padding: "8px 22px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="font-mono-custom" style={{ fontSize: 11, letterSpacing: ".06em", color: "#7fa39d" }}>
                EXERCISE {s.idx + 1} / {EXERCISES.length}
              </span>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.3)", color: "#cfe9e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✕</span>
              </Link>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 5 }}>
              {segs.map((seg, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: seg.c }} />)}
            </div>

            {/* video area */}
            <div style={{ flex: 1, marginTop: 16, borderRadius: 22, position: "relative", overflow: "hidden", background: "repeating-linear-gradient(135deg,#10302f 0 13px,#0c2625 13px 26px)", minHeight: 230 }}>
              <div className="anim-glow" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 30%,rgba(52,208,187,.22),transparent 70%)" }} />
              <div className="font-mono-custom" style={{ position: "absolute", left: 0, right: 0, top: "46%", textAlign: "center", color: "rgba(127,224,207,.5)", fontSize: 12, letterSpacing: ".12em" }}>
                DEMO LOOP · {cur.name.toUpperCase()}
              </div>
              <div style={{ position: "absolute", left: 16, bottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
                <span className="anim-pulse-fast" style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5a5a" }} />
                <span className="font-mono-custom" style={{ fontSize: 11, color: "#9fc4bd" }}>loop · 0:08</span>
              </div>
            </div>

            <div style={{ marginTop: 18, textAlign: "center" }}>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 26, letterSpacing: "-.02em", color: "#f1f9f6" }}>{cur.name}</div>
              <div style={{ fontSize: 12.5, color: "#7fa39d", marginTop: 3 }}>{cur.area} · Set {s.set} of {cur.sets}</div>
            </div>

            <div style={{ marginTop: 14, textAlign: "center", lineHeight: .9 }}>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 88, color: "#34d0bb", fontVariantNumeric: "tabular-nums", letterSpacing: "-.03em" }}>
                {bigNumber}
              </div>
              <div className="font-mono-custom" style={{ marginTop: 4, fontSize: 12, letterSpacing: ".18em", color: "#7fa39d" }}>{bigUnit}</div>
              <div style={{ marginTop: 6, fontSize: 12.5, color: "#9fc4bd" }}>{subLine}</div>
            </div>

            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 26, paddingTop: 14 }}>
              <button onClick={prev} style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.28)", color: "#cfe9e3", background: "transparent", fontSize: 17, cursor: "pointer" }}>⏮</button>
              <button onClick={toggle} style={{ width: 78, height: 78, borderRadius: "50%", background: "#34d0bb", color: "#06352f", fontSize: 26, fontWeight: 800, cursor: "pointer", border: "none", boxShadow: "0 12px 28px -8px rgba(52,208,187,.65)" }}>{s.playing ? "❚❚" : "▶"}</button>
              <button onClick={skip} style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.28)", color: "#cfe9e3", background: "transparent", fontSize: 17, cursor: "pointer" }}>⏭</button>
            </div>
            <div className="font-mono-custom" style={{ textAlign: "center", marginTop: 14, fontSize: 11, letterSpacing: ".06em", color: "#5f7d77" }}>
              NEXT — {next?.name ?? "Finish"}
            </div>
          </div>
        </PhoneShell>
      ) : (
        /* ── COACH (light) ── */
        <PhoneShell>
          <div style={{ position: "absolute", inset: "52px 0 0", padding: "8px 20px 18px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/" style={{ textDecoration: "none", color: "#6f6a63", fontSize: 20 }}>‹</Link>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Lower Back Recovery</div>
                <div style={{ height: 6, borderRadius: 3, background: "#e6e2da", marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: "#1f7a6d", borderRadius: 3 }} />
                </div>
              </div>
              <span className="font-mono-custom" style={{ fontSize: 11, color: "#9a958c" }}>
                {isDone ? "done" : "~" + minsLeft + " min"}
              </span>
            </div>

            {/* video */}
            <div style={{ marginTop: 14, height: 188, borderRadius: 18, position: "relative", overflow: "hidden", background: "repeating-linear-gradient(135deg,#e7f1ef 0 13px,#f0f6f4 13px 26px)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 80% at 50% 35%,rgba(31,122,109,.14),transparent 70%)" }} />
              <span style={{ position: "absolute", top: 12, right: 12, background: "#123a4f", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: ".05em", padding: "4px 8px", borderRadius: 8 }}>FORM VIEW</span>
              <span className="font-mono-custom" style={{ position: "absolute", left: 0, right: 0, top: "46%", textAlign: "center", color: "rgba(31,122,109,.45)", fontSize: 12, letterSpacing: ".1em" }}>DEMO LOOP</span>
              <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <span className="anim-pulse-fast" style={{ width: 7, height: 7, borderRadius: "50%", background: "#1f7a6d" }} />
                <span className="font-mono-custom" style={{ fontSize: 11, color: "#5f7d77" }}>loop · 0:08</span>
              </div>
            </div>

            <div style={{ marginTop: 15, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 23, letterSpacing: "-.02em" }}>{cur.name}</div>
                <div style={{ fontSize: 12.5, color: "#9a958c", marginTop: 2 }}>{cur.area}</div>
              </div>
              <span style={{ background: "#e7f1ef", color: "#155e54", fontSize: 12, fontWeight: 700, padding: "6px 11px", borderRadius: 10, whiteSpace: "nowrap" }}>
                Set {s.set} of {cur.sets}
              </span>
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
              {dots.map((d, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: d.bg }} />)}
              <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13, color: "#1f7a6d" }}>{s.repsDone} / {cur.reps}</span>
            </div>

            {/* form cue */}
            <div style={{ marginTop: 14, background: "#e7f1ef", borderRadius: 14, padding: "12px 13px", display: "flex", gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1f7a6d", color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>!</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", color: "#155e54" }}>FORM CUE</div>
                <div style={{ fontSize: 12.5, color: "#2f4641", lineHeight: 1.4, marginTop: 3 }}>{cur.cue}</div>
              </div>
            </div>

            {/* up next */}
            {next && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "10px 12px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "repeating-linear-gradient(45deg,#efece5 0 6px,#f6f3ec 6px 12px)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".07em", color: "#9a958c" }}>UP NEXT</div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 1 }}>{next.name}</div>
                </div>
                <div style={{ fontSize: 12, color: "#6f6a63", fontWeight: 600 }}>
                  {next.type === "hold" ? `Hold ${next.hold}s` : `${next.sets} × ${next.reps}`}
                </div>
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
                <button onClick={prev} style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", border: "1px solid #e3e0d8", fontSize: 16, color: "#6f6a63", cursor: "pointer" }}>⏮</button>
                <button onClick={toggle} style={{ width: 66, height: 66, borderRadius: "50%", background: "#1f7a6d", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer", border: "none", boxShadow: "0 12px 24px -8px rgba(31,122,109,.7)" }}>{s.playing ? "❚❚" : "▶"}</button>
                <button onClick={skip} style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", border: "1px solid #e3e0d8", fontSize: 16, color: "#6f6a63", cursor: "pointer" }}>⏭</button>
              </div>
              <button
                onClick={countRep}
                style={{ marginTop: 12, width: "100%", textAlign: "center", background: "#123a4f", color: "#fff", padding: 13, borderRadius: 13, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", fontFamily: "inherit" }}
              >
                Count rep +1
              </button>
            </div>
          </div>
        </PhoneShell>
      )}
    </div>
  );
}
