// VMFS Command Center - Main App with Routing and Theme Management
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import FrameworkPage from "./pages/Framework";
import PortfolioPage from "./pages/Portfolio";
import TreatyAdvisorPage from "./pages/TreatyAdvisor";
import CrowdsourcePage from "./pages/Crowdsource";
import "./App.css";

export default function App() {
  // Theme state management - defaults to light mode
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, default to 'light' if not found
    return localStorage.getItem('vmfs-theme') || 'light';
  });

  // Apply theme to document and save to localStorage whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vmfs-theme', theme);
  }, [theme]);

  // Toggle function to switch between light and dark modes
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<DashboardPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/framework" element={<FrameworkPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/portfolio" element={<PortfolioPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/treaty-advisor" element={<TreatyAdvisorPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/crowdsource" element={<CrowdsourcePage theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}