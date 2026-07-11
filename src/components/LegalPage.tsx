import Link from "next/link";
import { ReactNode } from "react";
import PhoneShell from "@/components/PhoneShell";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 0", padding: "10px 22px 30px", overflowY: "auto" }}>
        <Link href="/login" style={{ textDecoration: "none", color: "#6f6a63", fontSize: 20 }}>‹</Link>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em", marginTop: 8 }}>
          {title}
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: "#3f3c37", lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </PhoneShell>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#21201d" }}>{heading}</div>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}
