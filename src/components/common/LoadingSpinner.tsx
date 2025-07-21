import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading…",
  className = "h-[60vh]",
}) => {
  return (
    <div
      className={`flex items-center justify-center text-lg font-semibold ${className}`}
    >
      {message}
    </div>
  );
};

export default LoadingSpinner;
