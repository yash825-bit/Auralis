// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MOCK_USER = {
  name: "John Doe",
  email: "john@example.com",
  role: "candidate",
  resume: null,
};

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await api.get("/api/me");
        setProfile(res.data || profile);
      } catch (err) {
        console.warn("Profile fetch failed — using user or mock", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <div className="text-lg">{profile?.name}</div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="text-lg">{profile?.email}</div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Role</label>
          <div className="text-lg">{profile?.role}</div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editing && (
          <div className="mt-4">
            {/* quick editing stub */}
            <p className="text-sm text-gray-500">
              Editing UI goes here — wire up fields and save to the API.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
