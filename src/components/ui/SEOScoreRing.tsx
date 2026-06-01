import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

interface SEOScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export const SEOScoreRing: React.FC<SEOScoreRingProps> = ({
  score,
  size = 120,
  className,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [offset]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: "url(#scoreGradientGreen)", text: "text-emerald-400", label: "Excellent" };
    if (s >= 60) return { stroke: "url(#scoreGradientBlue)", text: "text-cyan-400", label: "Good" };
    if (s >= 40) return { stroke: "url(#scoreGradientYellow)", text: "text-yellow-400", label: "Fair" };
    return { stroke: "url(#scoreGradientRed)", text: "text-red-400", label: "Poor" };
  };

  const { stroke, text, label } = getScoreColor(score);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scoreGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00C4CC" />
          </linearGradient>
          <linearGradient id="scoreGradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C4CC" />
            <stop offset="100%" stopColor="#007BFF" />
          </linearGradient>
          <linearGradient id="scoreGradientYellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="scoreGradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#FF4EAD" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />

        {/* Score arc */}
        <circle
          ref={circleRef}
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 50 50)"
          filter="url(#glow)"
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Score text */}
        <text x="50" y="46" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="700" fill="currentColor" className={text}>
          {score}
        </text>
        <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(148,163,184,0.8)">
          SEO SCORE
        </text>
      </svg>

      <span className={cn("text-xs font-semibold", text)}>{label}</span>
    </div>
  );
};

export default SEOScoreRing;
