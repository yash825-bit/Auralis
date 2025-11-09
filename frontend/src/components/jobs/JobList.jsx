// src/components/jobs/JobList.jsx
import React from "react";
import JobCard from "./JobCard";

export default function JobList({ jobs = [] }) {
  if (!jobs.length) {
    return <div className="text-gray-600">No jobs to show.</div>;
  }

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.job_id || j.id} job={j} />
      ))}
    </div>
  );
}
