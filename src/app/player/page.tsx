"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import VideoSlot from "@/components/VideoSlot";
import { beep, chime, fanfare, speak, stopSpeaking, setVolume } from "@/lib/audio";
import { saveSession, noteLatestSession } from "@/lib/db";

type Exercise = {
  name: string; area: string; type: "reps" | "hold";
  reps: number; hold?: number; sets: number; rest: number; cue: string;
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
interface S {
  idx: number; set: number; repsDone: number; holdLeft: number;
  phase: Phase; restLeft: number; playing: boolean; _after?: "nextset" | "nextex";
}
type AudioPrefs = { narration: boolean; beeps: boolean; chime: boolean; volume: number };

const DEFAULT_PREFS: AudioPrefs = { narration: true, beeps: true, chime: true, volume: 0.7 };

function fmt(sec: number) {
  const m = Math.floor(sec / 60), r = sec % 60;
  return m + ":" + String(r).padStart(2, "0");
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ width: 50, height: 30, borderRadius: 16, background: on ? "#1f7a6d" : "#e3e0d8", position: "relative", flexShrink: 0, cursor: "pointer", transition: "background .15s" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,.2)", transition: "left .15s" }} />
    </div>
  );
}

export default function PlayerPage() {
  const router = useRouter();
  const [subtick, setSubtick] = useState(0);
  const [showAudioSheet, setShowAudioSheet] = useState(false);
  const [feel, setFeel] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<AudioPrefs>(DEFAULT_PREFS);
  const [s, setS] = useState<S>({ idx: 0, set: 1, repsDone: 0, holdLeft: 0, phase: "exercise", restLeft: 0, playing: false });

  // load / persist audio prefs
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mend_audio");
      if (raw) { const p = { ...DEFAULT_PREFS, ...JSON.parse(raw) }; setPrefs(p); setVolume(p.volume); }
    } catch { /* defaults */ }
  }, []);
  function updatePrefs(patch: Partial<AudioPrefs>) {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try { localStorage.setItem("mend_audio", JSON.stringify(next)); } catch { /* ignore */ }
      setVolume(next.volume);
      return next;
    });
  }

  const resetEx = useCallback((st: S) => {
    const ex = EXERCISES[st.idx];
    st.holdLeft = ex.type === "hold" ? (ex.hold ?? 0) : 0;
  }, []);

  const completeSet = useCallback((st: S) => {
    const ex = EXERCISES[st.idx];
    if (st.set < ex.sets) { st.phase = "rest"; st.restLeft = ex.rest; st._after = "nextset"; }
    else if (st.idx < EXERCISES.length - 1) { st.phase = "rest"; st.restLeft = ex.rest > 0 ? ex.rest : 20; st._after = "nextex"; }
    else { st.phase = "done"; st.playing = false; }
  }, []);

  const startNext = useCallback((st: S) => {
    if (st._after === "nextset") { st.set += 1; }
    else { st.idx += 1; st.set = 1; }
    st.repsDone = 0; st.phase = "exercise"; resetEx(st);
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
          } else if (next % 2 === 0) {
            ns.repsDone += 1;
            if (ns.repsDone >= ex.reps) completeSet(ns);
          }
          return ns;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [startNext, completeSet]);

  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // audio transitions
  const prevRef = useRef(s);
  useEffect(() => {
    const p = prevRef.current;
    prevRef.current = s;
    if (p === s) return;
    const pr = prefsRef.current;
    if (p.phase === "exercise" && s.phase === "rest") {
      if (pr.chime) chime();
      if (pr.narration) speak(`Done. Rest ${s.restLeft} seconds.`);
    }
    if (s.phase === "rest" && s.playing && s.restLeft !== p.restLeft && s.restLeft > 0 && s.restLeft <= 3 && pr.beeps) beep();
    if (s.phase === "exercise" && s.playing && s.holdLeft !== p.holdLeft && s.holdLeft > 0 && s.holdLeft <= 3 && pr.beeps) beep();
    if (p.phase === "rest" && s.phase === "exercise") {
      const ex = EXERCISES[s.idx];
      if (pr.chime) chime();
      if (pr.narration) speak(`${ex.name}. Set ${s.set} of ${ex.sets}. ${ex.cue}`);
    }
    if (p.phase !== "done" && s.phase === "done") {
      fanfare();
      if (pr.narration) speak("Session complete. Nice work.");
      saveSession({ exercisesCompleted: EXERCISES.length, totalExercises: EXERCISES.length });
    }
  }, [s]);

  useEffect(() => () => stopSpeaking(), []);

  const toggle = () => setS((p) => {
    const starting = !p.playing;
    if (starting && p.phase === "exercise" && prefsRef.current.narration) {
      const ex = EXERCISES[p.idx];
      speak(`${ex.name}. Set ${p.set} of ${ex.sets}. ${ex.cue}`);
    }
    if (!starting) stopSpeaking();
    return { ...p, playing: starting, phase: p.phase === "done" ? "exercise" : p.phase };
  });
  const countRep = () => setS((p) => {
    const ns = { ...p }; const ex = EXERCISES[ns.idx];
    if (ex.type !== "reps" || ns.phase !== "exercise") return p;
    ns.repsDone += 1;
    if (ns.repsDone >= ex.reps) completeSet(ns);
    return ns;
  });
  const skip = () => setS((p) => {
    const ns = { ...p };
    if (ns.idx < EXERCISES.length - 1) { ns.idx += 1; ns.set = 1; ns.repsDone = 0; ns.phase = "exercise"; resetEx(ns); }
    else { ns.phase = "done"; ns.playing = false; }
    return ns;
  });
  const prev = () => setS((p) => {
    const ns = { ...p };
    if (ns.idx > 0) ns.idx -= 1;
    ns.set = 1; ns.repsDone = 0; ns.phase = "exercise"; ns.restLeft = 0; resetEx(ns);
    return ns;
  });
  const skipRest = () => setS((p) => {
    if (p.phase !== "rest") return p;
    const ns = { ...p };
    startNext(ns);
    return ns;
  });

  const cur = EXERCISES[s.idx] ?? EXERCISES[0];
  const next = EXERCISES[s.idx + 1];
  const isRest = s.phase === "rest";
  const isDone = s.phase === "done";
  const isHold = cur.type === "hold" && !isRest && !isDone;

  const totalSets = EXERCISES.reduce((a, e) => a + e.sets, 0);
  let doneSets = 0;
  for (let i = 0; i < s.idx; i++) doneSets += EXERCISES[i].sets;
  doneSets += s.set - 1;
  const pct = isDone ? 100 : Math.min(100, Math.round((doneSets / totalSets) * 100));
  const minsLeft = isDone ? 0 : Math.max(1, Math.round((totalSets - doneSets) * 0.8));
  const dots = cur.type === "reps" ? Array.from({ length: cur.reps }, (_, i) => i < s.repsDone) : [];
  const segs = EXERCISES.map((_, i) => (i < s.idx ? "#1f7a6d" : i === s.idx ? "#34d0bb" : "rgba(255,255,255,.16)"));

  function finish() {
    if (feel) noteLatestSession(feel); // fire-and-forget; fails soft for guests
    router.push("/progress");
  }

  /* ── SESSION COMPLETE ── */
  if (isDone) {
    return (
      <Shell dark>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 26px", background: "#123a4f", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,208,187,.28),transparent 70%)" }} />
          <div style={{ marginTop: 70, textAlign: "center", position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#34d0bb", color: "#06352f", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800, boxShadow: "0 18px 40px -12px rgba(52,208,187,.6)" }}>✓</div>
            <div className="font-display" style={{ marginTop: 22, fontWeight: 800, fontSize: 32, letterSpacing: "-.02em", color: "#fff" }}>Session complete</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#a9c7c1" }}>Lower Back Recovery · all {EXERCISES.length} exercises</div>
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 11, position: "relative" }}>
            {[["🔥", "streak"], [String(totalSets), "sets done"], ["✓", "today"]].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 14, textAlign: "center" }}>
                <div className="font-display" style={{ fontWeight: 800, fontSize: 26, color: "#7fe0cf" }}>{v}</div>
                <div style={{ fontSize: 11.5, color: "#a9c7c1", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, background: "#fff", borderRadius: 20, padding: 18, position: "relative" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#21201d" }}>How did that feel?</div>
            <div style={{ fontSize: 12, color: "#9a958c", marginTop: 2 }}>This feeds your pain trend — 2 seconds, big payoff.</div>
            <div style={{ marginTop: 14, display: "flex", gap: 9 }}>
              {[["better", "Better", "😌"], ["same", "Same", "😐"], ["worse", "Worse", "😣"]].map(([key, label, emoji]) => {
                const sel = feel === label;
                return (
                  <div key={key} onClick={() => setFeel(label)} style={{ flex: 1, textAlign: "center", background: sel ? "#e7f1ef" : "#f6f5f2", border: sel ? "1.5px solid #1f7a6d" : "1px solid #e3e0d8", borderRadius: 13, padding: "12px 6px", cursor: "pointer" }}>
                    <div style={{ fontSize: 20 }}>{emoji}</div>
                    <div style={{ fontSize: 11.5, fontWeight: sel ? 700 : 600, color: sel ? "#155e54" : "#6f6a63", marginTop: 4 }}>{label}</div>
                  </div>
                );
              })}
            </div>
            {feel === "Worse" && (
              <div style={{ marginTop: 11, fontSize: 11.5, color: "#9a958c", lineHeight: 1.45 }}>Tomorrow&apos;s plan will ease off automatically.</div>
            )}
          </div>
          <div style={{ marginTop: "auto", paddingBottom: 36, position: "relative" }}>
            <button onClick={finish} style={{ width: "100%", background: "#34d0bb", color: "#06352f", textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 800, fontSize: 15.5, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Done</button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ── REST SCREEN ── */
  if (isRest) {
    return (
      <Shell dark>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 26px" }}>
          <div style={{ marginTop: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="font-mono-custom" style={{ fontSize: 11, letterSpacing: ".06em", color: "#7fa39d" }}>
              REST · NEXT {Math.min(s.idx + (s._after === "nextex" ? 2 : 1), EXERCISES.length)} / {EXERCISES.length}
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <span onClick={() => setShowAudioSheet(true)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.3)", color: "#cfe9e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer" }}>🔊</span>
              <Link href="/home" style={{ textDecoration: "none" }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.3)", color: "#cfe9e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✕</span>
              </Link>
            </div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
            {segs.map((c, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: c }} />)}
          </div>
          <div style={{ marginTop: 56, textAlign: "center" }}>
            <div className="font-mono-custom" style={{ fontSize: 12, letterSpacing: ".2em", color: "#7fa39d" }}>BREATHE · REST</div>
            <div className="font-display" style={{ marginTop: 8, fontWeight: 800, fontSize: 110, lineHeight: 1, color: "#f1f9f6", fontVariantNumeric: "tabular-nums", letterSpacing: "-.03em" }}>{fmt(s.restLeft)}</div>
            <div style={{ marginTop: 12, fontSize: 13, color: "#9fc4bd" }}>Beeps count down the last 3 seconds — no need to watch.</div>
          </div>
          {(s._after === "nextex" ? next : cur) && (
            <div style={{ marginTop: 40, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 96, height: 72, borderRadius: 12, flexShrink: 0, position: "relative", overflow: "hidden", background: "repeating-linear-gradient(135deg,#10302f 0 10px,#0c2625 10px 20px)" }}>
                <span className="font-mono-custom" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, letterSpacing: ".1em", color: "rgba(127,224,207,.5)" }}>4:3 LOOP</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="font-mono-custom" style={{ fontSize: 10, letterSpacing: ".14em", color: "#7fa39d" }}>UP NEXT</div>
                <div className="font-display" style={{ marginTop: 3, fontWeight: 700, fontSize: 19, color: "#f1f9f6" }}>
                  {s._after === "nextex" ? (next?.name ?? "Finish") : `${cur.name} · set ${s.set + 1}`}
                </div>
                <div style={{ fontSize: 12, color: "#9fc4bd", marginTop: 2 }}>
                  {s._after === "nextex" && next ? `${next.sets} × ${next.type === "hold" ? next.hold + "s hold" : next.reps} · ${next.area.toLowerCase()}` : cur.area.toLowerCase()}
                </div>
              </div>
            </div>
          )}
          <div style={{ marginTop: "auto", paddingBottom: 36, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <button onClick={skipRest} style={{ width: "100%", background: "#34d0bb", color: "#06352f", textAlign: "center", padding: 15, borderRadius: 15, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Skip rest →</button>
            <div style={{ fontSize: 12, color: "#5f7d77" }}>or just wait — we&apos;ll start you automatically</div>
          </div>
        </div>
        {showAudioSheet && <AudioSheet prefs={prefs} update={updatePrefs} close={() => setShowAudioSheet(false)} />}
      </Shell>
    );
  }

  /* ── EXERCISE (Coach) ── */
  const bigNumber = isHold ? s.holdLeft : s.repsDone;
  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 22px" }}>
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/home" style={{ textDecoration: "none", color: "#6f6a63", fontSize: 20 }}>‹</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Lower Back Recovery</div>
            <div style={{ height: 6, borderRadius: 3, background: "#e6e2da", marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: "#1f7a6d", borderRadius: 3 }} />
            </div>
          </div>
          <span className="font-mono-custom" style={{ fontSize: 11, color: "#9a958c" }}>~{minsLeft} min</span>
          <span onClick={() => setShowAudioSheet(true)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1px solid #e3e0d8", color: "#6f6a63", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer" }}>🔊</span>
        </div>

        <div style={{ marginTop: 14 }}>
          <VideoSlot exerciseName={cur.name} />
        </div>

        <div style={{ marginTop: 15, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div className="font-display" style={{ fontWeight: 700, fontSize: 23, letterSpacing: "-.02em" }}>{cur.name}</div>
            <div style={{ fontSize: 12.5, color: "#9a958c", marginTop: 2 }}>{cur.area}</div>
          </div>
          <span style={{ background: "#e7f1ef", color: "#155e54", fontSize: 12, fontWeight: 700, padding: "6px 11px", borderRadius: 10, whiteSpace: "nowrap" }}>Set {s.set} of {cur.sets}</span>
        </div>

        {isHold ? (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 64, color: "#1f7a6d", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{bigNumber}</div>
            <div className="font-mono-custom" style={{ fontSize: 11, letterSpacing: ".18em", color: "#9a958c", marginTop: 3 }}>SECONDS — HOLD STEADY</div>
          </div>
        ) : (
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            {dots.map((filled, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: filled ? "#1f7a6d" : "#d9d5cc" }} />)}
            <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13, color: "#1f7a6d" }}>{s.repsDone} / {cur.reps}</span>
          </div>
        )}

        <div style={{ marginTop: 14, background: "#e7f1ef", borderRadius: 14, padding: "12px 13px", display: "flex", gap: 10 }}>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1f7a6d", color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>!</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", color: "#155e54" }}>FORM CUE</div>
            <div style={{ fontSize: 12.5, color: "#2f4641", lineHeight: 1.4, marginTop: 3 }}>{cur.cue}</div>
          </div>
        </div>

        {next && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "10px 12px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "repeating-linear-gradient(45deg,#efece5 0 6px,#f6f3ec 6px 12px)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".07em", color: "#9a958c" }}>UP NEXT</div>
              <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 1 }}>{next.name}</div>
            </div>
            <div style={{ fontSize: 12, color: "#6f6a63", fontWeight: 600 }}>{next.type === "hold" ? `Hold ${next.hold}s` : `${next.sets} × ${next.reps}`}</div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: 14, paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <button onClick={prev} style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", border: "1px solid #e3e0d8", fontSize: 16, color: "#6f6a63", cursor: "pointer" }}>⏮</button>
            <button onClick={toggle} style={{ width: 66, height: 66, borderRadius: "50%", background: "#1f7a6d", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer", border: "none", boxShadow: "0 12px 24px -8px rgba(31,122,109,.7)" }}>{s.playing ? "❚❚" : "▶"}</button>
            <button onClick={skip} style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", border: "1px solid #e3e0d8", fontSize: 16, color: "#6f6a63", cursor: "pointer" }}>⏭</button>
          </div>
          {cur.type === "reps" && (
            <button onClick={countRep} style={{ marginTop: 12, width: "100%", textAlign: "center", background: "#123a4f", color: "#fff", padding: 13, borderRadius: 13, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", fontFamily: "inherit" }}>
              Count rep +1
            </button>
          )}
        </div>
      </div>
      {showAudioSheet && <AudioSheet prefs={prefs} update={updatePrefs} close={() => setShowAudioSheet(false)} />}
    </Shell>
  );
}

/* ── AUDIO SETTINGS SHEET ── */
function AudioSheet({ prefs, update, close }: { prefs: AudioPrefs; update: (p: Partial<AudioPrefs>) => void; close: () => void }) {
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(18,58,79,.28)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, background: "#fff", borderRadius: "26px 26px 0 0", padding: "14px 22px calc(34px + env(safe-area-inset-bottom))", boxShadow: "0 -18px 44px -18px rgba(20,30,40,.4)" }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: "#ddd9d0", margin: "0 auto" }} />
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.01em" }}>Sound &amp; guidance</div>
          <span onClick={close} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f1ec", color: "#6f6a63", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer" }}>✕</span>
        </div>
        <div style={{ marginTop: 8 }}>
          {[
            { key: "narration" as const, title: "Spoken narration", sub: "Reads each exercise and its form cue aloud" },
            { key: "beeps" as const, title: "Countdown beeps", sub: "Last 3 seconds of holds and rests" },
            { key: "chime" as const, title: "Set-complete chime", sub: "A soft chime when each set finishes" },
          ].map((row) => (
            <div key={row.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid #f0ede6" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{row.title}</div>
                <div style={{ fontSize: 12, color: "#9a958c", marginTop: 2 }}>{row.sub}</div>
              </div>
              <Toggle on={prefs[row.key]} onClick={() => update({ [row.key]: !prefs[row.key] })} />
            </div>
          ))}
          <div style={{ padding: "13px 0", borderBottom: "1px solid #f0ede6" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>Volume</div>
              <span className="font-mono-custom" style={{ fontSize: 11, color: "#9a958c" }}>{Math.round(prefs.volume * 100)}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={Math.round(prefs.volume * 100)}
              onChange={(e) => update({ volume: Number(e.target.value) / 100 })}
              style={{ width: "100%", marginTop: 12, accentColor: "#1f7a6d" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>Voice</div>
              <div style={{ fontSize: 12, color: "#9a958c", marginTop: 2 }}>
                Standard · natural voices with <b style={{ color: "#c2693f" }}>Plus</b>
              </div>
            </div>
            <span style={{ background: "#f3f1ec", color: "#3f3c37", fontSize: 12.5, fontWeight: 700, padding: "8px 12px", borderRadius: 10 }}>Standard ▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}
