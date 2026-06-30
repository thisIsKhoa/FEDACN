import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean;
  iconOnly?: boolean;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  light = false, 
  iconOnly = false,
  height = "40px"
}) => {
  if (iconOnly) {
    return (
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${className}`}
        style={{ height }}
      >
        <rect width="40" height="40" rx="8" fill="#4F46E5"/>
        <circle cx="14" cy="14" r="3" fill="white"/>
        <circle cx="26" cy="14" r="3" fill="white"/>
        <circle cx="14" cy="26" r="3" fill="white"/>
        <circle cx="26" cy="26" r="3" fill="white"/>
        <path d="M14 14L26 26" stroke="white" stroke-width="1.5"/>
        <path d="M26 14L14 26" stroke="white" stroke-width="1.5"/>
      </svg>
    );
  }

  return (
    <svg 
      width="200" 
      height="60" 
      viewBox="0 0 200 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      style={{ height }}
    >
      {/* Logo Icon: Interconnected Nodes */}
      <rect width="40" height="40" rx="8" fill="#4F46E5"/>
      <circle cx="14" cy="14" r="3" fill="white"/>
      <circle cx="26" cy="14" r="3" fill="white"/>
      <circle cx="14" cy="26" r="3" fill="white"/>
      <circle cx="26" cy="26" r="3" fill="white"/>
      <path d="M14 14L26 26" stroke="white" stroke-width="1.5"/>
      <path d="M26 14L14 26" stroke="white" stroke-width="1.5"/>
      
      {/* Logo Text */}
      <text 
        x="55" 
        y="32" 
        fontFamily="Inter, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        fill={light ? "#FFFFFF" : "#0F172A"}
        className={light ? "fill-white" : "fill-slate-900 dark:fill-white"}
      >
        Co
      </text>
      <text 
        x="88" 
        y="32" 
        fontFamily="Inter, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        fill="#4F46E5"
      >
        Space
      </text>
    </svg>
  );
};

export default Logo;
