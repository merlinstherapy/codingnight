"use client";
import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";

const detected = [
  { name: "Cat–Cow", line: "line 1", sets: "× 10" },
  { name: "Glute Bridge", line: "line 3", sets: "3 × 12" },
  { name: "Bird Dog", line: "line 4", sets: "3 × 10" },
];

export default function ImportPage() {
  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 0", padding: "10px 22px 0" }}>
        <div
          className="font-display"
          style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}
        >
          Import prescription
        </div>
        <div style={{ color: "#6f6a63", fontSize: 13.5, marginTop: 3 }}>
          Dr. Lena Park · Northside Physio
        </div>

        {/* scan area */}
        <div
          style={{
            marginTop: 15,
            height: 184,
            borderRadius: 18,
            overflow: "hidden",
            position: "relative",
            background: "repeating-linear-gradient(45deg,#ece9e2 0 10px,#f4f2ec 10px 20px)",
            border: "1px solid #e7e4dd",
          }}
        >
          {/* corners */}
          {[
            { left: 13, top: 13, borderLeft: "2px solid #1f7a6d", borderTop: "2px solid #1f7a6d" },
            { right: 13, top: 13, borderRight: "2px solid #1f7a6d", borderTop: "2px solid #1f7a6d" },
            { left: 13, bottom: 38, borderLeft: "2px solid #1f7a6d", borderBottom: "2px solid #1f7a6d" },
            { right: 13, bottom: 38, borderRight: "2px solid #1f7a6d", borderBottom: "2px solid #1f7a6d" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 20, height: 20, ...s }} />
          ))}
          {/* scan line */}
          <div
            className="anim-scan"
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: 0,
              height: 2,
              background: "linear-gradient(90deg,transparent,#1f7a6d,transparent)",
              boxShadow: "0 0 12px 2px rgba(31,122,109,.5)",
            }}
          />
          <div
            className="font-mono-custom"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "9px 13px",
              background: "linear-gradient(transparent,rgba(17,22,26,.72))",
              color: "#fff",
              fontSize: 11,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>physio_handout.jpg</span>
            <span style={{ color: "#7fe0cf" }}>reading…</span>
          </div>
        </div>

        {/* detected header */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>6 exercises detected</div>
          <div style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700 }}>Edit</div>
        </div>

        {/* exercise list */}
        <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 8 }}>
          {detected.map((e) => (
            <div
              key={e.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                background: "#fff",
                border: "1px solid #ece9e2",
                borderRadius: 13,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  width: 21,
                  height: 21,
                  borderRadius: "50%",
                  background: "#e7f1ef",
                  color: "#1f7a6d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                <div style={{ color: "#9a958c", fontSize: 11 }}>{e.line}</div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#f3f1ec",
                  borderRadius: 8,
                  padding: "5px 9px",
                }}
              >
                {e.sets}
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: "#fff",
              border: "1px dashed #d9d5cc",
              borderRadius: 13,
              padding: "9px 12px",
              color: "#9a958c",
              fontSize: 12.5,
            }}
          >
            <div
              style={{
                width: 21,
                height: 21,
                borderRadius: "50%",
                background: "#f0eee7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              +
            </div>
            3 more — tap to review
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 26 }}>
        <Link href="/checkin" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#1f7a6d",
              color: "#fff",
              textAlign: "center",
              padding: 16,
              borderRadius: 15,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 12px 24px -10px rgba(31,122,109,.75)",
            }}
          >
            Build my routine →
          </div>
        </Link>
      </div>
    </PhoneShell>
  );
}
