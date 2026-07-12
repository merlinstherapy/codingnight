import Link from "next/link";
import Shell from "@/components/Shell";

export const metadata = { title: "Welcome — Mend" };

export default function WelcomePage() {
  return (
    <Shell dark>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 28px", background: "#123a4f", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -70, top: -70, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,208,187,.3),transparent 70%)" }} />
        <div className="font-display" style={{ marginTop: 60, fontWeight: 800, fontSize: 26, color: "#fff", position: "relative" }}>
          Mend<span style={{ color: "#34d0bb" }}>.</span>
        </div>
        <div style={{ marginTop: 44, position: "relative" }}>
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.08, letterSpacing: "-.02em", color: "#fff", margin: 0 }}>
            Your physio plan, turned into one guided flow.
          </h1>
          <p style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.5, color: "#a9c7c1" }}>
            Timed, counted and narrated — so you can just press play and follow along.
          </p>
        </div>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
          {[
            "Add your prescribed exercises — search or snap",
            "Check in with how you feel",
            "Follow along — we count for you",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "13px 15px" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#34d0bb", color: "#06352f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: "#eaf3f1" }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 40, position: "relative" }}>
          <Link href="/consent" style={{ textDecoration: "none" }}>
            <div style={{ background: "#34d0bb", color: "#06352f", textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 800, fontSize: 15.5 }}>Start free</div>
          </Link>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 13.5, color: "#a9c7c1" }}>
            Already using Mend?{" "}
            <Link href="/login" style={{ color: "#7fe0cf", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
