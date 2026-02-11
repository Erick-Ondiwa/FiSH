import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./features/farmer-dashboard/components/layout/DashboardLayout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/fish" element={<LandingPage />} />
        <Route path="/fish/aspiring-farmer" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
