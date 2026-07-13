"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { exportMyData } from "@/lib/db";

const row: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px" };
const sectionLabel: React.CSSProperties = { marginTop: 16, fontSize: 11.5, fontWeight: 800, letterSpacing: ".07em", color: "#9a958c" };
const card: React.CSSProperties = { marginTop: 9, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, overflow: "hidden" };

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function exportData() {
    const data = await exportMyData();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mend-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function deleteAccount() {
    const sure = window.confirm(
      "Delete your account and ALL your data (routines, check-ins, sessions)? This cannot be undone."
    );
    if (!sure) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      const j = await res.json().catch(() => ({}));
      window.alert(j.error ?? "Delete failed — please try again.");
    }
  }

  if (loading) {
    return (
      <Shell>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9a958c", fontSize: 13 }}>Loading…</div>
        <BottomNav />
      </Shell>
    );
  }

  /* ── GUEST / DEMO MODE ── */
  if (!email) {
    return (
      <Shell>
        <div style={{ background: "#f7ebe2", borderBottom: "1px solid #f0d8c6", padding: "11px 24px", display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
          <span className="anim-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#d2774e" }} />
          <span style={{ fontSize: 12.5, color: "#5f4434", flex: 1 }}><b>Demo mode</b> — progress won&apos;t be saved</span>
          <Link href="/login" style={{ fontSize: 12.5, fontWeight: 800, color: "#a8512b", textDecoration: "none" }}>Create account</Link>
        </div>
        <div style={{ flex: 1, padding: "22px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#e3e0d8", color: "#9a958c", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19 }}>?</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-.01em" }}>Guest</div>
              <div style={{ fontSize: 12.5, color: "#9a958c" }}>Exploring Mend without an account</div>
            </div>
          </div>
          <div style={{ marginTop: 20, background: "#fff", border: "1px solid #ece9e2", borderRadius: 20, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 26 }}>💾</div>
            <div className="font-display" style={{ marginTop: 10, fontWeight: 700, fontSize: 19 }}>Keep what you&apos;ve done today</div>
            <div style={{ marginTop: 7, fontSize: 13, color: "#6f6a63", lineHeight: 1.5 }}>
              Your demo session and check-in will vanish when you leave. One tap saves them to a free account.
            </div>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <div style={{ marginTop: 16, background: "#1f7a6d", color: "#fff", padding: 14, borderRadius: 13, fontWeight: 700, fontSize: 14.5, boxShadow: "0 12px 24px -10px rgba(31,122,109,.6)" }}>
                Save my progress — free
              </div>
            </Link>
            <div style={{ marginTop: 10, fontSize: 12, color: "#9a958c" }}>Just an email — no password needed</div>
          </div>
          <div style={sectionLabel}>WHAT YOU GET WITH AN ACCOUNT</div>
          <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Progress & pain trend saved across devices",
              "Daily check-ins that adapt your plan",
              "Streaks & reminders that keep you honest",
            ].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #ece9e2", borderRadius: 13, padding: "11px 13px", fontSize: 13, color: "#3f3c37" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#e7f1ef", color: "#1f7a6d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</span>
                {t}
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
        </div>
        <BottomNav />
      </Shell>
    );
  }

  /* ── SIGNED IN ── */
  const name = email.split("@")[0];
  return (
    <Shell>
      <div style={{ flex: 1, padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#123a4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19 }}>
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-display" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-.01em" }}>{name}</div>
            <div style={{ fontSize: 12.5, color: "#9a958c" }}>{email}</div>
          </div>
        </div>

        {/* plan card */}
        <div style={{ marginTop: 18, background: "#123a4f", borderRadius: 18, padding: "15px 16px", display: "flex", alignItems: "center", gap: 13, color: "#eaf3f1" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: "#7fe0cf" }}>FREE PLAN</div>
            <div style={{ fontSize: 13, color: "#a9c7c1", marginTop: 3 }}>1 active routine · 7-day history</div>
          </div>
          <Link href="/paywall" style={{ textDecoration: "none" }}>
            <span style={{ background: "#34d0bb", color: "#06352f", fontSize: 12.5, fontWeight: 800, padding: "9px 14px", borderRadius: 11 }}>Upgrade</span>
          </Link>
        </div>

        <div style={sectionLabel}>SHARING</div>
        <div style={{ ...card, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 11, background: "#e7f1ef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧑‍⚕️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Share with your physio</div>
            <div style={{ fontSize: 11.5, color: "#9a958c" }}>Adherence summary they can actually see</div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".06em", background: "#f3f1ec", color: "#9a958c", padding: "4px 8px", borderRadius: 7 }}>SOON</span>
        </div>

        <div style={sectionLabel}>YOUR DATA</div>
        <div style={card}>
          <div onClick={exportData} style={{ ...row, borderBottom: "1px solid #f0ede6", cursor: "pointer" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Export my data</div><span style={{ color: "#c9c4ba", fontSize: 17 }}>›</span>
          </div>
          <div onClick={deleteAccount} style={{ ...row, borderBottom: "1px solid #f0ede6", cursor: "pointer" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#b0492a" }}>Delete account &amp; data</div><span style={{ color: "#c9c4ba", fontSize: 17 }}>›</span>
          </div>
          <Link href="/terms" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={row}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Terms · Privacy · Contact us</div><span style={{ color: "#c9c4ba", fontSize: 17 }}>›</span>
            </div>
          </Link>
        </div>

        <div onClick={signOut} style={{ marginTop: 14, textAlign: "center", fontSize: 13.5, fontWeight: 700, color: "#6f6a63", padding: 12, cursor: "pointer" }}>
          Sign out
        </div>
        <div style={{ height: 16 }} />
      </div>
      <BottomNav />
    </Shell>
  );
}
