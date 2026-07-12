import Link from "next/link";
import { ReactNode } from "react";
import Shell from "@/components/Shell";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Shell>
      <div style={{ flex: 1, padding: "24px 24px 40px" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#6f6a63", fontSize: 20 }}>‹</Link>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em", marginTop: 8 }}>
          {title}
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: "#3f3c37", lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </Shell>
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
