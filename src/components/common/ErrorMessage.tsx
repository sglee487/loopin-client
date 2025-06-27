import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "오류가 발생했습니다.",
  className = "h-[60vh]",
}) => {
  return (
    <div
      className={`flex items-center justify-center text-red-600 ${className}`}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
