import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import NavBar from "./components/common/Navbar";

// Pages
import Home from "./pages/Home";
import LoginChoice from "./pages/LoginChoice";
import SignupChoice from "./pages/SignupChoice";
import LoginCandidate from "./pages/LoginCandidate";
import LoginRecruiter from "./pages/LoginRecruiter";
import SignupCandidate from "./pages/SignupCandidate";
import SignupRecruiter from "./pages/SignupRecruiter";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// Optional ProtectedRoute if you use it
// import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <NavBar />

          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Role choice pages */}
              <Route path="/login" element={<LoginChoice />} />
              <Route path="/signup" element={<SignupChoice />} />

              {/* Role-specific auth pages */}
              <Route path="/login/candidate" element={<LoginCandidate />} />
              <Route path="/login/recruiter" element={<LoginRecruiter />} />
              <Route path="/signup/candidate" element={<SignupCandidate />} />
              <Route path="/signup/recruiter" element={<SignupRecruiter />} />

              {/* App pages */}
              <Route
                path="/dashboard/candidate"
                element={
                  <ProtectedRoute allowedRoles={["candidate"]}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/recruiter"
                element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20">404 — Page not found</div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
