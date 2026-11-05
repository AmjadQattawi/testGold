import { useSyncExternalStore } from "react";
import type { createBrowserRouter } from "react-router-dom";
import RouteLoading from "./RouteLoading";

export default function RouterLoading({ router }: { router: ReturnType<typeof createBrowserRouter> }) {
  const pending = useSyncExternalStore(
    router.subscribe,
    () => router.state.initialized && router.state.navigation.state !== "idle",
    () => false,
  );
  // Initial lazy routes show their HydrateFallback; navigation uses this overlay.
  return pending ? <RouteLoading overlay /> : null;
}
