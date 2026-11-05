import RouteLoading from "./components/RouteLoading";
import { installSessionHistoryGuard } from "./utils/sessionHistory";
import { getAccessToken } from "./utils/authToken";
import {
  companiesLoader,
  selectCompanyAction,
  selectedCompanyLoader,
} from "./actions/companyActions";
import { resetPasswordAction } from "./actions/resetPasswordAction";
import { confirmEmailLoader } from "./actions/confirmEmailLoader";
import {
  homeLoader,
  loginLoader,
  logoutAction,
} from "./actions/sessionActions";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import {
  loginAction,
  signupAction,
  forgotPasswordAction,
  resendConfirmationAction,
} from "./actions/authActions";

installSessionHistoryGuard();

const routes: RouteObject[] = [
  {
    path: "/ResetPassword",
    lazy: async () => ({
      Component: (await import("./pages/ResetPassword")).default,
    }),
    action: resetPasswordAction,
  },

  {
    path: "/ConfirmEmail",
    lazy: async () => ({
      Component: (await import("./pages/ConfirmEmail")).default,
    }),
    loader: confirmEmailLoader,
  },
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./pages/MenuRouteLayout")).default,
    }),
    loader: () => (getAccessToken() ? homeLoader() : null),
    action: logoutAction,
    children: [
      { index: true, element: <Navigate to="/companies" replace /> },

      {
        path: "home",
        lazy: async () => ({
          Component: (await import("./pages/Home")).default,
        }),
        loader: selectedCompanyLoader,
      },
      {
        path: "accountingTrans/GeneralVoucher",
        lazy: async () => ({
          Component: (await import("./pages/JournalVoucher")).default,
        }),
        loader: selectedCompanyLoader,
      },

      {
        path: "accountingTrans/newJournalVoucher",
        lazy: async () => ({
          Component: (await import("./newJournalVoucher/NewJournalVoucherPage"))
            .default,
        }),
        loader: selectedCompanyLoader,
      },

      {
        path: "accountingTrans/SalesInvoice",
        lazy: async () => ({
          Component: (await import("./pages/SalesInvoice")).default,
        }),
        loader: selectedCompanyLoader,
      },

      {
        path: "companies",
        lazy: async () => ({
          Component: (await import("./pages/GetCompany")).default,
        }),
        loader: companiesLoader,
        action: selectCompanyAction,
      },
      {
        path: "*",
        lazy: async () => ({
          Component: (await import("./pages/MenuPage")).default,
        }),
        loader: (args) =>
          getAccessToken() ? selectedCompanyLoader(args) : null,
      },
    ],
  },
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("./pages/Login")).default }),
    loader: loginLoader,
    action: loginAction,
  },
  {
    path: "/signup",
    lazy: async () => ({ Component: (await import("./pages/SignUp")).default }),
    action: signupAction,
  },
  {
    path: "/forgot-password",
    lazy: async () => ({
      Component: (await import("./pages/ForgotPassword")).default,
    }),
    action: forgotPasswordAction,
  },
  {
    path: "/resend-confirmation",
    lazy: async () => ({
      Component: (await import("./pages/ResendConfirmation")).default,
    }),
    action: resendConfirmationAction,
  },
];

export const router = createBrowserRouter(
  routes.map((route) => ({ ...route, HydrateFallback: RouteLoading })),
);
