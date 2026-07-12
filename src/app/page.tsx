import Link from "next/link";

export const metadata = {
  title: "Mend — Your physio plan, turned into one guided flow",
  description:
    "Add your prescribed exercises — search them or snap the handout — and Mend times, counts and narrates every rep.",
};

const teal = "#1f7a6d";
const navy = "#123a4f";

export default function Landing() {
  return (
    <div style={{ background: "#f6f5f2", minHeight: "100vh" }}>
      {/* nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 6vw", flexWrap: "wrap", gap: 12 }}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 24, color: navy }}>
          Mend<span style={{ color: teal }}>.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 2.5vw, 34px)", fontSize: 14, fontWeight: 600, color: "#6f6a63", flexWrap: "wrap" }}>
          <a href="#how" style={{ color: "inherit" }}>How it works</a>
          <a href="#pricing" style={{ color: "inherit" }}>Pricing</a>
          <a href="#pricing" style={{ color: "inherit" }}>For clinics</a>
          <Link href="/login" style={{ color: teal }}>Sign in</Link>
          <Link href="/welcome" style={{ background: teal, color: "#fff", padding: "11px 20px", borderRadius: 11, fontWeight: 700 }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section style={{ display: "flex", alignItems: "center", gap: 60, padding: "46px 6vw 80px", flexWrap: "wrap" }}>
        <div style={{ flex: "1.15 1 420px", minWidth: 300 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e7f1ef", color: "#155e54", fontSize: 12.5, fontWeight: 700, padding: "7px 13px", borderRadius: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: teal }} />
            Built with physiotherapists
          </div>
          <h1 className="font-display" style={{ marginTop: 22, fontWeight: 800, fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.04, letterSpacing: "-.025em", color: "#21201d" }}>
            Your physio plan,<br />turned into one<br /><span style={{ color: teal }}>guided flow.</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.55, color: "#6f6a63", maxWidth: 480 }}>
            Stop hunting YouTube between exercises. Add your prescribed exercises — search them or snap
            the handout — and Mend times, counts and narrates every rep, in the order that&apos;s right
            for recovery.
          </p>
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/welcome" style={{ background: teal, color: "#fff", padding: "17px 32px", borderRadius: 14, fontWeight: 800, fontSize: 16, boxShadow: "0 14px 28px -10px rgba(31,122,109,.55)" }}>
              Start free — no card needed
            </Link>
            <a href="#how" style={{ fontSize: 14.5, fontWeight: 700, color: navy }}>See how it works ↓</a>
          </div>
          <div style={{ marginTop: 26, fontSize: 12.5, color: "#9a958c" }}>
            Free forever for one routine · Works on any phone, no app store
          </div>
        </div>

        {/* phone mockup (marketing imagery — bezel allowed here) */}
        <div style={{ flex: ".85 1 320px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 300, height: 620, background: "#0e1b1c", border: "9px solid #11161a", borderRadius: 42, overflow: "hidden", position: "relative", boxShadow: "0 40px 70px -24px rgba(20,30,40,.5)" }}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, background: "#11161a", borderRadius: 13, zIndex: 10 }} />
            <div style={{ position: "absolute", inset: 0, padding: "52px 20px 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["#1f7a6d", "#1f7a6d", "#34d0bb", "rgba(255,255,255,.16)", "rgba(255,255,255,.16)", "rgba(255,255,255,.16)"].map((c, i) => (
                  <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: c }} />
                ))}
              </div>
              <div style={{ marginTop: 14, height: 150, borderRadius: 16, position: "relative", overflow: "hidden", background: "repeating-linear-gradient(135deg,#10302f 0 11px,#0c2625 11px 22px)" }}>
                <div className="anim-glow" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 30%,rgba(52,208,187,.22),transparent 70%)" }} />
              </div>
              <div className="font-display" style={{ marginTop: 16, textAlign: "center", fontWeight: 700, fontSize: 19, color: "#f1f9f6" }}>Glute Bridge</div>
              <div className="font-mono-custom" style={{ textAlign: "center", fontSize: 9.5, color: "#7fa39d", marginTop: 3, letterSpacing: ".08em" }}>SET 2 OF 3</div>
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <div className="font-display" style={{ fontWeight: 800, fontSize: 62, lineHeight: 1, color: "#34d0bb" }}>7</div>
                <div className="font-mono-custom" style={{ fontSize: 9.5, letterSpacing: ".18em", color: "#7fa39d", marginTop: 3 }}>REPS</div>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.28)", color: "#cfe9e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⏮</span>
                <span style={{ width: 56, height: 56, borderRadius: "50%", background: "#34d0bb", color: "#06352f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>❚❚</span>
                <span style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(207,233,227,.28)", color: "#cfe9e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⏭</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" style={{ background: "#fff", padding: "70px 6vw" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 36px)", letterSpacing: "-.02em" }}>Three steps, zero faff</h2>
          <p style={{ marginTop: 10, fontSize: 16, color: "#6f6a63" }}>From paper handout to guided session in under a minute.</p>
        </div>
        <div style={{ marginTop: 44, display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { icon: "🔍", bg: navy, title: "1 · Add your exercises", body: "Search each exercise in seconds — or snap the handout and Mend reads it. Set your reps, confirm with one tap." },
            { icon: "✓", bg: teal, title: "2 · Check in daily", body: "Tell Mend how you feel in 10 seconds. Rough day? It eases the plan off — never past what your physio prescribed." },
            { icon: "▶", bg: "#d2774e", title: "3 · Press play & follow", body: "One continuous session: demo loops, spoken cues, rep counting, rest timers. You never touch the screen mid-flow." },
          ].map((s) => (
            <div key={s.title} style={{ flex: "1 1 280px", background: "#f6f5f2", borderRadius: 22, padding: 28 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{s.icon}</div>
              <h3 className="font-display" style={{ marginTop: 18, fontWeight: 700, fontSize: 21 }}>{s.title}</h3>
              <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: "#6f6a63" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* trust */}
      <section style={{ padding: "70px 6vw", display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-.02em", lineHeight: 1.15 }}>Careful by design</h2>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: "#6f6a63", maxWidth: 440 }}>
            Mend guides the plan your physiotherapist gave you — it never diagnoses, and never adds
            exercises on its own. Adaptation only ever eases intensity down.
          </p>
        </div>
        <div style={{ flex: "1.2 1 360px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "🧑‍⚕️", title: "Built with physiotherapists", body: "Every demo video and cue reviewed by working clinicians." },
            { icon: "🔒", title: "Your data is yours", body: "Health data encrypted, never sold. Export or delete anytime." },
            { icon: "⚕️", title: "Not a medical device", body: "Mend supports your prescribed plan. If pain worsens, we tell you to stop and call your clinician." },
          ].map((t) => (
            <div key={t.title} style={{ display: "flex", gap: 14, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: "16px 18px" }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "#6f6a63", marginTop: 2 }}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" style={{ background: navy, padding: "70px 6vw" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 36px)", letterSpacing: "-.02em", color: "#fff" }}>Simple pricing</h2>
          <p style={{ marginTop: 10, fontSize: 15.5, color: "#a9c7c1" }}>Free to start. Upgrade when recovery becomes a habit.</p>
        </div>
        <div style={{ marginTop: 44, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Free */}
          <div style={{ width: 340, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 22, padding: 28, color: "#eaf3f1" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Free</div>
            <div className="font-display" style={{ marginTop: 10, fontWeight: 800, fontSize: 38 }}>£0</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, color: "#c4d8d3" }}>
              <div>✓ 1 active routine</div><div>✓ Full guided player, audio cues</div><div>✓ Daily check-ins</div><div>✓ 7-day history</div>
            </div>
            <Link href="/welcome" style={{ display: "block", marginTop: 22, textAlign: "center", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 12, padding: 13, fontWeight: 700, fontSize: 14, color: "#eaf3f1" }}>
              Start free
            </Link>
          </div>
          {/* Plus */}
          <div style={{ width: 340, background: "#fff", borderRadius: 22, padding: 28, position: "relative", boxShadow: "0 24px 50px -18px rgba(0,0,0,.4)" }}>
            <span style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#34d0bb", color: "#06352f", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", padding: "6px 14px", borderRadius: 14 }}>MOST POPULAR</span>
            <div style={{ fontWeight: 800, fontSize: 16, color: teal }}>Plus</div>
            <div className="font-display" style={{ marginTop: 10, fontWeight: 800, fontSize: 38 }}>
              £5.99<span style={{ fontSize: 15, color: "#9a958c", fontWeight: 600 }}> /mo</span>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, color: "#3f3c37" }}>
              <div>✓ Unlimited routines &amp; imports</div><div>✓ Adaptation from your check-ins</div><div>✓ Full history &amp; pain trends</div><div>✓ Natural narration voices</div>
            </div>
            <Link href="/welcome" style={{ display: "block", marginTop: 22, textAlign: "center", background: teal, color: "#fff", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 14 }}>
              Try free for 7 days
            </Link>
          </div>
          {/* Clinics */}
          <div style={{ width: 340, background: "rgba(255,255,255,.06)", border: "1.5px dashed rgba(255,255,255,.25)", borderRadius: 22, padding: 28, color: "#eaf3f1" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              For clinics{" "}
              <span style={{ fontSize: 10.5, background: "rgba(52,208,187,.2)", color: "#7fe0cf", padding: "4px 9px", borderRadius: 8, marginLeft: 6, letterSpacing: ".05em" }}>COMING SOON</span>
            </div>
            <div className="font-display" style={{ marginTop: 10, fontWeight: 800, fontSize: 24, lineHeight: 1.2 }}>Prescribe Mend.<br />See adherence.</div>
            <p style={{ marginTop: 14, fontSize: 13.5, color: "#c4d8d3", lineHeight: 1.55 }}>
              Send routines straight to patients&apos; phones and finally see who&apos;s doing their exercises.
            </p>
            <div style={{ marginTop: 22, textAlign: "center", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 12, padding: 13, fontWeight: 700, fontSize: 14 }}>
              Join the waitlist
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer style={{ padding: "34px 6vw", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d2c3d", color: "#7d9aa8", fontSize: 13, flexWrap: "wrap", gap: 14 }}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#eaf3f1" }}>
          Mend<span style={{ color: "#34d0bb" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          <Link href="/terms" style={{ color: "inherit" }}>Terms</Link>
          <Link href="/privacy" style={{ color: "inherit" }}>Privacy</Link>
          <span>Contact</span>
          <span>hello@mend.app</span>
        </div>
        <div>© 2026 Mend Health Ltd.</div>
      </footer>
    </div>
  );
}
