import ToastProvider from "./components/ToastProvider";
import DialogProvider from "./components/DialogProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Provider } from "react-redux";
import { store } from "./app/store";
import RouterLoading from "./components/RouterLoading";

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <DialogProvider>
          <RouterProvider router={router} />
          <RouterLoading router={router} />
        </DialogProvider>
      </ToastProvider>
    </Provider>
  );
}
