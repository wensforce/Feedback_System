import { Star, Car, User, Shield, Lock, MessageSquare } from 'lucide-react';

const ICON_MAP = {
  Star,
  Car,
  User,
  Shield,
  Lock,
  MessageSquare,
};

export default function StepBar({ steps, currentStep }) {
  return (
    <div className="w-full mb-10">
      {/* Progress bar with enhanced animation */}
      <div className="relative h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-4 px-2 gap-2">
        {steps.map((step, idx) => {
          const IconComponent = ICON_MAP[step.icon];
          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 transition-all duration-500 flex-1 min-w-0`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${
                  idx < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white scale-100'
                    : idx === currentStep
                    ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-lg'
                    : 'bg-white border-slate-300 text-slate-300 scale-100'
                }`}
              >
                {idx < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : IconComponent ? (
                  <IconComponent className="w-5 h-5" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-xs font-medium text-center line-clamp-2 text-slate-600">{step.label}</span>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-xs text-slate-500 mt-4 font-medium">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  );
}
