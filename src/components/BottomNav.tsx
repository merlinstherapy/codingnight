"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/home", shape: "square" },
  { label: "Plan", href: "/order", shape: "square" },
  { label: "Progress", href: "/progress", shape: "circle" },
  { label: "Profile", href: "/profile", shape: "circle" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <div
      style={{
        marginTop: "auto",
        borderTop: "1px solid #ece9e2",
        background: "#fff",
        display: "flex",
        justifyContent: "space-around",
        paddingTop: 12,
        paddingBottom: "max(14px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((t) => {
        const active = path === t.href;
        const color = active ? "#1f7a6d" : "#b3aea4";
        const radius = t.shape === "circle" ? "50%" : 5;
        return (
          <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color }}>
              <span
                style={{
                  width: 18, height: 18, border: `2px solid ${color}`, borderRadius: radius,
                  background: active ? "#e7f1ef" : "transparent", display: "inline-block",
                }}
              />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{t.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
