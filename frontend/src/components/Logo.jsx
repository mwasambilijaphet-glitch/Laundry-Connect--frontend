/**
 * LaundryConnect Logo — Custom SVG
 * A modern washing machine icon with water droplet accent
 */
export function LogoIcon({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Machine body */}
      <rect x="8" y="6" width="48" height="52" rx="12" fill="url(#grad1)" />
      <rect x="8" y="6" width="48" height="52" rx="12" stroke="url(#grad2)" strokeWidth="2" />

      {/* Top panel */}
      <rect x="12" y="10" width="40" height="12" rx="6" fill="white" fillOpacity="0.15" />

      {/* Control dots */}
      <circle cx="20" cy="16" r="2.5" fill="#22c55e" />
      <circle cx="28" cy="16" r="2.5" fill="white" fillOpacity="0.4" />
      <circle cx="36" cy="16" r="2.5" fill="white" fillOpacity="0.4" />

      {/* Power indicator */}
      <rect x="42" y="13" width="6" height="6" rx="2" fill="#22c55e" fillOpacity="0.6" />

      {/* Drum window */}
      <circle cx="32" cy="38" r="15" fill="url(#drumGrad)" />
      <circle cx="32" cy="38" r="15" stroke="white" strokeWidth="2" strokeOpacity="0.2" />

      {/* Inner drum */}
      <circle cx="32" cy="38" r="11" fill="url(#innerGrad)" />

      {/* Water swirl */}
      <path
        d="M25 35C27 31 31 30 35 32C39 34 37 40 33 41C29 42 26 39 25 35Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M29 37C30 35 33 34 35 36C37 38 35 40 33 40.5C31 41 29 39 29 37Z"
        fill="white"
        fillOpacity="0.15"
      />

      {/* Water droplet accent */}
      <path
        d="M50 8C50 8 54 13 54 16C54 18.2 52.2 20 50 20C47.8 20 46 18.2 46 16C46 13 50 8 50 8Z"
        fill="#22c55e"
      />
      <circle cx="49" cy="14.5" r="1" fill="white" fillOpacity="0.6" />

      {/* Sparkle */}
      <path d="M14 4L15.5 7L14 10L12.5 7Z" fill="#22c55e" fillOpacity="0.6" />
      <path d="M11 7H17" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4" />

      <defs>
        <linearGradient id="grad1" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="grad2" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" stopOpacity="0.3" />
          <stop offset="1" stopColor="#2563EB" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="drumGrad" cx="32" cy="38" r="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0f172a" />
        </radialGradient>
        <radialGradient id="innerGrad" cx="30" cy="36" r="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1e40af" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ size = 'md', className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
    xl: { icon: 56, text: 'text-4xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={s.icon} />
      <span className={`${s.text} font-extrabold tracking-tight font-display`}>
        <span className="text-white">Laundry</span>
        <span className="text-fresh-400">Connect</span>
      </span>
    </div>
  );
}

export function LogoFullDark({ size = 'md', className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
    xl: { icon: 56, text: 'text-4xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={s.icon} />
      <span className={`${s.text} font-extrabold tracking-tight font-display`}>
        <span className="text-slate-800 dark:text-white">Laundry</span>
        <span className="text-fresh-500 dark:text-fresh-400">Connect</span>
      </span>
    </div>
  );
}

export default LogoIcon;
