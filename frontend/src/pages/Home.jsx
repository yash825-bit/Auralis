import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Find the <span className="text-blue-600">Right Job</span> or{" "}
          <span className="text-blue-600">Candidate</span> Instantly
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          An AI-powered recruitment platform that connects candidates and
          recruiters with smart matching based on skills, experience, and job
          requirements.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            AI Matching
          </h3>
          <p className="text-gray-600">
            Automatically matches resumes and job postings using NLP to find the
            best fit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Smart Dashboards
          </h3>
          <p className="text-gray-600">
            Personalized dashboards for candidates and recruiters to track
            applications.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Secure Authentication
          </h3>
          <p className="text-gray-600">
            Role-based login and signup with secure token handling for both
            users.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </footer>
    </div>
  );
}
