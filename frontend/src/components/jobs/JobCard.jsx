// src/components/jobs/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  // Accept both job.job_id or job.id
  const id = job?.job_id || job?.id || "unknown";
  const scorePct = job?.similarity_score
    ? Math.round(job.similarity_score * 100)
    : null;

  return (
    <article className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {job?.title || "Untitled Role"}
          </h3>
          <p className="text-sm text-gray-500">
            {job?.company || "Unknown company"}
          </p>
        </div>

        {scorePct != null && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Match</div>
            <div className="mt-1 inline-block text-sm font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              {scorePct}%
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-600">
        {job?.short_desc ||
          job?.description?.slice?.(0, 120) ||
          "No description available."}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <Link
          to={`/jobs/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View details →
        </Link>
        <button
          type="button"
          className="text-sm bg-green-600 text-white px-3 py-1 rounded"
        >
          Apply
        </button>
      </div>
    </article>
  );
}
