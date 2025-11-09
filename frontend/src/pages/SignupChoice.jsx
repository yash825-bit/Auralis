import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignupChoice() {
  const nav = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Create an account</h2>
        <p className="text-gray-600 mb-6">
          Sign up as a candidate or a recruiter
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => nav("/signup/candidate")}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Candidate Signup
          </button>

          <button
            onClick={() => nav("/signup/recruiter")}
            className="w-full sm:w-auto px-6 py-3 border border-green-600 text-green-600 rounded-md font-medium hover:bg-green-50 transition"
          >
            Recruiter Signup
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => nav("/login")}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
