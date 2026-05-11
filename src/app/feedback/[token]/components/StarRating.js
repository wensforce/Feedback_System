'use client';

import { useState } from 'react';

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export default function StarRating({ value = 0, onChange, labels = [] }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          const active = n === display && (hovered || value === n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => setHovered(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              className={`
                w-13 h-13 rounded-xl flex items-center justify-center
                border-[1.5px] transition-all duration-300 cursor-pointer
                outline-none
                ${
                  filled
                    ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'border-white/[0.07] bg-white/3 hover:bg-white/6 hover:border-white/[0.14]'
                }
                ${active ? 'border-amber-500/60 shadow-[0_0_0_3px_rgba(212,168,67,0.12)]' : ''}
                hover:-translate-y-0.5
                max-[600px]:w-12 max-[600px]:h-12
                max-[380px]:w-10 max-[380px]:h-10
              `}
            >
              <svg
                viewBox="0 0 24 24"
                className={`
                w-6.5 h-6.5 transition-transform duration-300
                max-[600px]:w-5.5 max-[600px]:h-5.5
                  max-[380px]:w-5 max-[380px]:h-5
                  ${active ? 'scale-110' : ''}
                `}
              >
                <path
                  d={STAR_PATH}
                  fill="none"
                  stroke={filled ? 'transparent' : '#5c5c66'}
                  strokeWidth="1.8"
                  className="transition-all duration-300"
                />
                <path
                  d={STAR_PATH}
                  fill="#d4a843"
                  stroke="#d4a843"
                  strokeWidth="1"
                  className="transition-all duration-300 origin-center"
                  style={{
                    opacity: filled ? 1 : 0,
                    transform: filled ? 'scale(1)' : 'scale(0.5)',
                  }}
                />
              </svg>
            </button>
          );
        })}
      </div>

      <span
        className={`text-[0.82rem] min-h-5 transition-all duration-300 ${
          display > 0 ? 'text-amber-400 font-medium' : 'text-zinc-500'
        }`}
      >
        {display > 0 ? labels[display - 1] || '' : ''}
      </span>
    </div>
  );
}
