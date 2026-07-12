"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

type State = { loading: boolean; email: string | null; hasRoutines: boolean };

export default function HomePage() {
  const [s, setS] = useState<State>({ loading: true, email: null, hasRoutines: false });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { setS({ loading: false, email: null, hasRoutines: false }); return; }
      const { count } = await supabase
        .from("routines")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);
      setS({ loading: false, email: user.email ?? null, hasRoutines: (count ?? 0) > 0 });
    })();
  }, []);

  const name = s.email ? s.email.split("@")[0] : "Sam";
  const initial = name[0]?.toUpperCase() ?? "S";
  // Signed-in users with no routines see first-run; guests get the demo home.
  const firstRun = !s.loading && s.email !== null && !s.hasRoutines;

  return (
    <Shell>
      <div style={{ padding: "24px 24px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* greeting */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#9a958c", fontSize: 13 }}>{firstRun ? "Welcome to Mend," : "Good morning,"}</div>
            <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em", lineHeight: 1.05 }}>{name}</div>
          </div>
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#123a4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>{initial}</div>
          </Link>
        </div>

        {firstRun ? (
          <>
            {/* empty state */}
            <div style={{ marginTop: 24, border: "1.5px dashed #cfcabf", borderRadius: 22, padding: "28px 22px", textAlign: "center", background: "#fbfaf7" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#e7f1ef", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🏋️</div>
              <div className="font-display" style={{ marginTop: 16, fontWeight: 700, fontSize: 20, letterSpacing: "-.01em" }}>No routines yet</div>
              <div style={{ marginTop: 7, fontSize: 13.5, color: "#6f6a63", lineHeight: 1.5 }}>
                Add the exercises your physio prescribed — search takes seconds, and Mend builds your guided routine.
              </div>
              <Link href="/add" style={{ textDecoration: "none" }}>
                <div style={{ marginTop: 18, background: "#1f7a6d", color: "#fff", textAlign: "center", padding: 15, borderRadius: 14, fontWeight: 700, fontSize: 14.5, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}>
                  🔍&nbsp; Search my exercises
                </div>
              </Link>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/import" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: "1px solid #ece9e2", borderRadius: 15, padding: "14px 15px" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, background: "#f3f1ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📷</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Snap the handout instead</div>
                    <div style={{ fontSize: 12, color: "#9a958c" }}>We&apos;ll read it — good for long or handwritten lists</div>
                  </div>
                  <span style={{ color: "#c9c4ba", fontSize: 18 }}>›</span>
                </div>
              </Link>
              <Link href="/add" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: "1px solid #ece9e2", borderRadius: 15, padding: "14px 15px" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, background: "#f3f1ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📚</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Browse the library</div>
                    <div style={{ fontSize: 12, color: "#9a958c" }}>Physio-approved exercises</div>
                  </div>
                  <span style={{ color: "#c9c4ba", fontSize: 18 }}>›</span>
                </div>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: "1px solid #ece9e2", borderRadius: 15, padding: "14px 15px" }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: "#f3f1ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏥</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Have a code from your physio?</div>
                  <div style={{ fontSize: 12, color: "#9a958c" }}>Coming soon — clinics prescribe Mend directly</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".06em", background: "#f3f1ec", color: "#9a958c", padding: "4px 8px", borderRadius: 7 }}>SOON</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* today card */}
            <div style={{ marginTop: 18, background: "#123a4f", borderRadius: 22, padding: "18px 18px 20px", position: "relative", overflow: "hidden", color: "#eaf3f1" }}>
              <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,208,187,.35),transparent 70%)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5, fontWeight: 700, letterSpacing: ".07em", color: "#7fe0cf" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d0bb" }} />
                TODAY · ADAPTED FOR LOW PAIN
              </div>
              <div className="font-display" style={{ marginTop: 9, fontWeight: 700, fontSize: 23, letterSpacing: "-.02em" }}>Lower Back Recovery</div>
              <div style={{ marginTop: 5, fontSize: 13, color: "#a9c7c1" }}>6 exercises · ~14 min · low intensity</div>
              <div style={{ marginTop: 13, display: "flex", gap: 5 }}>
                {[true, true, false, false, false, false].map((done, i) => (
                  <span key={i} style={{ width: 30, height: 6, borderRadius: 3, background: done ? "#34d0bb" : "rgba(255,255,255,.22)" }} />
                ))}
              </div>
              <Link href="/checkin" style={{ textDecoration: "none" }}>
                <div style={{ marginTop: 16, background: "#34d0bb", color: "#06352f", textAlign: "center", padding: 14, borderRadius: 13, fontWeight: 800, fontSize: 15 }}>
                  ▶&nbsp; Start session
                </div>
              </Link>
            </div>

            {/* routines */}
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Your routines</div>
              <div style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700 }}>All</div>
            </div>
            <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { title: "Lower Back Recovery", meta: "6 exercises · daily", active: true, stripe: ["#e7f1ef", "#f0f6f4"] },
                { title: "Morning Mobility", meta: "5 exercises · 8 min", active: false, stripe: ["#efece5", "#f6f3ec"] },
              ].map((r) => (
                <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "11px 13px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: `repeating-linear-gradient(45deg,${r.stripe[0]} 0 6px,${r.stripe[1]} 6px 12px)`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                    <div style={{ color: "#9a958c", fontSize: 11.5 }}>
                      {r.meta}
                      {r.active && <> · <span style={{ color: "#1f7a6d", fontWeight: 600 }}>active</span></>}
                    </div>
                  </div>
                  <div style={{ color: "#c9c4ba", fontSize: 18 }}>›</div>
                </div>
              ))}
            </div>
            <Link href="/add" style={{ textDecoration: "none" }}>
              <div style={{ marginTop: 14, border: "1.5px dashed #b3aea4", borderRadius: 14, padding: "13px 16px", textAlign: "center", color: "#6f6a63", fontSize: 13.5, fontWeight: 600 }}>
                + Add exercises
              </div>
            </Link>
          </>
        )}
        <div style={{ height: 20 }} />
      </div>
      <BottomNav />
    </Shell>
  );
}
