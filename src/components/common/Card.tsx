import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div
      className={`bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 m-0">
            {title}
          </h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

export default Card;
