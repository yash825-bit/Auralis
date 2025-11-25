import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logout from "../../services/logout";
import { getCurrentUser, getAllUsers, getAdminJobs } from "../../services/api";
import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeUsers: 0,
    candidates: 0,
    recruiters: 0,
  });

  useEffect(() => {
    loadUserData();
    if (activeTab === "overview") {
      loadOverview();
    } else if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "jobs") {
      loadJobs();
    }
  }, [activeTab]);

  const loadUserData = async () => {
    const response = await getCurrentUser();
    if (response.error) {
      if (response.message.includes("token") || response.message.includes("Invalid")) {
        navigate("/login");
      }
    } else {
      setUser(response);
    }
    setLoading(false);
  };

  const loadOverview = async () => {
    setLoading(true);
    const [usersRes, jobsRes] = await Promise.all([
      getAllUsers(),
      getAdminJobs(),
    ]);

    if (!usersRes.error) {
      setUsers(usersRes);
      const active = usersRes.filter((u) => u.is_active).length;
      const candidates = usersRes.filter((u) => u.role === "candidate").length;
      const recruiters = usersRes.filter((u) => u.role === "recruiter").length;

      setStats({
        totalUsers: usersRes.length,
        activeUsers: active,
        candidates,
        recruiters,
        totalJobs: jobsRes.error ? 0 : jobsRes.length,
      });
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (!response.error) {
      setUsers(response);
    }
    setLoading(false);
  };

  const loadJobs = async () => {
    setLoading(true);
    const response = await getAdminJobs();
    if (!response.error) {
      setJobs(response);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await logout({ token });
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF3232", "#FF94B4"]}
          blend={0.5}
          amplitude={0.6}
          speed={2}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF3232] via-[#FF94B4] to-[#FF3232] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              {user && (
                <p className="text-sm text-gray-400 mt-1">
                  Welcome, {user.name} ({user.email})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {["overview", "users", "jobs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 capitalize font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-red-400 text-red-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-red-300 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SpotlightCard spotlightColor="rgba(255, 50, 50, 0.2)">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-red-300">
                      {stats.totalUsers}
                    </p>
                  </div>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(255, 50, 50, 0.2)">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Active Users</p>
                    <p className="text-3xl font-bold text-green-300">
                      {stats.activeUsers}
                    </p>
                  </div>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(255, 50, 50, 0.2)">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Total Jobs</p>
                    <p className="text-3xl font-bold text-blue-300">
                      {stats.totalJobs}
                    </p>
                  </div>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(255, 50, 50, 0.2)">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Candidates</p>
                    <p className="text-3xl font-bold text-sky-300">
                      {stats.candidates}
                    </p>
                  </div>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(255, 50, 50, 0.2)">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Recruiters</p>
                    <p className="text-3xl font-bold text-pink-300">
                      {stats.recruiters}
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-red-300">
                  All Users
                </h2>
                <Link
                  to="/admin/dashboard/users"
                  className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-colors"
                >
                  View Detailed Table
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-12">Loading users...</div>
              ) : users.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">No users found.</p>
                </SpotlightCard>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {users.map((u) => (
                    <SpotlightCard
                      key={u.id}
                      className="hover:scale-[1.02] transition-all duration-300"
                      spotlightColor="rgba(255, 50, 50, 0.2)"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-red-300">
                              {u.name}
                            </h3>
                            <p className="text-sm text-gray-400">{u.email}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.is_active
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {u.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-sm text-gray-400">
                            Role: <span className="text-gray-300">{u.role}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-red-300 mb-4">
                All Jobs
              </h2>
              {loading ? (
                <div className="text-center py-12">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">No jobs found.</p>
                </SpotlightCard>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <SpotlightCard
                      key={job.id}
                      className="hover:scale-[1.02] transition-all duration-300"
                      spotlightColor="rgba(255, 50, 50, 0.2)"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-red-300 mb-2">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            📍 {job.location}
                          </p>
                          {job.employment_type && (
                            <p className="text-sm text-gray-400 mb-2">
                              💼 {job.employment_type}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Recruiter ID: {job.recruiter_id}
                          </p>
                        </div>
                        {job.description && (
                          <p className="text-gray-300 text-sm line-clamp-3">
                            {job.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
