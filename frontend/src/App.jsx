import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./features/farmer-dashboard/components/layout/DashboardLayout";
import ChatPage from "./features/farmer-dashboard/components/layout/ChatPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/fish/aspiring-farmer" element={<DashboardLayout />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
