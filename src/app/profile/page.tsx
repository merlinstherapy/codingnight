"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

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
    setEmail(null);
    router.push("/login");
  }

  const initial = email ? email[0].toUpperCase() : "S";

  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 70px 0", padding: "12px 22px 0", overflowY: "auto" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>
          Profile
        </div>

        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#123a4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>
            {initial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>
              {loading ? "…" : email ?? "Guest"}
            </div>
            <div style={{ color: "#9a958c", fontSize: 13 }}>
              {email ? "Signed in" : "Demo mode — data isn't saved"}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 9 }}>
          {email ? (
            <button
              onClick={signOut}
              style={{ background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "13px 15px", fontSize: 14, fontWeight: 600, textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "#21201d" }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <div style={{ background: "#1f7a6d", color: "#fff", borderRadius: 14, padding: "13px 15px", fontSize: 14, fontWeight: 700, textAlign: "center" }}>
                Sign in to save your progress
              </div>
            </Link>
          )}

          <Link href="/terms" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "13px 15px", fontSize: 14, fontWeight: 600, color: "#21201d", display: "flex", justifyContent: "space-between" }}>
              Terms of Service <span style={{ color: "#c9c4ba" }}>›</span>
            </div>
          </Link>
          <Link href="/privacy" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid #ece9e2", borderRadius: 14, padding: "13px 15px", fontSize: 14, fontWeight: 600, color: "#21201d", display: "flex", justifyContent: "space-between" }}>
              Privacy Policy <span style={{ color: "#c9c4ba" }}>›</span>
            </div>
          </Link>
        </div>

        <div style={{ marginTop: 22, background: "#f7ebe2", border: "1px solid #f0d8c6", borderRadius: 14, padding: "12px 14px", fontSize: 12, color: "#5f4434", lineHeight: 1.5 }}>
          <b>Medical disclaimer:</b> Mend guides you through exercises prescribed by your health
          professional. It does not provide medical advice. Stop and consult your practitioner if
          symptoms worsen.
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
