export default function StepLayout({ tag, question, hint, isActive, direction, children }) {
  let posClass = 'translate-y-12 opacity-0 pointer-events-none';
  if (isActive) posClass = 'translate-y-0 opacity-100 pointer-events-auto';
  else if (direction === 'above') posClass = '-translate-y-12 opacity-0 pointer-events-none';

  return (
    <div
      className={`
        absolute w-full max-w-135 px-7 flex flex-col items-center text-center
        transition-all duration-550 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${posClass}
      `}
    >
      {/* Tag */}
      <span
        className={`
          inline-block text-[0.68rem] font-semibold tracking-[0.2em] uppercase
          text-amber-500 bg-amber-500/10 px-3.5 py-1 rounded-full mb-5
          transition-all duration-500 delay-50
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}
        `}
      >
        {tag}
      </span>

      {/* Question */}
      <h2
        className={`
          font-serif text-[clamp(1.6rem,4vw,2.2rem)] font-normal leading-[1.2]
          text-zinc-100 mb-2
          transition-all duration-500 delay-120
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        {question}
      </h2>

      {/* Hint */}
      <p
        className={`
          text-[0.9rem] text-zinc-500 leading-relaxed max-w-100 mb-9
          transition-all duration-500 delay-180
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        {hint}
      </p>

      {/* Rating + optional extras */}
      <div
        className={`
          transition-all duration-500 delay-240 w-full flex flex-col items-center
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        {children}
      </div>
    </div>
  );
}
