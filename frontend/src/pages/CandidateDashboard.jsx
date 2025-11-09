// src/pages/CandidateDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import RecommendedJobsList from "../components/jobs/RecommendedJobsList";
import JobList from "../components/jobs/JobList";

/* Fallback mock data (used when API is unreachable) */
const MOCK_JOBS = [
  {
    job_id: "j1",
    title: "Frontend Developer",
    company: "Acme Co",
    similarity_score: 0.87,
    short_desc: "React, Tailwind, 2+ yrs",
  },
  {
    job_id: "j2",
    title: "Backend Engineer",
    company: "DataWorks",
    similarity_score: 0.74,
    short_desc: "Node.js, Express, MongoDB",
  },
  {
    job_id: "j3",
    title: "Fullstack Developer",
    company: "StartupX",
    similarity_score: 0.66,
    short_desc: "MERN stack",
  },
];

export default function CandidateDashboard() {
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loadingRec, setLoadingRec] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      setLoadingRec(true);
      try {
        const res = await api.get("/api/candidates/recommended_jobs");
        setRecommended(res.data || MOCK_JOBS);
      } catch (err) {
        console.warn("Recommended jobs fetch failed — using mock", err);
        setRecommended(MOCK_JOBS);
      } finally {
        setLoadingRec(false);
      }
    }

    async function fetchRecentApplications() {
      setLoadingRecent(true);
      try {
        const res = await api.get("/api/candidates/recent_applications");
        setRecent(res.data || []);
      } catch (err) {
        console.warn("Recent applications fetch failed — empty mock", err);
        setRecent([]);
      } finally {
        setLoadingRecent(false);
      }
    }

    fetchRecommended();
    fetchRecentApplications();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600">
            Here are jobs recommended for you based on your profile.
          </p>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recommended Jobs</h2>
        <RecommendedJobsList jobs={recommended} loading={loadingRec} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Applications</h2>
        {loadingRecent ? <div>Loading...</div> : <JobList jobs={recent} />}
      </section>
    </div>
  );
}
