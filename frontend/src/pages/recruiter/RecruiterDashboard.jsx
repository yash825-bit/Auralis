import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logout from "../../services/logout";
import {
  getCurrentUser,
  createJob,
  getMyJobs,
  getJobApplications,
} from "../../services/api";
import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-jobs");
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    employment_type: "",
  });

  useEffect(() => {
    loadUserData();
    if (activeTab === "my-jobs") {
      loadMyJobs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedJobId) {
      loadJobApplications(selectedJobId);
    }
  }, [selectedJobId]);

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

  const loadMyJobs = async () => {
    setLoading(true);
    const response = await getMyJobs();
    if (!response.error) {
      setJobs(response);
    }
    setLoading(false);
  };

  const loadJobApplications = async (jobId) => {
    setLoading(true);
    const response = await getJobApplications(jobId);
    if (!response.error) {
      setApplications(response);
    }
    setLoading(false);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await createJob(newJob);
    if (!response.error) {
      alert("Job created successfully!");
      setNewJob({ title: "", description: "", location: "", employment_type: "" });
      setShowCreateForm(false);
      loadMyJobs();
    } else {
      alert(response.message || "Failed to create job");
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
          colorStops={["#3A29FF", "#FF94B4", "#4079ff"]}
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF94B4] via-[#4079ff] to-[#FF94B4] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent">
                Recruiter Dashboard
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
            {["my-jobs", "create-job"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedJobId(null);
                  setApplications([]);
                }}
                className={`px-6 py-3 capitalize font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-pink-400 text-pink-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* My Jobs Tab */}
          {activeTab === "my-jobs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-pink-300">
                  My Job Postings
                </h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-4 py-2 rounded-lg bg-pink-600/80 hover:bg-pink-600 transition-colors"
                >
                  {showCreateForm ? "Cancel" : "+ Create New Job"}
                </button>
              </div>

              {showCreateForm && (
                <SpotlightCard spotlightColor="rgba(255, 148, 180, 0.2)">
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.title}
                        onChange={(e) =>
                          setNewJob({ ...newJob, title: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newJob.description}
                        onChange={(e) =>
                          setNewJob({ ...newJob, description: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                        rows="4"
                        placeholder="Job description..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={newJob.location}
                          onChange={(e) =>
                            setNewJob({ ...newJob, location: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                          placeholder="e.g., Remote, New York, NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Employment Type
                        </label>
                        <select
                          value={newJob.employment_type}
                          onChange={(e) =>
                            setNewJob({ ...newJob, employment_type: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                        >
                          <option value="">Select type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Job"}
                    </button>
                  </form>
                </SpotlightCard>
              )}

              {loading ? (
                <div className="text-center py-12">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">
                    You haven't posted any jobs yet.
                  </p>
                </SpotlightCard>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <SpotlightCard
                      key={job.id}
                      className="hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                      spotlightColor="rgba(255, 148, 180, 0.2)"
                      onClick={() =>
                        setSelectedJobId(
                          selectedJobId === job.id ? null : job.id
                        )
                      }
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-pink-300 mb-2">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">
                              📍 {job.location}
                            </p>
                            {job.employment_type && (
                              <p className="text-sm text-gray-400 mb-2">
                                💼 {job.employment_type}
                              </p>
                            )}
                            {job.description && (
                              <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                                {job.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Posted: {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {selectedJobId === job.id ? "▼" : "▶"}
                          </span>
                        </div>

                        {selectedJobId === job.id && (
                          <div className="pt-4 border-t border-white/10">
                            <h4 className="text-lg font-semibold text-pink-300 mb-4">
                              Applications
                            </h4>
                            {loading ? (
                              <p className="text-gray-400">Loading applications...</p>
                            ) : applications.length === 0 ? (
                              <p className="text-gray-400">No applications yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {applications.map((app) => (
                                  <div
                                    key={app.id}
                                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-sm text-gray-300">
                                          Application ID: {app.id}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                          Candidate ID: {app.candidate_id}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          app.status === "applied"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : app.status === "accepted"
                                            ? "bg-green-500/20 text-green-300"
                                            : app.status === "rejected"
                                            ? "bg-red-500/20 text-red-300"
                                            : "bg-gray-500/20 text-gray-300"
                                        }`}
                                      >
                                        {app.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Job Tab */}
          {activeTab === "create-job" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-pink-300 mb-4">
                Create New Job Posting
              </h2>
              <SpotlightCard spotlightColor="rgba(255, 148, 180, 0.2)">
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newJob.title}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) =>
                        setNewJob({ ...newJob, description: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                      rows="6"
                      placeholder="Job description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.location}
                        onChange={(e) =>
                          setNewJob({ ...newJob, location: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                        placeholder="e.g., Remote, New York, NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Employment Type
                      </label>
                      <select
                        value={newJob.employment_type}
                        onChange={(e) =>
                          setNewJob({ ...newJob, employment_type: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </form>
              </SpotlightCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
