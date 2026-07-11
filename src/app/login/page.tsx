"use client";
import { useState } from "react";
import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";
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
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    if (error) { setErrorMsg(error.message); setStatus("error"); }
    else setStatus("sent");
  }

  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 0", padding: "40px 26px 0", display: "flex", flexDirection: "column" }}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", color: "#123a4f" }}>
          Mend<span style={{ color: "#1f7a6d" }}>.</span>
        </div>
        <div style={{ color: "#6f6a63", fontSize: 14.5, marginTop: 8, lineHeight: 1.45 }}>
          Your physio prescription, turned into one guided follow-along flow.
        </div>

        <div style={{ marginTop: 44, fontWeight: 700, fontSize: 13.5 }}>Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          placeholder="you@example.com"
          style={{
            marginTop: 8, padding: "14px 15px", borderRadius: 13,
            border: "1px solid #e3e0d8", background: "#fff", fontSize: 15,
            fontFamily: "inherit", outline: "none",
          }}
        />

        {status === "sent" ? (
          <div style={{ marginTop: 16, background: "#e7f1ef", border: "1px solid #cfe5e0", borderRadius: 13, padding: "13px 15px", fontSize: 13.5, color: "#155e54", lineHeight: 1.4 }}>
            ✓ Check your inbox — we sent you a sign-in link.
          </div>
        ) : (
          <button
            onClick={sendLink}
            disabled={status === "sending"}
            style={{
              marginTop: 16, background: "#1f7a6d", color: "#fff", textAlign: "center",
              padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, border: "none",
              cursor: "pointer", fontFamily: "inherit", opacity: status === "sending" ? 0.6 : 1,
              boxShadow: "0 12px 24px -10px rgba(31,122,109,.75)",
            }}
          >
            {status === "sending" ? "Sending…" : "Send me a sign-in link"}
          </button>
        )}

        {status === "error" && (
          <div style={{ marginTop: 12, color: "#a8512b", fontSize: 12.5 }}>{errorMsg}</div>
        )}

        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 18, textAlign: "center", color: "#9a958c", fontSize: 13, fontWeight: 600 }}>
            Continue without an account →
          </div>
        </Link>

        <div style={{ marginTop: "auto", paddingBottom: 30, fontSize: 11, color: "#9a958c", textAlign: "center", lineHeight: 1.5 }}>
          By continuing you agree to our{" "}
          <Link href="/terms" style={{ color: "#1f7a6d", fontWeight: 600 }}>Terms</Link> and{" "}
          <Link href="/privacy" style={{ color: "#1f7a6d", fontWeight: 600 }}>Privacy Policy</Link>.
          <br />Mend is not a substitute for professional medical advice.
        </div>
      </div>
    </PhoneShell>
  );
}
