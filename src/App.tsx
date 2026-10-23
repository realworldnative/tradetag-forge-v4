import ReportVerifier from "./views/ReportVerifier";
import ForgeView from "./views/ForgeView";

export default function App() {
  return window.location.pathname === "/verify" ? <ReportVerifier /> : <ForgeView />;
}

