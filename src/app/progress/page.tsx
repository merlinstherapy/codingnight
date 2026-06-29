import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";

const bars = [88, 80, 92, 70, 62, 50, 44, 30];
const barColors = ["#e7c0ad", "#e7c0ad", "#e2a98c", "#dec0a0", "#bcd3c6", "#8fc3b4", "#56a594", "#1f7a6d"];
const days = [
  { d: "M", done: true },
  { d: "T", done: true },
  { d: "W", done: false },
  { d: "T", done: true },
  { d: "F", done: true },
  { d: "S", today: true },
  { d: "S", done: false },
];

export default function ProgressPage() {
  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 70px 0", padding: "12px 22px 0", overflowY: "auto" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>
          Your recovery
        </div>
        <div style={{ color: "#6f6a63", fontSize: 13.5, marginTop: 3 }}>Last 14 days</div>

        {/* stats */}
        <div style={{ marginTop: 16, display: "flex", gap: 11 }}>
          <div style={{ flex: 1, background: "#123a4f", color: "#eaf3f1", borderRadius: 16, padding: 14 }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 30, lineHeight: 1 }}>12</div>
            <div style={{ fontSize: 11.5, color: "#a9c7c1", marginTop: 4 }}>day streak</div>
          </div>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: 14 }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, color: "#1f7a6d" }}>
              4<span style={{ fontSize: 16, color: "#9a958c" }}>/5</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#9a958c", marginTop: 4 }}>sessions this week</div>
          </div>
        </div>

        {/* pain chart */}
        <div style={{ marginTop: 13, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: 15 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Pain trending down</div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#1f7a6d" }}>−40%</span>
          </div>
          <div style={{ marginTop: 14, height: 74, display: "flex", alignItems: "flex-end", gap: 6 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: barColors[i],
                  borderRadius: "5px 5px 0 0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10.5, color: "#9a958c" }}>
            <span>2 wks ago</span><span>today</span>
          </div>
        </div>

        {/* week */}
        <div style={{ marginTop: 13, background: "#fff", border: "1px solid #ece9e2", borderRadius: 16, padding: "14px 15px" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 11 }}>This week</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {days.map((day, i) => {
              let bg = "#efece5", color = "#c9c4ba", content = "·";
              let border = "none";
              if (day.done) { bg = "#1f7a6d"; color = "#fff"; content = "✓"; }
              if (day.today) { bg = "transparent"; color = "#1f7a6d"; border = "2px solid #1f7a6d"; content = "·"; }
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: bg, color, border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: day.done ? 13 : 11, fontWeight: 800 }}>
                    {content}
                  </div>
                  <div style={{ fontSize: 10, color: day.today ? "#1f7a6d" : "#9a958c", fontWeight: day.today ? 700 : 400, marginTop: 5 }}>
                    {day.d}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* range improvement */}
        <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 11, background: "#f7ebe2", border: "1px solid #f0d8c6", borderRadius: 14, padding: "12px 14px" }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 22, color: "#c2693f" }}>+12°</div>
          <div style={{ fontSize: 12.5, color: "#5f4434", lineHeight: 1.35 }}>
            Forward-bend range improved since you started.
          </div>
        </div>
        <div style={{ height: 16 }} />
      </div>

      <BottomNav />
    </PhoneShell>
  );
}
