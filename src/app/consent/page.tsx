"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabase";

export default function ConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(true);

  async function accept() {
    if (!agreed) return;
    try {
      localStorage.setItem("mend_consent", new Date().toISOString());
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("profiles").update({ accepted_terms_at: new Date().toISOString() }).eq("id", data.user.id);
      }
    } catch { /* consent still recorded locally */ }
    router.push("/login");
  }

  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/welcome" style={{ textDecoration: "none", fontSize: 20, color: "#6f6a63" }}>‹</Link>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#e6e2da", overflow: "hidden" }}>
            <div style={{ width: "66%", height: "100%", background: "#1f7a6d", borderRadius: 3 }} />
          </div>
        </div>
        <h1 className="font-display" style={{ marginTop: 26, fontWeight: 700, fontSize: 27, letterSpacing: "-.02em", margin: "26px 0 0" }}>
          Your health data stays yours
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, color: "#6f6a63" }}>
          Mend stores your exercises, check-ins and sessions so we can guide and adapt your plan.
          Here&apos;s the deal, plainly:
        </p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            <><b>Only you (and whoever you choose)</b> can see your data. Nothing is sold or shared with advertisers.</>,
            <><b>Export or delete everything</b> anytime from your profile — no questions asked.</>,
            <><b>Adaptation only eases off.</b> Mend never adds exercises your physio didn&apos;t prescribe.</>,
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "13px 14px" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#e7f1ef", color: "#1f7a6d", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>✓</span>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: "#3f3c37" }}>{item}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: "#f7ebe2", border: "1px solid #f0d8c6", borderRadius: 14, padding: "13px 14px", fontSize: 12.5, lineHeight: 1.45, color: "#5f4434" }}>
          <b style={{ color: "#a8512b" }}>Not medical advice.</b> Mend guides the plan your physiotherapist
          prescribed. If pain worsens, stop and speak to your clinician.
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <button
            onClick={() => setAgreed(!agreed)}
            aria-pressed={agreed}
            style={{
              width: 24, height: 24, borderRadius: 7, flexShrink: 0, marginTop: 1, cursor: "pointer",
              background: agreed ? "#1f7a6d" : "#fff",
              border: agreed ? "none" : "1.5px solid #c9c4ba",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
            }}
          >
            {agreed ? "✓" : ""}
          </button>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#3f3c37" }}>
            I consent to Mend processing my health data to run my exercise plan, as described in the{" "}
            <Link href="/privacy" style={{ color: "#1f7a6d" }}>Privacy Policy</Link> and{" "}
            <Link href="/terms" style={{ color: "#1f7a6d" }}>Terms</Link>.
          </div>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 36 }}>
          <button
            onClick={accept}
            disabled={!agreed}
            style={{
              width: "100%", background: agreed ? "#1f7a6d" : "#c9c4ba", color: "#fff",
              textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15,
              border: "none", cursor: agreed ? "pointer" : "default", fontFamily: "inherit",
              boxShadow: agreed ? "0 12px 24px -10px rgba(31,122,109,.6)" : "none",
            }}
          >
            I agree — continue
          </button>
        </div>
      </div>
    </Shell>
  );
}
