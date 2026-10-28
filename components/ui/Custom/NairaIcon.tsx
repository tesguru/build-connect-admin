interface NairaIconProps {
  className?: string;
}

export function NairaIcon({ className }: NairaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 20V4l10 16V4" />
      <path d="M4 9.5h16" />
      <path d="M4 14.5h16" />
    </svg>
  );
}
