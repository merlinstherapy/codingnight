"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

/** The 4:3 demo-video slot in the player.
 *  Sources, in priority order:
 *  1. A video the user (or their physio) uploaded — Supabase Storage, muted loop
 *  2. A YouTube video the user picked — official embedded player (never downloaded)
 *  3. The animated placeholder
 *  Choices are remembered per-exercise in localStorage. */

type Choice = { kind: "upload" | "youtube"; src: string };
type Results = { videoId: string; title: string; channel: string; views: string }[];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function loadChoices(): Record<string, Choice> {
  try { return JSON.parse(localStorage.getItem("mend_videos") ?? "{}"); } catch { return {}; }
}
function saveChoice(slug: string, c: Choice | null) {
  const all = loadChoices();
  if (c) all[slug] = c; else delete all[slug];
  try { localStorage.setItem("mend_videos", JSON.stringify(all)); } catch { /* ignore */ }
}

export default function VideoSlot({ exerciseName }: { exerciseName: string }) {
  const slug = slugify(exerciseName);
  const fileRef = useRef<HTMLInputElement>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [sheet, setSheet] = useState(false);
  const [query, setQuery] = useState(exerciseName);
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState<"search" | "upload" | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setChoice(loadChoices()[slug] ?? null);
    setQuery(exerciseName);
    setResults(null);
    setMsg("");
  }, [slug, exerciseName]);

  async function search() {
    setBusy("search"); setMsg("");
    try {
      const res = await fetch(`/api/videos/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results ?? []);
      if (data.demo) setMsg("Demo results — add a YOUTUBE_API_KEY for real search.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(null);
    }
  }

  async function upload(file: File) {
    setBusy("upload"); setMsg("");
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) { setMsg("Sign in to upload your own videos."); return; }
      const path = `${user.id}/${slug}-${Date.now()}.${file.name.split(".").pop() ?? "mp4"}`;
      const { error } = await supabase.storage.from("exercise-videos").upload(path, file, { upsert: true });
      if (error) throw new Error(error.message);
      const { data: pub } = supabase.storage.from("exercise-videos").getPublicUrl(path);
      const c: Choice = { kind: "upload", src: pub.publicUrl };
      saveChoice(slug, c); setChoice(c); setSheet(false);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  function pickYouTube(videoId: string) {
    const c: Choice = { kind: "youtube", src: videoId };
    saveChoice(slug, c); setChoice(c); setSheet(false);
  }
  function clearChoice() { saveChoice(slug, null); setChoice(null); }

  return (
    <>
      <div style={{ height: 188, borderRadius: 18, position: "relative", overflow: "hidden", background: "repeating-linear-gradient(135deg,#e7f1ef 0 13px,#f0f6f4 13px 26px)" }}>
        {choice?.kind === "upload" && (
          <video src={choice.src} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {choice?.kind === "youtube" && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${choice.src}?loop=1&playlist=${choice.src}&rel=0&modestbranding=1`}
            title="Exercise demo"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        )}
        {!choice && (
          <>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 80% at 50% 35%,rgba(31,122,109,.14),transparent 70%)" }} />
            <span className="font-mono-custom" style={{ position: "absolute", left: 0, right: 0, top: "40%", textAlign: "center", color: "rgba(31,122,109,.45)", fontSize: 12, letterSpacing: ".1em" }}>DEMO LOOP</span>
          </>
        )}
        <span style={{ position: "absolute", top: 12, right: 12, background: "#123a4f", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: ".05em", padding: "4px 8px", borderRadius: 8 }}>FORM VIEW</span>
        <div style={{ position: "absolute", left: 12, bottom: 10, display: "flex", gap: 8 }}>
          <span onClick={() => setSheet(true)} style={{ background: "rgba(255,255,255,.92)", border: "1px solid #e3e0d8", color: "#1f7a6d", fontSize: 11.5, fontWeight: 700, padding: "6px 10px", borderRadius: 9, cursor: "pointer" }}>
            {choice ? "⇄ Change video" : "＋ Add video"}
          </span>
          {choice && (
            <span onClick={clearChoice} style={{ background: "rgba(255,255,255,.92)", border: "1px solid #e3e0d8", color: "#6f6a63", fontSize: 11.5, fontWeight: 700, padding: "6px 10px", borderRadius: 9, cursor: "pointer" }}>✕</span>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />

      {sheet && (
        <div onClick={() => setSheet(false)} style={{ position: "fixed", inset: 0, background: "rgba(18,58,79,.28)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, maxHeight: "80dvh", overflowY: "auto", background: "#fff", borderRadius: "26px 26px 0 0", padding: "14px 22px calc(30px + env(safe-area-inset-bottom))", boxShadow: "0 -18px 44px -18px rgba(20,30,40,.4)" }}>
            <div style={{ width: 44, height: 5, borderRadius: 3, background: "#ddd9d0", margin: "0 auto" }} />
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.01em" }}>Demo video · {exerciseName}</div>
              <span onClick={() => setSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f1ec", color: "#6f6a63", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>✕</span>
            </div>

            {/* upload */}
            <div onClick={() => busy !== "upload" && fileRef.current?.click()} style={{ marginTop: 16, border: "1.5px dashed #1f7a6d", background: "rgba(31,122,109,.05)", borderRadius: 16, padding: "16px 15px", display: "flex", gap: 13, alignItems: "center", cursor: "pointer" }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: "#1f7a6d", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>⬆</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{busy === "upload" ? "Uploading…" : "Upload your own video"}</div>
                <div style={{ fontSize: 12, color: "#6f6a63", marginTop: 2 }}>You or your physio doing the exercise · plays as a muted loop</div>
              </div>
            </div>

            {/* youtube search */}
            <div style={{ marginTop: 18, fontSize: 11.5, fontWeight: 800, letterSpacing: ".07em", color: "#9a958c" }}>OR FIND ON YOUTUBE</div>
            <div style={{ marginTop: 9, display: "flex", gap: 8 }}>
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                style={{ flex: 1, background: "#f6f5f2", border: "1px solid #e3e0d8", borderRadius: 12, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", outline: "none" }}
              />
              <button onClick={search} disabled={busy === "search"} style={{ background: "#1f7a6d", color: "#fff", border: "none", borderRadius: 12, padding: "0 18px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", opacity: busy === "search" ? 0.6 : 1 }}>
                {busy === "search" ? "…" : "Search"}
              </button>
            </div>
            {msg && <div style={{ marginTop: 10, fontSize: 12, color: "#a8512b" }}>{msg}</div>}
            {results && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {results.length === 0 && <div style={{ fontSize: 13, color: "#9a958c" }}>No embeddable videos found.</div>}
                {results.map((r) => (
                  <div key={r.videoId} onClick={() => pickYouTube(r.videoId)} style={{ display: "flex", alignItems: "center", gap: 12, background: "#f6f5f2", border: "1px solid #ece9e2", borderRadius: 13, padding: "10px 12px", cursor: "pointer" }}>
                    <img src={`https://i.ytimg.com/vi/${r.videoId}/default.jpg`} alt="" width={64} height={48} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "#9a958c", marginTop: 2 }}>{r.channel} · {r.views} views</div>
                    </div>
                    <span style={{ color: "#1f7a6d", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>＋</span>
                  </div>
                ))}
                <div style={{ fontSize: 10.5, color: "#9a958c", lineHeight: 1.4, marginTop: 4 }}>
                  YouTube videos play in the official embedded player. Content belongs to its creators.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
