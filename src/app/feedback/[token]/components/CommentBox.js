'use client';

import { useState } from 'react';

export default function CommentBox({
  value,
  onChange,
  isRequired = false,
  error = false,
  maxLength = 500,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full max-w-135 mt-7 text-left">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-2.5">
        <span
          className={`text-[0.82rem] font-medium ${
            isRequired ? 'text-red-400' : 'text-zinc-400'
          }`}
        >
          {isRequired
            ? 'Please share what went wrong (required)'
            : 'Any suggestions? (optional)'}
        </span>
        <span className="text-[0.72rem] text-zinc-500 tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        rows={4}
        placeholder={
          isRequired
            ? 'Help us understand so we can improve…'
            : 'Tell us more about your experience…'
        }
        className={`
          w-full min-h-27.5 p-4 rounded-xl resize-y outline-none
          bg-white/3 text-zinc-100 text-[0.9rem] leading-relaxed
          placeholder:text-zinc-600
          border-[1.5px] transition-all duration-300
          ${
            focused
              ? 'border-zinc-500 shadow-[0_0_0_3px_rgba(255,255,255,0.04)]'
              : 'border-white/[0.07]'
          }
        `}
      />

      {/* Error */}
      <p
        className={`text-[0.78rem] text-red-400 mt-2 transition-opacity duration-200 ${
          error ? 'opacity-100' : 'opacity-0'
        }`}
      >
        This field is required when your overall rating is below 3.
      </p>
    </div>
  );
}
