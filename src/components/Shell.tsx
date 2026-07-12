"use client";
import { ReactNode } from "react";

/** Edge-to-edge app shell (v2). No fake bezel/status bar — the real device
 *  provides those. On desktop the app renders as a centered narrow column
 *  on the sand background; on phones it's full-bleed. */
export default function Shell({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className="app-shell"
      style={{
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100dvh",
        background: dark ? "#0e1b1c" : "#f6f5f2",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {children}
    </div>
  );
}
