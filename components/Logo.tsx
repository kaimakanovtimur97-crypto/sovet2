import React from "react";

export function Logo({ size = 26 }: { size?: number }) {
  const mark = Math.round(size * 1.08);
  return (
    <span className="logo" style={{ fontSize: size * 0.73 }}>
      <svg width={mark} height={mark} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="36" stroke="#2B3340" strokeWidth="10" />
        <path d="M50 14 a36 36 0 0 1 31 18" stroke="#3E6BFF" strokeWidth="10" strokeLinecap="round" />
        <path d="M35 57 L50 39 L65 57" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>совет<span style={{ color: "var(--accent)" }}>.</span></span>
    </span>
  );
}
