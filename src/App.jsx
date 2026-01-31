// VMFS Command Center - Main App with Routing
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import FrameworkPage from "./pages/Framework";
import MechanismsPage from "./pages/Mechanisms";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/framework" element={<FrameworkPage />} />
        <Route path="/mechanisms" element={<MechanismsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
