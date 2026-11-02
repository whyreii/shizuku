import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./icons.css";
import App from "./App.tsx";
import { fixtureName } from "./engine/fixture";
import { loadExtraRoster } from "./engine/roster";
import { loadImageMap } from "./engine/images";

// Extras live in /public, so they stay out of the JS bundle.
// Wait for them so the first render already has the full pool.
const start = () => {
  const root = createRoot(document.getElementById("root")!);
  // Layout studies are opt-in and code-split, so they never weigh on the app.
  const preview = new URLSearchParams(window.location.search).get("preview");
  if (preview === "v3" || preview === "v4" || preview === "icons") {
    void import(
      preview === "v3"
        ? "./PreviewV3.tsx"
        : preview === "v4"
          ? "./PreviewV4.tsx"
          : "./PreviewIcons.tsx"
    ).then(
      (mod) => {
        root.render(
          <StrictMode>
            <mod.default />
          </StrictMode>,
        );
        document.getElementById("boot")?.remove();
      },
    );
    return;
  }
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  document.getElementById("boot")?.remove();
  // A fixture must never be mistaken for a real save.
  if (import.meta.env.DEV) {
    const name = fixtureName(window.location.search);
    if (name) {
      const chip = document.createElement("div");
      chip.textContent = `fixture · ${name}`;
      chip.setAttribute("aria-hidden", "true");
      chip.style.cssText = [
        "position:fixed",
        "left:10px",
        "bottom:10px",
        "z-index:9999",
        "padding:4px 9px",
        "border-radius:2px",
        "background:#2a1a04",
        "color:#f7c667",
        "font:11px/1.5 ui-monospace,SFMono-Regular,monospace",
        "letter-spacing:.04em",
        "pointer-events:none",
      ].join(";");
      document.body.appendChild(chip);
    }
  }
};

start();
// Extras hydrate after first paint; the roster notifies subscribers.
void loadExtraRoster();
void loadImageMap();