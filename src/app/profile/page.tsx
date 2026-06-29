import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <PhoneShell>
      <div style={{ position: "absolute", inset: "52px 0 70px 0", padding: "12px 22px 0" }}>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-.02em" }}>
          Profile
        </div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#123a4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>S</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Sam</div>
            <div style={{ color: "#9a958c", fontSize: 13 }}>Patient of Dr. Lena Park</div>
          </div>
        </div>
        <div style={{ marginTop: 28, color: "#9a958c", fontSize: 13, textAlign: "center" }}>
          Profile settings coming soon.
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
