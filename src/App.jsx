import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg text-gray-100">
        <nav className="flex justify-between items-center bg-card px-8 py-4 shadow-lg sticky top-0 z-50">
          <h1 className="text-2xl font-bold text-accent">AI Task System</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:text-accent">💬 Chat</Link>
            <Link to="/dashboard" className="hover:text-accent">📊 Dashboard</Link>
          </div>
        </nav>

        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
