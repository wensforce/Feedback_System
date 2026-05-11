import { Check } from 'lucide-react';

export default function SuccessCard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-10 text-center animate-fade-in">
        <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Thank You!</h1>
        <p className="text-slate-600 leading-relaxed mb-8">
          Your feedback has been submitted successfully. We truly appreciate you sharing your experience — it helps us serve you better.
        </p>
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 font-medium">WENS Force — Client Feedback System</p>
        </div>
      </div>
    </div>
  );
}
