"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { saveRoutine, type NewExercise } from "@/lib/db";

type Stage = "pick" | "scanning" | "review" | "error";

function Stepper({ label, value, unit, onChange }: { label: string; value: number; unit?: string; onChange: (v: number) => void }) {
  const btn: React.CSSProperties = { width: 22, height: 22, borderRadius: 7, background: "#fff", border: "1px solid #e3e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#6f6a63", cursor: "pointer", userSelect: "none" };
  return (
    <div style={{ flex: 1, background: "#f6f5f2", borderRadius: 11, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 11, color: "#9a958c" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={btn} onClick={() => onChange(Math.max(1, value - 1))}>−</span>
        <b style={{ fontSize: 14 }}>{value}{unit}</b>
        <span style={btn} onClick={() => onChange(value + 1)}>+</span>
      </span>
    </div>
  );
}

export default function ImportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("pick");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [prescriber, setPrescriber] = useState<string | null>(null);
  const [exercises, setExercises] = useState<NewExercise[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onFile(file: File) {
    setFileName(file.name);
    setStage("scanning");
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    setPreview(dataUrl);
    const [meta, base64] = dataUrl.split(",");
    const mediaType = meta.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      if (!data.exercises?.length) throw new Error("We couldn't find exercises on this page.");
      setExercises(data.exercises);
      setPrescriber(data.prescriber ?? null);
      setIsDemo(!!data.demo);
      setStage("review");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setStage("error");
    }
  }

  function update(i: number, patch: Partial<NewExercise>) {
    setExercises((l) => l.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }
  function remove(i: number) { setExercises((l) => l.filter((_, j) => j !== i)); }
  function reset() { setStage("pick"); setPreview(null); setFileName(""); }

  async function build() {
    setSaving(true);
    await saveRoutine({ name: "Imported routine", prescriberName: prescriber, exercises });
    router.push("/checkin");
  }

  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/add" style={{ textDecoration: "none", fontSize: 20, color: "#6f6a63" }}>‹</Link>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-.01em", flex: 1 }}>
            {stage === "review" ? "Check what we read" : "Import prescription"}
          </div>
          {stage === "review" && (
            <span onClick={reset} style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700, cursor: "pointer" }}>Rescan</span>
          )}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: "#6f6a63" }}>
          {stage === "review"
            ? `We read ${exercises.length} exercises${prescriber ? ` · ${prescriber}` : ""}. Tap any value to fix it.`
            : "Snap a photo of your exercise handout."}
        </div>

        {/* photo area */}
        {stage !== "review" && (
          <div
            onClick={() => stage === "pick" && fileRef.current?.click()}
            style={{
              marginTop: 16, height: 210, borderRadius: 18, overflow: "hidden", position: "relative",
              background: preview ? `url(${preview}) center/cover no-repeat` : "repeating-linear-gradient(45deg,#ece9e2 0 10px,#f4f2ec 10px 20px)",
              border: "1px solid #e7e4dd", cursor: stage === "pick" ? "pointer" : "default",
              filter: stage === "error" ? "saturate(.7)" : "none",
            }}
          >
            {stage === "error" && <div style={{ position: "absolute", inset: 0, background: "rgba(246,245,242,.55)" }} />}
            {stage === "pick" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#1f7a6d", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📷</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#6f6a63" }}>Tap to take a photo or upload</div>
              </div>
            )}
            {stage === "scanning" && (
              <div className="anim-scan" style={{ position: "absolute", left: 8, right: 8, top: 0, height: 2, background: "linear-gradient(90deg,transparent,#1f7a6d,transparent)", boxShadow: "0 0 12px 2px rgba(31,122,109,.5)" }} />
            )}
            <div className="font-mono-custom" style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "9px 13px", background: "linear-gradient(transparent,rgba(17,22,26,.72))", color: "#fff", fontSize: 11, display: "flex", justifyContent: "space-between" }}>
              <span>{fileName || "no file selected"}</span>
              <span style={{ color: stage === "error" ? "#f0b9a2" : "#7fe0cf" }}>
                {stage === "scanning" ? "reading…" : stage === "error" ? "couldn't read" : ""}
              </span>
            </div>
          </div>
        )}

        <input
          ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
        />

        {/* ── ERROR STATE ── */}
        {stage === "error" && (
          <>
            <div style={{ marginTop: 20, display: "flex", gap: 13, background: "#f7ebe2", border: "1px solid #f0d8c6", borderRadius: 16, padding: "15px 16px" }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#d2774e", color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>!</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#a8512b" }}>We couldn&apos;t read this one</div>
                <div style={{ fontSize: 13, color: "#5f4434", lineHeight: 1.5, marginTop: 3 }}>{errorMsg} A clearer shot usually fixes it.</div>
              </div>
            </div>
            <div style={{ marginTop: 18, fontSize: 12.5, fontWeight: 800, letterSpacing: ".06em", color: "#9a958c" }}>TIPS FOR A GOOD SCAN</div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                ["💡", "Good light, no shadows across the page"],
                ["📄", "Lay the page flat and fill the frame"],
                ["✍️", "Handwritten? Get close to the text"],
              ].map(([icon, tip]) => (
                <div key={tip} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 13, padding: "11px 13px", fontSize: 13, color: "#3f3c37" }}>
                  <span style={{ fontSize: 15 }}>{icon}</span>{tip}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "auto", paddingTop: 16, paddingBottom: 30, display: "flex", flexDirection: "column", gap: 11 }}>
              <button onClick={() => { reset(); fileRef.current?.click(); }} style={{ background: "#1f7a6d", color: "#fff", textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}>
                📷 Retake photo
              </button>
              <Link href="/add" style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e3e0d8", color: "#3f3c37", textAlign: "center", padding: 15, borderRadius: 15, fontWeight: 700, fontSize: 14.5 }}>
                  Type it in instead
                </div>
              </Link>
            </div>
          </>
        )}

        {/* ── REVIEW STATE ── */}
        {stage === "review" && (
          <>
            {isDemo && (
              <div style={{ marginTop: 12, background: "#e7f1ef", border: "1px solid #cfe5e0", borderRadius: 12, padding: "9px 13px", fontSize: 12, color: "#155e54" }}>
                Demo mode — showing a sample routine.
              </div>
            )}
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {exercises.map((e, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: "13px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <input
                      value={e.name}
                      onChange={(ev) => update(i, { name: ev.target.value })}
                      style={{ fontWeight: 700, fontSize: 14.5, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", color: "#21201d", flex: 1, minWidth: 0 }}
                    />
                    <span onClick={() => remove(i)} style={{ color: "#c9c4ba", fontSize: 15, cursor: "pointer", flexShrink: 0 }}>✕</span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    {e.type === "hold" ? (
                      <Stepper label="Hold" value={e.hold_seconds} unit="s" onChange={(v) => update(i, { hold_seconds: v })} />
                    ) : (
                      <Stepper label="Reps" value={e.reps} onChange={(v) => update(i, { reps: v })} />
                    )}
                    <Stepper label="Sets" value={e.sets} onChange={(v) => update(i, { sets: v })} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "auto", paddingTop: 16, paddingBottom: 30 }}>
              <button
                onClick={build}
                disabled={saving || exercises.length === 0}
                style={{ width: "100%", background: "#1f7a6d", color: "#fff", padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}
              >
                {saving ? "Saving…" : "Looks right — build my routine →"}
              </button>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
