// src/pages/AdminPanel.jsx
import React from "react";

export default function AdminPanel() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
      <p className="text-gray-600">
        This is the Admin Panel page. You can manage users, jobs, and system
        settings here.
      </p>
    </div>
  );
}
