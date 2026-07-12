"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import { saveRoutine, type NewExercise } from "@/lib/db";

type Stage = "pick" | "scanning" | "review" | "error";

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
      if (!data.exercises?.length) throw new Error("No exercises found — is this an exercise handout?");
      setExercises(data.exercises);
      setPrescriber(data.prescriber ?? null);
      setIsDemo(!!data.demo);
      setStage("review");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setStage("error");
    }
  }

  function updateExercise(i: number, patch: Partial<NewExercise>) {
    setExercises((list) => list.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }
  function removeExercise(i: number) {
    setExercises((list) => list.filter((_, j) => j !== i));
  }

  async function build() {
    setSaving(true);
    await saveRoutine({
      name: "Imported routine",
      prescriberName: prescriber,
      exercises,
    }); // fails soft for guests — demo mode continues
    router.push("/checkin");
  }

  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 90px 0", padding: "10px 22px 0", overflowY: "auto" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>
          Import prescription
        </div>
        <div style={{ color: "#6f6a63", fontSize: 13.5, marginTop: 3 }}>
          {prescriber ?? "Snap a photo of your exercise handout"}
        </div>

        {/* photo area */}
        <div
          onClick={() => stage === "pick" && fileRef.current?.click()}
          style={{
            marginTop: 15, height: 184, borderRadius: 18, overflow: "hidden", position: "relative",
            background: preview
              ? `url(${preview}) center/cover no-repeat`
              : "repeating-linear-gradient(45deg,#ece9e2 0 10px,#f4f2ec 10px 20px)",
            border: "1px solid #e7e4dd",
            cursor: stage === "pick" ? "pointer" : "default",
          }}
        >
          {/* corner marks */}
          {[
            { left: 13, top: 13, borderLeft: "2px solid #1f7a6d", borderTop: "2px solid #1f7a6d" },
            { right: 13, top: 13, borderRight: "2px solid #1f7a6d", borderTop: "2px solid #1f7a6d" },
            { left: 13, bottom: 38, borderLeft: "2px solid #1f7a6d", borderBottom: "2px solid #1f7a6d" },
            { right: 13, bottom: 38, borderRight: "2px solid #1f7a6d", borderBottom: "2px solid #1f7a6d" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 20, height: 20, ...s }} />
          ))}

          {stage === "pick" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#1f7a6d", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6f6a63" }}>Tap to take a photo or upload</div>
            </div>
          )}

          {stage === "scanning" && (
            <div
              className="anim-scan"
              style={{ position: "absolute", left: 8, right: 8, top: 0, height: 2, background: "linear-gradient(90deg,transparent,#1f7a6d,transparent)", boxShadow: "0 0 12px 2px rgba(31,122,109,.5)" }}
            />
          )}

          <div
            className="font-mono-custom"
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "9px 13px", background: "linear-gradient(transparent,rgba(17,22,26,.72))", color: "#fff", fontSize: 11, display: "flex", justifyContent: "space-between" }}
          >
            <span>{fileName || "no file selected"}</span>
            <span style={{ color: "#7fe0cf" }}>
              {stage === "scanning" ? "reading…" : stage === "review" ? "done" : ""}
            </span>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />

        {stage === "error" && (
          <div style={{ marginTop: 16, background: "#f7ebe2", border: "1px solid #f0d8c6", borderRadius: 14, padding: "13px 15px", fontSize: 13, color: "#a8512b", lineHeight: 1.4 }}>
            {errorMsg}
            <div
              onClick={() => { setStage("pick"); setPreview(null); setFileName(""); }}
              style={{ marginTop: 8, fontWeight: 700, color: "#1f7a6d", cursor: "pointer" }}
            >
              Try another photo →
            </div>
          </div>
        )}

        {stage === "review" && (
          <>
            {isDemo && (
              <div style={{ marginTop: 12, background: "#e7f1ef", border: "1px solid #cfe5e0", borderRadius: 12, padding: "9px 13px", fontSize: 12, color: "#155e54" }}>
                Demo mode — showing a sample routine. Add an API key to read real handouts.
              </div>
            )}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{exercises.length} exercises detected</div>
              <div style={{ fontSize: 12, color: "#9a958c" }}>tap a value to edit</div>
            </div>

            <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 8 }}>
              {exercises.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 13, padding: "10px 12px" }}>
                  <div style={{ width: 21, height: 21, borderRadius: "50%", background: "#e7f1ef", color: "#1f7a6d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      value={e.name}
                      onChange={(ev) => updateExercise(i, { name: ev.target.value })}
                      style={{ fontWeight: 600, fontSize: 14, border: "none", outline: "none", background: "transparent", width: "100%", fontFamily: "inherit", color: "#21201d" }}
                    />
                    <div style={{ color: "#9a958c", fontSize: 11 }}>{e.area} · {e.phase}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, background: "#f3f1ec", borderRadius: 8, padding: "5px 7px", flexShrink: 0 }}>
                    <input
                      type="number" min={1} value={e.sets}
                      onChange={(ev) => updateExercise(i, { sets: Math.max(1, Number(ev.target.value)) })}
                      style={{ width: 26, border: "none", outline: "none", background: "transparent", fontWeight: 700, fontSize: 12, fontFamily: "inherit", textAlign: "right" }}
                    />
                    ×
                    <input
                      type="number" min={1}
                      value={e.type === "hold" ? e.hold_seconds : e.reps}
                      onChange={(ev) => {
                        const v = Math.max(1, Number(ev.target.value));
                        updateExercise(i, e.type === "hold" ? { hold_seconds: v } : { reps: v });
                      }}
                      style={{ width: 30, border: "none", outline: "none", background: "transparent", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}
                    />
                    {e.type === "hold" && <span style={{ fontWeight: 400, color: "#9a958c" }}>s</span>}
                  </div>
                  <div
                    onClick={() => removeExercise(i)}
                    style={{ color: "#c9c4ba", fontSize: 16, cursor: "pointer", flexShrink: 0 }}
                    title="Remove"
                  >
                    ✕
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{ height: 12 }} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 26 }}>
        <button
          onClick={build}
          disabled={stage !== "review" || exercises.length === 0 || saving}
          style={{
            width: "100%", background: stage === "review" ? "#1f7a6d" : "#c9c4ba", color: "#fff",
            textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15,
            border: "none", cursor: stage === "review" ? "pointer" : "default", fontFamily: "inherit",
            boxShadow: stage === "review" ? "0 12px 24px -10px rgba(31,122,109,.75)" : "none",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : "Build my routine →"}
        </button>
      </div>
    </PhoneShell>
  );
}
