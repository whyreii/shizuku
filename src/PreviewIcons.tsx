import {
  DRAFT_ACTIONS,
  DRAFT_ALL,
  DRAFT_HEADER,
  DRAFT_MEDALS,
  DRAFT_RAIL,
  DraftIcon,
  RailDrop,
  type DraftIconName,
} from "./iconDrafts";

const GROUP: Record<string, DraftIconName[]> = {
  rail: DRAFT_RAIL,
  header: DRAFT_HEADER,
  action: DRAFT_ACTIONS,
  medal: DRAFT_MEDALS,
};

function groupOf(name: DraftIconName): string {
  for (const [key, list] of Object.entries(GROUP)) {
    if (list.includes(name)) return key;
  }
  return "";
}

const CSS = `
.pi { min-height: 100vh; background: #07080a; color: #e9eef5; font: 13px/1.4 system-ui, sans-serif; padding: 26px 30px 40px; }
.pi h1 { font-size: 20px; margin: 0 0 2px; }
.pi .pi-sub { color: #93a1b1; font-size: 12px; margin-bottom: 22px; }
.pi h2 { font-size: 11px; letter-spacing: .09em; text-transform: uppercase; color: #93a1b1; margin: 22px 0 10px; }
.pi .pi-sheet { border-radius: 12px; padding: 18px 20px 20px; }
.pi .pi-sheet.ink { background: #0b0c0b; border: 1px solid rgba(255,255,255,.07); }
.pi .pi-sheet.frost { background: linear-gradient(165deg,#151d26,#0b1119); border: 1px solid rgba(255,255,255,.09); position: relative; overflow: hidden; }
.pi .pi-sheet.frost::after { content:""; position:absolute; inset:0; background-image: repeating-linear-gradient(115deg, rgba(255,255,255,.05) 0 1px, transparent 1px 8px); opacity: .35; pointer-events:none; }
.pi .pi-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
.pi .pi-card { border-radius: 8px; padding: 12px 12px 10px; background: rgba(255,255,255,.025); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
.pi .pi-sizes { display: flex; align-items: flex-end; gap: 14px; min-height: 52px; color: #eef4fb; }
.pi .pi-sizes span { display: flex; align-items: flex-end; }
.pi .pi-name { margin-top: 8px; font-size: 12px; color: #cdd9e5; }
.pi .pi-cat { font-size: 10.5px; color: #7f8f9f; }
.pi .pi-railrow { display: flex; gap: 26px; align-items: flex-start; }
.pi .pi-railbox { width: 220px; border-radius: 12px; padding: 10px 8px 12px; background: rgba(255,255,255,.02); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
.pi .pi-railcap { font-size: 11px; color: #93a1b1; padding: 4px 8px 8px; }
.pi .pi-railitem { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 2px 7px; color: #a6b9cc; font-size: 11px; }
.pi .pi-railitem.on { color: #eef4fb; }
.pi .pi-railitem.on::before { content:""; position:absolute; left:-6px; top:50%; width:2px; height:22px; margin-top:-11px; border-radius:2px; background:#9ad9ff; box-shadow: 0 0 12px rgba(154,217,255,.8); }
.pi .pi-iconwrap { position: relative; display: grid; place-items: center; }
.pi .pi-drop { position: absolute; right: -6px; bottom: -5px; }
.pi .pi-zoombar { display: flex; align-items: center; gap: 10px; margin-top: 12px; color: #7f8f9f; font-size: 11px; }
.pi .pi-zoombar b { color: #cdd9e5; font-weight: 500; }
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
      <div className="pi-cat">{groupOf(name)}</div>
    </div>
  );
}

function Rail({ withDrop }: { withDrop: "all" | "active" }) {
  return (
    <div className="pi-railbox">
      <div className="pi-railcap">
        {withDrop === "all" ? "A · drop on all seven" : "B · drop only on the active tab"}
      </div>
      {DRAFT_RAIL.map((name) => {
        const active = name === "fountain";
        const drop = withDrop === "all" || active;
        return (
          <div key={name} className={active ? "pi-railitem on" : "pi-railitem"}>
            <span className="pi-iconwrap">
              <DraftIcon name={name} size={20} />
              {drop ? <span className="pi-drop"><RailDrop size={10} /></span> : null}
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
      <h1>Shizuku — icon contact sheet</h1>
      <div className="pi-sub">
        carved ice · 1.5 stroke · butt terminals · 24 grid · not wired into Icon.tsx ·
        each card shows 16 / 24 / 48 px
      </div>

      <h2>On ink (#0b0c0b)</h2>
      <div className="pi-sheet ink">
        <div className="pi-grid">
          {DRAFT_ALL.map((name) => (
            <Card key={name} name={name} tone="ink" />
          ))}
        </div>
      </div>

      <h2>On frost</h2>
      <div className="pi-sheet frost">
        <div className="pi-grid">
          {DRAFT_ALL.map((name) => (
            <Card key={name} name={name} tone="frost" />
          ))}
        </div>
      </div>

      <h2>Rail variants · 20px icons, 11px labels</h2>
      <div className="pi-railrow">
        <Rail withDrop="all" />
        <Rail withDrop="active" />
        <div className="pi-railbox" style={{ width: 300 }}>
          <div className="pi-railcap">Notes</div>
          <div style={{ padding: "0 8px", fontSize: 11.5, color: "#93a1b1", lineHeight: 1.6 }}>
            The drop is a placeholder ramune; in the app it becomes currentColor at
            the tab's accent. Compare A (all seven) with B (active only) at 20px —
            A is the version to beat for clutter.
          </div>
        </div>
      </div>

      <div className="pi-zoombar">
        <b>16px is the gate:</b> any glyph that turns to mush there falls back to
        rounded terminals individually, not as a set.
      </div>
    </div>
  );
}
