import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import HomeSurface from "../components/HomeSurface";
export default function Home() {
  const company = useLoaderData<Company>();
  return <HomeSurface company={company} />;
}
