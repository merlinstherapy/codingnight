"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { saveCheckin } from "@/lib/db";

const areas = ["Lower back", "Hips", "Glutes", "Hamstrings", "Neck"];
const stiffness = ["None", "Mild", "Moderate", "High"];

export default function CheckinPage() {
  const router = useRouter();
  const [pain, setPain] = useState(30);
  const [selectedArea, setSelectedArea] = useState("Lower back");
  const [selectedStiff, setSelectedStiff] = useState("Moderate");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    // Fails soft when not logged in — demo mode keeps working
    await saveCheckin({
      painLevel: Math.round(pain / 10),
      tensionAreas: [selectedArea],
      stiffness: selectedStiff.toLowerCase(),
    });
    router.push("/order");
  }

  return (
    <Shell>
      <div style={{ flex: 1, padding: "24px 24px 0" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>
          How&apos;s your back today?
        </div>
        <div style={{ color: "#6f6a63", fontSize: 13.5, marginTop: 3 }}>
          We&apos;ll tune today&apos;s plan to how you feel.
        </div>

        {/* pain slider */}
        <div style={{ marginTop: 20, fontWeight: 700, fontSize: 13.5 }}>Pain right now</div>
        <div style={{ marginTop: 14, position: "relative" }}>
          <div
            style={{
              height: 10,
              borderRadius: 6,
              background: "linear-gradient(90deg,#1f7a6d,#e3b24f 60%,#d2774e)",
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              opacity: 0,
              cursor: "pointer",
              height: 10,
            }}
          />
          {/* thumb */}
          <div
            style={{
              position: "absolute",
              left: `${pain}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#fff",
              border: "3px solid #1f7a6d",
              boxShadow: "0 4px 10px -3px rgba(20,30,40,.4)",
              pointerEvents: "none",
            }}
          />
          {/* tooltip */}
          <div
            style={{
              position: "absolute",
              left: `${pain}%`,
              top: -32,
              transform: "translateX(-50%)",
              background: "#123a4f",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 700,
              padding: "4px 9px",
              borderRadius: 8,
              whiteSpace: "nowrap",
            }}
          >
            {Math.round(pain / 10)} · {pain < 30 ? "minimal" : pain < 60 ? "mild" : pain < 80 ? "moderate" : "severe"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 11, color: "#9a958c" }}>
          <span>No pain</span><span>Severe</span>
        </div>

        {/* tension area */}
        <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13.5 }}>Where&apos;s the tension?</div>
        <div style={{ marginTop: 11, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {areas.map((a) => (
            <span
              key={a}
              onClick={() => setSelectedArea(a)}
              style={{
                background: selectedArea === a ? "#1f7a6d" : "#fff",
                color: selectedArea === a ? "#fff" : "#6f6a63",
                border: selectedArea === a ? "none" : "1px solid #e3e0d8",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "8px 13px",
                borderRadius: 11,
                cursor: "pointer",
              }}
            >
              {a}
            </span>
          ))}
        </div>

        {/* stiffness */}
        <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13.5 }}>Morning stiffness</div>
        <div
          style={{
            marginTop: 11,
            display: "flex",
            background: "#efece5",
            borderRadius: 12,
            padding: 3,
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          {stiffness.map((s) => (
            <div
              key={s}
              onClick={() => setSelectedStiff(s)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "9px 0",
                borderRadius: 9,
                cursor: "pointer",
                background: selectedStiff === s ? "#fff" : "transparent",
                color: selectedStiff === s ? "#21201d" : "#9a958c",
                boxShadow: selectedStiff === s ? "0 2px 6px -3px rgba(20,30,40,.3)" : "none",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* adapted plan */}
        <div
          style={{
            marginTop: 22,
            background: "#f7ebe2",
            border: "1px solid #f0d8c6",
            borderRadius: 16,
            padding: "15px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="anim-pulse"
              style={{ width: 9, height: 9, borderRadius: "50%", background: "#d2774e" }}
            />
            <span style={{ fontWeight: 700, fontSize: 13, color: "#a8512b" }}>Plan adapted for today</span>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, color: "#5f4434", lineHeight: 1.35 }}>
            <div>· Swapped <b>Dead Bug → McGill Curl-up</b> — gentler on your back</div>
            <div>· Added an extra <b>warm-up</b> round before loading</div>
            <div>· Capped end-range holds at <b>40s</b></div>
          </div>
        </div>
        <button
          onClick={submit}
          disabled={saving}
          style={{
            width: "100%",
            marginTop: 24,
            marginBottom: 30,
            background: "#1f7a6d",
            color: "#fff",
            textAlign: "center",
            padding: 16,
            borderRadius: 15,
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            opacity: saving ? 0.6 : 1,
            boxShadow: "0 12px 24px -10px rgba(31,122,109,.75)",
          }}
        >
          {saving ? "Saving…" : "Use today's plan →"}
        </button>
      </div>
    </Shell>
  );
}
