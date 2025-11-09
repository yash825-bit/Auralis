import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo"/>
            </Link>
          </div>

          {/* Middle: Desktop nav links */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </nav>

          {/* Right: Auth actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 text-sm hover:bg-blue-50 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // simple user menu
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  Hi, <strong>{user.name || user.email}</strong>
                </span>
                <Link
                  to={
                    user.role === "recruiter"
                      ? "/dashboard/recruiter"
                      : "/dashboard/candidate"
                  }
                  className="text-sm text-gray-600 hover:underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-2 rounded-md focus:outline-none focus:ring"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-2">
              <Link
                onClick={() => setOpen(false)}
                to="/"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/about"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                About
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/jobs"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                Jobs
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/profile"
                className="px-2 py-2 rounded hover:bg-gray-100"
              >
                Profile
              </Link>

              <div className="border-t my-2" />

              {!user ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    to="/login"
                    className="block px-2 py-2 rounded bg-blue-600 text-white text-center"
                  >
                    Login
                  </Link>
                  <Link
                    onClick={() => setOpen(false)}
                    to="/signup"
                    className="block px-2 py-2 rounded border border-blue-600 text-blue-600 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    to={
                      user.role === "recruiter"
                        ? "/dashboard/recruiter"
                        : "/dashboard/candidate"
                    }
                    className="px-2 py-2 rounded hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="px-2 py-2 text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
