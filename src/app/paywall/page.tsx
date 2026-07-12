import Link from "next/link";
import Shell from "@/components/Shell";

export const metadata = { title: "Mend Plus" };

export default function PaywallPage() {
  return (
    <Shell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        <div style={{ marginTop: 44, display: "flex", justifyContent: "flex-end" }}>
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#efece5", color: "#6f6a63", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✕</span>
          </Link>
        </div>
        <h1 className="font-display" style={{ marginTop: 10, fontWeight: 800, fontSize: 29, letterSpacing: "-.02em", lineHeight: 1.1, margin: "10px 0 0" }}>
          Keep your recovery going
        </h1>
        <p style={{ marginTop: 9, fontSize: 14, color: "#6f6a63", lineHeight: 1.5 }}>
          You&apos;ve finished your first routine — that&apos;s the hard part. Plus keeps everything working as you add more.
        </p>

        <div style={{ marginTop: 20, background: "#123a4f", borderRadius: 20, padding: 18, color: "#eaf3f1", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,208,187,.3),transparent 70%)" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, position: "relative" }}>
            <span className="font-display" style={{ fontWeight: 800, fontSize: 30 }}>£5.99</span>
            <span style={{ fontSize: 13, color: "#a9c7c1" }}>/month · cancel anytime</span>
          </div>
          <div style={{ marginTop: 13, display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, position: "relative" }}>
            {[
              "Unlimited routines & imports",
              "Daily adaptation from your check-ins",
              "Full progress history & trends",
              "Natural narration voices",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#34d0bb", color: "#06352f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Free</div>
            <span style={{ fontSize: 11, color: "#9a958c" }}>what you have now</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: "#6f6a63", lineHeight: 1.6 }}>
            1 active routine · guided player · 7-day history
          </div>
        </div>

        <div style={{ marginTop: 14, background: "#e7f1ef", borderRadius: 13, padding: "11px 14px", fontSize: 12, color: "#2f4641", lineHeight: 1.45 }}>
          💡 Your free routine keeps working forever. Plus just removes the ceilings.
        </div>

        <div style={{ marginTop: "auto", paddingBottom: 30 }}>
          <div style={{ background: "#1f7a6d", color: "#fff", textAlign: "center", padding: 16, borderRadius: 15, fontWeight: 800, fontSize: 15.5, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}>
            Start 7-day free trial
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 13, fontSize: 12.5, color: "#9a958c" }}>
            <Link href="/profile" style={{ fontWeight: 700, color: "#6f6a63", textDecoration: "none" }}>Maybe later</Link>
            <span>·</span>
            <span>Restore purchase</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
