interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="28" height="28" rx="6" className="fill-emerald-500" />
        <path d="M8 14L12 10L16 14L12 18L8 14Z" className="fill-white" />
        <path d="M12 10L16 14L20 10L16 6L12 10Z" className="fill-white/70" />
        <path d="M12 18L16 14L20 18L16 22L12 18Z" className="fill-white/70" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
        Jade
      </span>
    </div>
  );
}
