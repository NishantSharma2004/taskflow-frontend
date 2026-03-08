import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import CalendarView from "./pages/CalendarView";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import AuthApp from "./AuthApp";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if a valid token exists in localStorage on page load
    const token = localStorage.getItem("tf_token");
    const user  = localStorage.getItem("tf_user");
    if (token && user) {
      setIsLoggedIn(true);
    }
    setChecking(false);
  }, []);

  // Listen for logout triggered inside AuthApp
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tf_token" && !e.newValue) {
        setIsLoggedIn(false);
      }
      if (e.key === "tf_token" && e.newValue) {
        setIsLoggedIn(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Small loading flash prevention
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f97316",
        fontSize: "24px",
        fontFamily: "sans-serif",
      }}>
        ⚡
      </div>
    );
  }

  // Not logged in → show Welcome / Login / Signup screens
  if (!isLoggedIn) {
    return <AuthApp onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Logged in → show the full TaskFlow dashboard
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout onLogout={() => {
            localStorage.removeItem("tf_token");
            localStorage.removeItem("tf_user");
            setIsLoggedIn(false);
          }}>
            <Routes>
              <Route path="/"          element={<Index />} />
              <Route path="/tasks"     element={<Tasks />} />
              <Route path="/calendar"  element={<CalendarView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
