import JournalVoucher from './pages/JournalVoucher';
import ModulePage from "./pages/ModulePage";
import GetCompany from "./pages/GetCompany";
import {
  companiesLoader,
  selectCompanyAction,
  selectedCompanyLoader,
} from "./actions/companyActions";
import ResetPassword from "./pages/ResetPassword";
import { resetPasswordAction } from "./actions/resetPasswordAction";
import ConfirmEmail from "./pages/ConfirmEmail";
import { confirmEmailLoader } from "./actions/confirmEmailLoader";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import { homeLoader, logoutAction } from "./actions/sessionActions";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResendConfirmation from "./pages/ResendConfirmation";
import {
  loginAction,
  signupAction,
  forgotPasswordAction,
  resendConfirmationAction,
} from "./actions/authActions";
import ReceiptVoucherForm from './pages/ReceiptVoucher';

export const router = createBrowserRouter([
  {
    path: "/ResetPassword",
    element: <ResetPassword />,
    action: resetPasswordAction,
  },
  // { path: "/reset-password", element: <ResetPassword />, action: resetPasswordAction },
  {
    path: "/confirm-email",
    element: <ConfirmEmail />,
    loader: confirmEmailLoader,
  },
  {
    path: "/ConfirmEmail",
    element: <ConfirmEmail />,
    loader: confirmEmailLoader,
  },
  {
    path: "/",
    element: <AppLayout />,
    loader: homeLoader,
    action: logoutAction,
    children: [
      { path: "accountingTrans/GeneralVoucher", element: <JournalVoucher />, loader: selectedCompanyLoader },

      //ReceiptVoucherForm سند قبض 
      {  path: "accountingTrans/ReceiptVoucher",element: <ReceiptVoucherForm />, loader: selectedCompanyLoader,},
      //
      
      { index: true, element: <Navigate to="/companies" replace /> },
      { path: "home", element: <Home />, loader: selectedCompanyLoader },
      {
        path: "companies",
        element: <GetCompany />,
        loader: companiesLoader,
        action: selectCompanyAction,
      },
      { path: "*", element: <ModulePage />, loader: selectedCompanyLoader },
    ],
  },
  { path: "/login", element: <Login />, action: loginAction },
  { path: "/signup", element: <SignUp />, action: signupAction },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    action: forgotPasswordAction,
  },
  {
    path: "/resend-confirmation",
    element: <ResendConfirmation />,
    action: resendConfirmationAction,
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
