import React from "react";

/**
 * RentFlow wordmark.
 * Brand system (do not change without sign-off):
 *   text   #1e1e1e
 *   strip  #9d5977
 *   canvas #ffffff
 *
 * Per branding rule: the "RENT | MANAGE | GROW" tagline only appears
 * on the Landing and Login pages. Everywhere else, pass showTagline={false}
 * (the default) to render just the wordmark + accent strip.
 */
export const RentFlowLogo = ({ className = "h-12 w-auto", showTagline = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={showTagline ? "0 0 500 160" : "0 0 500 120"}
    className={className}
    fill="none"
  >
    <rect width="100%" height="100%" fill="#ffffff" />

    <text
      x="50"
      y="90"
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontSize="68"
      fontWeight="400"
      fill="#1e1e1e"
      letterSpacing="-1.5"
    >
      RentFlow.
    </text>

    <rect x="145" y="102" width="310" height="7" rx="1" fill="#9d5977" />

    {showTagline && (
      <text
        x="120"
        y="126"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="11"
        fontWeight="500"
        fill="#1e1e1e"
        letterSpacing="4"
      >
        RENT | MANAGE | GROW
      </text>
    )}
  </svg>
);

export default RentFlowLogo;
