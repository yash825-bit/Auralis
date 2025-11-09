// src/pages/RecruiterDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import JobList from "../components/jobs/JobList";

/* fallback */
const MOCK_POSTED = [
  {
    job_id: "p1",
    title: "Senior Backend Engineer",
    company: "TechCorp",
    short_desc: "Node, PostgreSQL",
  },
  {
    job_id: "p2",
    title: "Frontend Lead",
    company: "Designify",
    short_desc: "React, Typescript",
  },
];

export default function RecruiterDashboard() {
  const [posted, setPosted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosted() {
      setLoading(true);
      try {
        const res = await api.get("/api/recruiters/posted_jobs");
        setPosted(res.data || MOCK_POSTED);
      } catch (err) {
        console.warn("Fetch posted jobs failed — using mock", err);
        setPosted(MOCK_POSTED);
      } finally {
        setLoading(false);
      }
    }
    fetchPosted();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <p className="text-gray-600">
          Manage your job postings and view top candidates.
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Job Posts</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Post a Job
          </button>
        </div>

        <div className="mt-4">
          {loading ? <div>Loading...</div> : <JobList jobs={posted} />}
        </div>
      </section>
    </div>
  );
}
