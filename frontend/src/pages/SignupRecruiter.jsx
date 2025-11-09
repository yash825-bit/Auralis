import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function SignupRecruiter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/api/recruiters/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        company: data.company || "",
      });

      addToast({ type: "success", message: "Account created — please login" });
      navigate("/login/recruiter");
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "Signup failed";
      addToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Recruiter Signup</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Full name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="mt-1 w-full p-2 border rounded"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Company (optional)
            </label>
            <input
              {...register("company")}
              type="text"
              className="mt-1 w-full p-2 border rounded"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="mt-1 w-full p-2 border rounded"
              placeholder="recruiter@company.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 chars" },
              })}
              type="password"
              className="mt-1 w-full p-2 border rounded"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size={16} />}
            <span>{loading ? "Creating account..." : "Create account"}</span>
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
