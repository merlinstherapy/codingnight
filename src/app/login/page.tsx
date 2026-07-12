"use client";
import { useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function sendLink() {
    if (!email.includes("@")) { setErrorMsg("Please enter a valid email."); setStatus("error"); return; }
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/home" : undefined },
    });
    if (error) { setErrorMsg(error.message); setStatus("error"); }
    else setStatus("sent");
  }

  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/welcome" style={{ textDecoration: "none", fontSize: 20, color: "#6f6a63" }}>‹</Link>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#e6e2da", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "#1f7a6d", borderRadius: 3 }} />
          </div>
        </div>
        <h1 className="font-display" style={{ marginTop: 26, fontWeight: 700, fontSize: 27, letterSpacing: "-.02em", margin: "26px 0 0" }}>
          Sign in without a password
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, color: "#6f6a63" }}>
          We&apos;ll email you a magic link — tap it and you&apos;re in.
        </p>

        <div style={{ marginTop: 26, fontSize: 12.5, fontWeight: 700, color: "#3f3c37" }}>Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && sendLink()}
          placeholder="you@example.com"
          style={{
            marginTop: 8, background: "#fff", border: "1.5px solid #1f7a6d", borderRadius: 13,
            padding: "15px 16px", fontSize: 15, color: "#21201d", fontFamily: "inherit", outline: "none",
          }}
        />
        <button
          onClick={sendLink}
          disabled={status === "sending"}
          style={{
            marginTop: 14, background: "#1f7a6d", color: "#fff", textAlign: "center",
            padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, border: "none",
            cursor: "pointer", fontFamily: "inherit", opacity: status === "sending" ? 0.6 : 1,
            boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)",
          }}
        >
          {status === "sending" ? "Sending…" : "Email me a magic link"}
        </button>

        {status === "sent" && (
          <div style={{ marginTop: 22, background: "#e7f1ef", border: "1px solid #cfe5e0", borderRadius: 14, padding: "14px 15px", display: "flex", gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: "#1f7a6d", color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✉</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#155e54" }}>Link sent</div>
              <div style={{ fontSize: 12.5, color: "#2f4641", lineHeight: 1.45, marginTop: 2 }}>
                Check your inbox — the link works for 15 minutes. Nothing there?{" "}
                <b style={{ cursor: "pointer" }} onClick={sendLink}>Resend</b>
              </div>
            </div>
          </div>
        )}
        {status === "error" && (
          <div style={{ marginTop: 14, color: "#a8512b", fontSize: 12.5 }}>{errorMsg}</div>
        )}

        <div style={{ marginTop: "auto", paddingBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: "#ddd9d0" }} />
            <span style={{ fontSize: 11.5, color: "#9a958c" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#ddd9d0" }} />
          </div>
          <Link href="/home" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid #e3e0d8", color: "#3f3c37", textAlign: "center", padding: 15, borderRadius: 15, fontWeight: 700, fontSize: 14.5 }}>
              Try the demo — no account
            </div>
          </Link>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11.5, color: "#9a958c" }}>
            Demo mode doesn&apos;t save progress between visits.
          </div>
        </div>
      </div>
    </Shell>
  );
}
