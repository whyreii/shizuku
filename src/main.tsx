import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./icons.css";
import App from "./App.tsx";
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
};

start();
// Extras hydrate after first paint; the roster notifies subscribers.
void loadExtraRoster();
void loadImageMap();