import ToastProvider from "./components/ToastProvider";
import DialogProvider from "./components/DialogProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return (
    <ToastProvider>
      <DialogProvider>
        <RouterProvider router={router} />
      </DialogProvider>
    </ToastProvider>
  );
}
