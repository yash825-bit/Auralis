import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-black backdrop-blur-md border-t border-white/20 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left side - Animated brand */}
        <h2
          onClick={() => navigate("/home")}
          className="cursor-pointer text-2xl md:mt-xl font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg transition-transform hover:scale-105"
        >
          Auralis
        </h2>

        {/* Right side - Copyright */}
        <p className="text-xs text-white/70 mt-4 md:mt-0">
          © {new Date().getFullYear()} Auralis. All rights reserved.
        </p>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          animation: gradient-text 5s ease infinite;
        }
      `}</style>
    </footer>
  );
}
