import { getAccessToken } from "../utils/authToken";
import AppLayout from "../components/AppLayout";
import NotFound from "./NotFound";

export default function MenuRouteLayout() {
  return getAccessToken() ? <AppLayout /> : <NotFound />;
}
