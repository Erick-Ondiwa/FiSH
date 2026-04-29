import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import ContinueSetupPage from "./pages/ContinueSetup";
import LoginModal from "./components/auth/LoginModal";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/login" element={<ContinueSetupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
