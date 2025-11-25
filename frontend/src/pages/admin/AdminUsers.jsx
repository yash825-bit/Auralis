import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../../components/admin/UserTable";
import { getAllUsers } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (response.error) {
      if (response.message.includes("token") || response.message.includes("Invalid")) {
        navigate("/login");
      } else {
        alert(response.message || "Failed to load users");
      }
    } else {
      setUsers(response);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#06071a] via-[#071233] to-[#041028] text-slate-200 px-6 py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-300">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Viewing all{" "}
          <span className="text-sky-400 font-medium">{users.length}</span> users
        </p>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading users...</div>
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </main>
  );
}
