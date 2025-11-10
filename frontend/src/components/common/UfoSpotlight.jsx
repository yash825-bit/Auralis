import React, { useState, useEffect } from "react";

// Redesigned UFO Icon with more detail and depth
const UfoIcon = ({ lit = false, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 120"
    className={className}
    aria-label="UFO Icon"
  >
    <defs>
      {/* Gradients for a more metallic, 3D look */}
      <linearGradient id="ufo-hull-top" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#dbe2e6" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#a7b8c1" />
      </linearGradient>
      <linearGradient id="ufo-hull-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#546e7a" />
        <stop offset="50%" stopColor="#90a4ae" />
        <stop offset="100%" stopColor="#546e7a" />
      </linearGradient>

      {/* Dome with a subtle glow */}
      <radialGradient id="ufo-dome" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#cce7ff" />
        <stop offset="70%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </radialGradient>

      {/* Pulsing engine light */}
      <radialGradient id="engine-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      
      {/* Abduction beam light color */}
      <radialGradient id="ufo-light-beam" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
        <stop offset="100%" stopColor="#facc15" stopOpacity="0.1" />
      </radialGradient>
      
      {/* Underside glow for when the beam is active */}
      <radialGradient id="ufo-glow-active" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(250, 204, 21, 0.6)" />
        <stop offset="100%" stopColor="rgba(250, 204, 21, 0)" />
      </radialGradient>
      
      {/* Filter for a soft overall glow */}
      <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g style={{ filter: 'url(#soft-glow)' }}>
      {/* Bottom part of the hull */}
      <ellipse cx="100" cy="68" rx="70" ry="18" fill="url(#ufo-hull-bottom)" />
      
      {/* Main body/rim of the hull */}
      <ellipse cx="100" cy="62" rx="84" ry="24" fill="url(#ufo-hull-top)" />
      <path d="M 16 62 C 16 49, 184 49, 184 62" fill="#b0bec5" />

      {/* Dome */}
      <ellipse cx="100" cy="42" rx="46" ry="24" fill="url(#ufo-dome)" />
      {/* Dome shine */}
      <ellipse cx="95" cy="36" rx="18" ry="10" fill="white" opacity="0.3" />
      
      {/* Antenna */}
      <path d="M 100 18 L 100 10" stroke="#b0bec5" strokeWidth="2" />
      <circle cx="100" cy="8" r="3" fill="#facc15" />

      {/* Rim lights */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const isLit = lit || (i % 3 === 0); // Keep some lights always on
        return (
          <circle
            key={i}
            cx={100 + Math.cos(angle) * 72}
            cy={62 + Math.sin(angle) * 12}
            r={3}
            fill={lit ? "#fef08a" : "#6ee7b7"}
            opacity={isLit ? 1 : 0.4}
            className="transition-opacity duration-500"
          />
        );
      })}

      {/* Central engine light (always on with a pulse animation) */}
      <circle cx="100" cy="70" r="12" fill="url(#engine-glow)" className="animate-pulse-slow" />
      <circle cx="100" cy="70" r="6" fill="#1f2937" />

      {/* Underside glow (only when beam is on) */}
      {lit && <ellipse cx="100" cy="96" rx="60" ry="12" fill="url(#ufo-glow-active)" />}
    </g>
  </svg>
);

export default function UfoSpotlight({ smallText, largeText, className }) {
  const [ufoY, setUfoY] = useState(10);
  const [stage, setStage] = useState("approach"); // approach → abduct → exit
  const [textPulled, setTextPulled] = useState(false);

  useEffect(() => {
    let timer;
    switch (stage) {
      case "approach":
        setUfoY(40);
        timer = setTimeout(() => setStage("abduct"), 3000); // Shortened for quicker demo
        break;
      case "abduct":
        setTextPulled(true);
        timer = setTimeout(() => setStage("textReturn"), 2500);
        break;
      case "textReturn":
        setUfoY(-30);
        timer = setTimeout(() => {setTextPulled(false);}, 2000);
        timer = setTimeout(() => setStage("exit"), 3000);
        break;
      case "exit":
        timer = setTimeout(() => {
          setUfoY(0);
          setStage("approach");
        }, 2500);
        break;
      default:
        break;
    }
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div>
      {/* UFO */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all [transition-duration:2500ms] ease-in-out"
        style={{ top: `${ufoY}%` }}
      >
        <div className="relative animate-float">
          {/* Beam - goes first, behind UFO */}
          {stage === "abduct" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[50%] w-[280px] h-[360px] origin-top z-0"
              style={{
                clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0% 100%)",
                background:
                  "radial-gradient(ellipse at top, rgba(250, 204, 21, 0.4) 0%, transparent 70%)",
              }}
            />
          )}
        
          {/* UFO - above the beam */}
          <UfoIcon className="w-48 h-auto drop-shadow-2xl z-10 relative" lit={stage === "abduct"} />
        </div>
      </div>

      {/* Text */}
      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-center w-full px-4">
        <div
          className={`transition-all duration-1000`}
          style={{
            opacity: textPulled ? 0 : 1,
            transform: textPulled
              ? "translateY(-200%) scale(0.3)"
              : "translateY(0) scale(1)",
          }}
        >
          <p className="text-sm md:text-base text-blue-300 mb-2 tracking-wider">
            {smallText}
          </p>
          <h1 className="text-2xl md:text-5xl font-bold text-red-400 tracking-tight">
            {largeText}
          </h1>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
