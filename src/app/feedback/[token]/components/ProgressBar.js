export default function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-3.5">
      <span className="text-[0.78rem] text-zinc-500 whitespace-nowrap">
        Step {current + 1} of {total}
      </span>
      <div className="w-25 h-0.75 bg-zinc-800 rounded-full overflow-hidden max-[600px]:w-17.5">
        <div
          className="h-full bg-zinc-100 rounded-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
