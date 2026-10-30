import ControlledDemo from "./views/ControlledDemo";
import ReportVerifier from "./views/ReportVerifier";
import ForgeView from "./views/ForgeView";

export default function App() {
  if (window.location.pathname === "/demo") return <ControlledDemo />;
  return window.location.pathname === "/verify" ? <ReportVerifier /> : <ForgeView />;
}


