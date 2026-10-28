import React from "react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "h-5 w-5" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}

interface LoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({ label = "Loading...", className = "" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-24 ${className}`}>
      <Spinner className="h-8 w-8 text-blue-600" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export function SectionLoader({ label = "Loading...", className = "" }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center gap-2.5 py-12 ${className}`}>
      <Spinner className="h-5 w-5 text-blue-600" />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
