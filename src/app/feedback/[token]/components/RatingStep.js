'use client';

import { Star, Car, User, Shield, Lock, MessageSquare } from 'lucide-react';
import StarPicker from './StarPicker';

const LABEL_MAP = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const ICON_MAP = {
  Star,
  Car,
  User,
  Shield,
  Lock,
  MessageSquare,
};

export default function RatingStep({ step, value, onChange, onNext, onBack, isFirst, isLast, currentStep, totalSteps }) {
  const IconComponent = ICON_MAP[step.icon];

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-6 group">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <span className="text-3xl">{step.icon}</span>
        )}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.label}</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-sm">{step.description}</p>

      <StarPicker value={value} onChange={onChange} />

      {value ? (
        <p className="text-sm font-semibold text-blue-600 mb-8 animate-fade-in">{LABEL_MAP[value]}</p>
      ) : (
        <p className="text-sm text-slate-400 mb-8">Select a rating</p>
      )}

      <div className="flex gap-3 w-full">
        {!isFirst && (
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all duration-300"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!value}
          className="flex-1 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
