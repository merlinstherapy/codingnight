import Link from "next/link";
import Shell from "@/components/Shell";
import BottomNav from "@/components/BottomNav";

const phases = [
  { dot: "#9fd3c9", label: "WARM-UP", tag: "Mobilize before load", exercises: [["Cat–Cow", "×10"], ["Pelvic Tilt", "2×12"]], color: "#1f7a6d", tagBg: "#e7f1ef" },
  { dot: "#1f7a6d", label: "ACTIVATE", tag: "Switch on the right muscles", exercises: [["Glute Bridge", "3×12"]], color: "#1f7a6d", tagBg: "#e7f1ef" },
  { dot: "#155e54", label: "STABILIZE", tag: "Control under fatigue", exercises: [["Bird Dog", "3×10"], ["McGill Curl-up", "2×8"]], color: "#155e54", tagBg: "#e7f1ef" },
  { dot: "#d2774e", label: "COOL-DOWN", tag: "Release & breathe", exercises: [["Child's Pose", "hold 40s ×2"]], color: "#c2693f", tagBg: "#f7ebe2" },
];

export default function OrderPage() {
  return (
    <Shell>
      <div style={{ flex: 1, padding: "24px 24px 0" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>Why this order?</div>
        <div style={{ color: "#6f6a63", fontSize: 13.5, marginTop: 3 }}>Ordered from your physio&apos;s list to optimize recovery.</div>

        <div style={{ marginTop: 18, position: "relative", paddingLeft: 30 }}>
          <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 2, background: "linear-gradient(#9fd3c9,#1f7a6d 45%,#155e54 70%,#d2774e)" }} />
          {phases.map((p, i) => (
            <div key={p.label} style={{ position: "relative", marginBottom: i < phases.length - 1 ? 13 : 0 }}>
              <div style={{ position: "absolute", left: -30, top: 14, width: 22, height: 22, borderRadius: "50%", background: p.dot, border: "3px solid #f6f5f2" }} />
              <div style={{ background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "12px 13px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: p.color }}>{p.label}</span>
                  <span style={{ fontSize: 10.5, background: p.tagBg, color: p.color, padding: "3px 8px", borderRadius: 7, fontWeight: 600 }}>{p.tag}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#3f3c37", lineHeight: 1.5 }}>
                  {p.exercises.map(([name, dose], j) => (
                    <span key={name}>{j > 0 && <span>&nbsp;&nbsp;</span>}<b>{name}</b> · {dose}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/player" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 20, marginBottom: 20, background: "#1f7a6d", color: "#fff", textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 700, fontSize: 15, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}>
            Start session →
          </div>
        </Link>
      </div>
      <BottomNav />
    </Shell>
  );
}
