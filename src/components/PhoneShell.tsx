"use client";
import { ReactNode } from "react";

export default function PhoneShell({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  const bg = dark ? "#0e1b1c" : "#f6f5f2";
  const statusColor = dark ? "#cfe9e3" : "#21201d";

  return (
    <div
      style={{
        width: 390,
        height: 844,
        background: bg,
        border: "10px solid #11161a",
        borderRadius: 48,
        overflow: "hidden",
        position: "relative",
        boxShadow:
          "0 34px 60px -22px rgba(20,30,40,.4),0 12px 26px -14px rgba(20,30,40,.3)",
      }}
    >
      {/* notch */}
      <div
        style={{
          position: "absolute",
          top: 13,
          left: "50%",
          transform: "translateX(-50%)",
          width: 116,
          height: 30,
          background: dark ? "#000" : "#11161a",
          borderRadius: 16,
          zIndex: 30,
        }}
      />
      {/* status bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 30px 6px",
          zIndex: 20,
          color: statusColor,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>9:41</span>
        <span
          style={{
            width: 18,
            height: 11,
            border: `1.5px solid ${statusColor}`,
            borderRadius: 3,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 1.5,
              bottom: 1.5,
              left: 1.5,
              width: "62%",
              background: statusColor,
              borderRadius: 1,
            }}
          />
        </span>
      </div>
      {/* home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 132,
          height: 5,
          borderRadius: 3,
          background: dark
            ? "rgba(207,233,227,.35)"
            : "rgba(20,30,40,.2)",
          zIndex: 30,
        }}
      />
      {children}
    </div>
  );
}
