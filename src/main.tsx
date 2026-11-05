import i18n from "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "devextreme/dist/css/dx.light.css";
import "./index.css";
import { restoreAuthSession } from "./utils/restoreAuthSession";
import RouteLoading from "./components/RouteLoading";

const root = createRoot(document.getElementById("root")!);

async function startApp() {
  root.render(<RouteLoading />);
  try {
    await restoreAuthSession();
    // Import the router only after the cookie session has been restored.
    const { default: App } = await import("./App.tsx");
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch {
    root.render(
      <main className="flex min-h-dvh items-center justify-center bg-page-background p-6 text-primary-text">
        <div
          role="alert"
          className="rounded-2xl border border-control-border bg-card-background p-8 text-center"
        >
          <p>{i18n.t("networkError")}</p>
          <button
            type="button"
            onClick={() => void startApp()}
            className="mt-4 rounded-xl bg-accent px-5 py-2 text-accent-button-text"
          >
            {i18n.t("retry")}
          </button>
        </div>
      </main>,
    );
  }
}

void startApp();
