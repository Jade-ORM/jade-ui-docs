interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Jade"
      >
        <title>Jade</title>
        <path
          d="M18 9 H46 L55 18 V46 L46 55 H18 L9 46 V18 L18 9 Z"
          fill="#3F8F6E"
          stroke="#3F8F6E"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M33.5 21.5 V36 C33.5 41.8 28.8 46.5 23 46.5 C17.2 46.5 12.5 41.8 12.5 36 V34"
          stroke="#E8F3EE"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="16.5" y="17.5" width="21" height="9" rx="3.5" fill="#E8F3EE" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
        Jade
      </span>
    </div>
  );
}
