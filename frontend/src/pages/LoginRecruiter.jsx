import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function LoginRecruiter() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
        role: "recruiter",
      });
      addToast({ type: "success", message: "Logged in successfully" });
      navigate("/dashboard/recruiter");
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Login failed";
      addToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Recruiter Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="••••••••"
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
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size={16} />}
            <span>{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
