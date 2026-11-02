import {
  DRAFT_RAIL,
  DraftIcon,
  type DraftIconName,
} from "./iconDrafts";

const CHANGED: DraftIconName[] = ["fountain", "wishes"];

const ACCENT = "#9ad9ff";

const CSS = `
.pi { min-height: 100vh; background: #07080a; color: #e9eef5; font: 13px/1.4 system-ui, sans-serif; padding: 26px 30px 40px; }
.pi h1 { font-size: 20px; margin: 0 0 2px; }
.pi .pi-sub { color: #93a1b1; font-size: 12px; margin-bottom: 22px; }
.pi h2 { font-size: 11px; letter-spacing: .09em; text-transform: uppercase; color: #93a1b1; margin: 22px 0 10px; }
.pi .pi-sheet { border-radius: 12px; padding: 18px 20px 20px; }
.pi .pi-sheet.ink { background: #0b0c0b; border: 1px solid rgba(255,255,255,.07); }
.pi .pi-sheet.frost { background: linear-gradient(165deg,#151d26,#0b1119); border: 1px solid rgba(255,255,255,.09); position: relative; overflow: hidden; }
.pi .pi-sheet.frost::after { content:""; position:absolute; inset:0; background-image: repeating-linear-gradient(115deg, rgba(255,255,255,.05) 0 1px, transparent 1px 8px); opacity: .35; pointer-events:none; }
.pi .pi-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.pi .pi-card { border-radius: 8px; padding: 14px 14px 12px; background: rgba(255,255,255,.025); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
.pi .pi-sizes { display: flex; align-items: flex-end; gap: 18px; min-height: 56px; color: #eef4fb; }
.pi .pi-sizes span { display: flex; align-items: flex-end; }
.pi .pi-name { margin-top: 10px; font-size: 12px; color: #cdd9e5; }
.pi .pi-cat { font-size: 10.5px; color: #7f8f9f; }
.pi .pi-railrow { display: flex; gap: 26px; align-items: flex-start; }
.pi .pi-railbox { width: 260px; border-radius: 12px; padding: 10px 8px 12px; background: rgba(255,255,255,.02); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
.pi .pi-railcap { font-size: 11px; color: #93a1b1; padding: 4px 8px 8px; }
.pi .pi-railitem { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 2px 7px; color: #a6b9cc; font-size: 11px; }
.pi .pi-railitem.on { color: #eef4fb; }
.pi .pi-railitem.on::before { content:""; position:absolute; left:-6px; top:50%; width:2px; height:22px; margin-top:-11px; border-radius:2px; background:#9ad9ff; box-shadow: 0 0 12px rgba(154,217,255,.8); }
.pi .pi-note { width: 360px; font-size: 11.5px; line-height: 1.6; color: #93a1b1; padding: 8px 10px; }
.pi .pi-note b { color: #cdd9e5; font-weight: 500; }
`;

function Card({ name, tone }: { name: DraftIconName; tone: "ink" | "frost" }) {
  return (
    <div className="pi-card">
      <div className="pi-sizes" style={{ color: tone === "ink" ? "#eef4fb" : "#dce8f4" }}>
        <span><DraftIcon name={name} size={16} /></span>
        <span><DraftIcon name={name} size={24} /></span>
        <span><DraftIcon name={name} size={48} /></span>
      </div>
      <div className="pi-name">{name}</div>
      <div className="pi-cat">round 4</div>
    </div>
  );
}

function Rail() {
  return (
    <div className="pi-railbox">
      <div className="pi-railcap">Option A · one frost accent, 2px bar</div>
      {DRAFT_RAIL.map((name) => {
        const active = name === "fountain";
        return (
          <div key={name} className={active ? "pi-railitem on" : "pi-railitem"}>
            <span style={{ color: active ? ACCENT : undefined, display: "grid" }}>
              <DraftIcon name={name} size={20} />
            </span>
            {name}
          </div>
        );
      })}
    </div>
  );
}

export default function PreviewIcons() {
  return (
    <div className="pi">
      <style>{CSS}</style>
      <h1>Shizuku — icon contact sheet · round 4</h1>
      <div className="pi-sub">
        fountain and wishes redrawn · 16 / 24 / 48 px on ink and frost · not wired
        into Icon.tsx
      </div>

      <h2>On ink (#0b0c0b)</h2>
      <div className="pi-sheet ink">
        <div className="pi-grid">
          {CHANGED.map((name) => (
            <Card key={name} name={name} tone="ink" />
          ))}
        </div>
      </div>

      <h2>On frost</h2>
      <div className="pi-sheet frost">
        <div className="pi-grid">
          {CHANGED.map((name) => (
            <Card key={name} name={name} tone="frost" />
          ))}
        </div>
      </div>

      <h2>Rail · 20px, option A locked</h2>
      <div className="pi-railrow">
        <Rail />
        <div className="pi-note">
          <b>Fountain:</b> no mast. A tall basin, a water line, and one droplet
          above it.<br />
          <b>Wishes:</b> five-point falling star with a curved trail — a star, not a
          sparkle.<br /><br />
          <b>Rail:</b> option A. Every active tab is lit in frost; no per-tab tints.
        </div>
      </div>
    </div>
  );
}
