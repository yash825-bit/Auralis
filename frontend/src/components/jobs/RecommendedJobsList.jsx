// src/components/jobs/RecommendedJobsList.jsx
import React from "react";
import JobCard from "./JobCard";

/**
 * Props:
 *  - jobs: array of job objects
 *  - loading: boolean
 */
export default function RecommendedJobsList({ jobs = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return <div className="text-gray-600">No recommended jobs found yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((j) => (
        <JobCard key={j.job_id || j.id} job={j} />
      ))}
    </div>
  );
}
