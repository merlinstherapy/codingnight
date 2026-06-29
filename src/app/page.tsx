import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <PhoneShell>
      <div
        style={{
          position: "absolute",
          inset: "52px 0 70px 0",
          padding: "12px 22px 0",
          overflowY: "auto",
        }}
      >
        {/* greeting */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#9a958c", fontSize: 13 }}>Good morning,</div>
            <div
              className="font-display"
              style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em", lineHeight: 1.05 }}
            >
              Sam
            </div>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#123a4f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            S
          </div>
        </div>

        {/* today card */}
        <div
          style={{
            marginTop: 18,
            background: "#123a4f",
            borderRadius: 22,
            padding: "18px 18px 20px",
            position: "relative",
            overflow: "hidden",
            color: "#eaf3f1",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(52,208,187,.35),transparent 70%)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: ".07em",
              color: "#7fe0cf",
            }}
          >
            <span
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d0bb" }}
            />
            TODAY · ADAPTED FOR LOW PAIN
          </div>
          <div
            className="font-display"
            style={{ marginTop: 9, fontWeight: 700, fontSize: 23, letterSpacing: "-.02em" }}
          >
            Lower Back Recovery
          </div>
          <div style={{ marginTop: 5, fontSize: 13, color: "#a9c7c1" }}>
            6 exercises · ~14 min · low intensity
          </div>
          <div style={{ marginTop: 13, display: "flex", gap: 5 }}>
            {[true, true, false, false, false, false].map((done, i) => (
              <span
                key={i}
                style={{
                  width: 30,
                  height: 6,
                  borderRadius: 3,
                  background: done ? "#34d0bb" : "rgba(255,255,255,.22)",
                }}
              />
            ))}
          </div>
          <Link href="/player" style={{ textDecoration: "none" }}>
            <div
              style={{
                marginTop: 16,
                background: "#34d0bb",
                color: "#06352f",
                textAlign: "center",
                padding: 14,
                borderRadius: 13,
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              ▶&nbsp; Start session
            </div>
          </Link>
        </div>

        {/* routines */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>Your routines</div>
          <div style={{ fontSize: 12.5, color: "#1f7a6d", fontWeight: 700 }}>All</div>
        </div>

        <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 9 }}>
          {[
            {
              title: "Lower Back Recovery",
              meta: "6 exercises · daily",
              active: true,
              stripe: ["#e7f1ef", "#f0f6f4"],
            },
            {
              title: "Morning Mobility",
              meta: "5 exercises · 8 min",
              active: false,
              stripe: ["#efece5", "#f6f3ec"],
            },
            {
              title: "Desk Reset",
              meta: "4 exercises · 5 min",
              active: false,
              stripe: ["#efece5", "#f6f3ec"],
            },
          ].map((r) => (
            <div
              key={r.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fff",
                border: "1px solid #ece9e2",
                borderRadius: 14,
                padding: "11px 13px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: `repeating-linear-gradient(45deg,${r.stripe[0]} 0 6px,${r.stripe[1]} 6px 12px)`,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                <div style={{ color: "#9a958c", fontSize: 11.5 }}>
                  {r.meta}
                  {r.active && (
                    <>
                      {" · "}
                      <span style={{ color: "#1f7a6d", fontWeight: 600 }}>active</span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ color: "#c9c4ba", fontSize: 18 }}>›</div>
            </div>
          ))}
        </div>

        {/* import CTA */}
        <Link href="/import" style={{ textDecoration: "none" }}>
          <div
            style={{
              marginTop: 16,
              border: "1.5px dashed #b3aea4",
              borderRadius: 14,
              padding: "13px 16px",
              textAlign: "center",
              color: "#6f6a63",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            + Import new prescription
          </div>
        </Link>
        <div style={{ height: 20 }} />
      </div>

      <BottomNav />
    </PhoneShell>
  );
}
