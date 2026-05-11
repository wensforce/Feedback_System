const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

/* Icons */
const icons = {
  error: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  clock: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

const iconStyles = {
  error: 'bg-red-500/10 text-red-400',
  clock: 'bg-zinc-800 text-zinc-500',
  check: 'bg-emerald-500/10 text-emerald-400',
};

/* Mini star row */
function MiniStars({ count }) {
  return (
    <span className="flex gap-0.75">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-4 h-4">
          <path
            d={STAR_PATH}
            fill={i < count ? '#d4a843' : 'none'}
            stroke={i < count ? '#d4a843' : '#5c5c66'}
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </span>
  );
}

export default function StateScreen({
  variant,
  title,
  description,
  onRetry,
}) {
  /* Loading */
  if (variant === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111113]">
        <div className="w-9 h-9 border-[2.5px] border-white/[0.07] border-t-zinc-400 rounded-full animate-spin" />
        <p className="mt-5 text-[0.85rem] text-zinc-500 tracking-wide">
          Loading your experience…
        </p>
      </div>
    );
  }

  /* Success */
  if (variant === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111113]">
        <div className="mb-7">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#3ecf6e" strokeWidth="2" opacity="0.3" />
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="#3ecf6e"
              strokeWidth="2"
              strokeDasharray="164"
              strokeDashoffset="164"
              className="animate-drawCircle"
            />
            <polyline
              points="18,29 25,36 38,22"
              stroke="#3ecf6e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              className="animate-drawCheck"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-zinc-100 mb-2.5">Thank you!</h2>
        <p className="text-[0.92rem] text-zinc-400 leading-relaxed max-w-85 text-center">
          Your feedback helps us deliver a better experience. We truly appreciate your time.
        </p>
      </div>
    );
  }

  /* Already Submitted - Simple success view */
  if (variant === 'submitted') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111113]">
        <div className="mb-7">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#3ecf6e" strokeWidth="2" opacity="0.3" />
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="#3ecf6e"
              strokeWidth="2"
              strokeDasharray="164"
              strokeDashoffset="164"
              className="animate-drawCircle"
            />
            <polyline
              points="18,29 25,36 38,22"
              stroke="#3ecf6e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              className="animate-drawCheck"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-zinc-100 mb-2.5">Thank you!</h2>
        <p className="text-[0.92rem] text-zinc-400 leading-relaxed max-w-85 text-center">
          Thank you for giving your valuable feedback. We appreciate your time and insights.
        </p>
      </div>
    );
  }

  /* Error / Not Completed */
  const iconKey = variant === 'error' ? 'error' : 'clock';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111113] p-8">
      <div className="text-center max-w-120 w-full flex flex-col items-center">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${iconStyles[iconKey]}`}>
          {icons[iconKey]}
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl text-zinc-100 mb-2.5">{title}</h2>

        {/* Description */}
        <p className="text-[0.92rem] text-zinc-400 leading-relaxed max-w-85 text-center">
          {description}
        </p>

        {/* Retry button */}
        {variant === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 px-6 py-3 rounded-[10px] border border-white/[0.14] text-zinc-100 text-[0.88rem] font-medium
              bg-transparent hover:border-zinc-500 transition-all duration-300 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
