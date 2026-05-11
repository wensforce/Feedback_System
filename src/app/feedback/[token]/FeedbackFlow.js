'use client';

import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import StarRating from './components/StarRating';
import CommentBox from './components/CommentBox';
import StepLayout from './components/StepLayout';
import StateScreen from './components/StateScreen';

const LABEL_MAP = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Okay',
  4: 'Great',
  5: 'Excellent',
};

function buildSteps(hasCar, hasBodyguard) {
  const steps = [
    {
      key: 'overallExperience',
      tag: 'Overall Experience',
      question: 'How was your overall experience?',
      hint: 'Rate the complete experience from start to finish.',
      labels: ['Terrible', 'Poor', 'Okay', 'Great', 'Excellent'],
    },
  ];

  if (hasCar) {
    steps.push(
      {
        key: 'vehicleCondition',
        tag: 'Vehicle Quality',
        question: 'How was the vehicle?',
        hint: 'Consider the comfort, cleanliness, and overall quality of the vehicle.',
        labels: ['Terrible', 'Poor', 'Okay', 'Great', 'Excellent'],
      },
      {
        key: 'chauffeurProfessionalism',
        tag: 'Chauffeur',
        question: 'How was your chauffeur?',
        hint: 'Think about their professionalism, driving, and overall conduct.',
        labels: ['Terrible', 'Poor', 'Okay', 'Great', 'Excellent'],
      }
    );
  }

  if (hasBodyguard) {
    steps.push({
      key: 'bodyguardProfessionalism',
      tag: 'Bodyguard',
      question: 'How was your bodyguard?',
      hint: 'Consider their attentiveness, professionalism, and discretion.',
      labels: ['Terrible', 'Poor', 'Okay', 'Great', 'Excellent'],
    });
  }

  steps.push(
    {
      key: 'safetyAndSecurity',
      tag: 'Safety & Security',
      question: 'How safe did you feel?',
      hint: 'Rate how secure and protected you felt throughout the service.',
      labels: ['Very Unsafe', 'Unsafe', 'Neutral', 'Safe', 'Very Safe'],
    },
    {
      key: 'coordinationAndCommunication',
      tag: 'Coordination',
      question: 'How was the coordination?',
      hint: 'Rate the team\'s communication, punctuality, and overall coordination.',
      labels: ['Terrible', 'Poor', 'Okay', 'Great', 'Excellent'],
      isFinal: true,
    }
  );

  return steps;
}

export default function FeedbackFlow({ token, hasCar, hasBodyguard }) {
  const allSteps = buildSteps(hasCar, hasBodyguard);
  const labelMap = {
    overallExperience: 'Overall Experience',
    vehicleCondition: 'Vehicle Quality',
    chauffeurProfessionalism: 'Chauffeur',
    bodyguardProfessionalism: 'Bodyguard',
    safetyAndSecurity: 'Safety & Security',
    coordinationAndCommunication: 'Coordination',
  };

  const [screen, setScreen] = useState('loading');
  const [stepIndex, setStepIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentStep = allSteps[stepIndex];
  const isLast = stepIndex === allSteps.length - 1;
  const hasRating = currentStep ? ratings[currentStep.key] != null : false;

  // Calculate average rating
  const ratingValues = Object.values(ratings).filter((r) => typeof r === 'number');
  const averageRating = ratingValues.length > 0 ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : 0;
  const commentRequired = averageRating < 2.5;

  const canProceed = (() => {
    if (!hasRating) return false;
    if (isLast && commentRequired && !comment.trim()) return false;
    return true;
  })();

  // Load assignment
  useEffect(() => {
    setScreen('feedback');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (screen !== 'feedback') return;

    const handler = (e) => {
      if (document.activeElement?.tagName === 'TEXTAREA') return;

      if ((e.key === 'ArrowRight' || e.key === 'Enter') && canProceed) onNext();
      if (e.key === 'ArrowLeft' && stepIndex > 0) onBack();

      const n = parseInt(e.key);
      if (n >= 1 && n <= 5 && currentStep) {
        onRate(n);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, stepIndex, canProceed, currentStep]);

  function onRate(val) {
    setRatings((prev) => ({ ...prev, [currentStep.key]: val }));
  }

  function onNext() {
    if (!canProceed) return;

    if (isLast) {
      if (commentRequired && !comment.trim()) {
        setCommentError(true);
        return;
      }
      submitFeedback();
      return;
    }

    setCommentError(false);
    setStepIndex((i) => i + 1);
  }

  function onBack() {
    if (stepIndex > 0) {
      setCommentError(false);
      setStepIndex((i) => i - 1);
    }
  }

  async function submitFeedback() {
    setSubmitting(true);

    try {
      const body = {
        overallExperience: ratings.overallExperience,
        vehicleCondition: ratings.vehicleCondition,
        chauffeurProfessionalism: ratings.chauffeurProfessionalism,
        bodyguardProfessionalism: ratings.bodyguardProfessionalism,
        safetyAndSecurity: ratings.safetyAndSecurity,
        coordinationAndCommunication: ratings.coordinationAndCommunication,
        comments: comment.trim() || null,
      };

      const res = await fetch(`/api/feedback?encryptId=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setScreen('error');
        setSubmitting(false);
        return;
      }

      setScreen('success');
    } catch {
      setScreen('error');
      setSubmitting(false);
    }
  }

  /* ════════════════════════════════ STATE SCREENS ════════════════════════════════ */

  if (screen === 'loading') return <StateScreen variant="loading" />;
  if (screen === 'success') return <StateScreen variant="success" />;
  if (screen === 'error')
    return (
      <StateScreen
        variant="error"
        title="Unable to submit"
        description="Something went wrong. Please try again."
        onRetry={() => {
          setSubmitting(false);
          setScreen('feedback');
        }}
      />
    );

  /* ════════════════════════════════ MAIN FEEDBACK FLOW ════════════════════════════════ */

  return (
    <div className="fixed inset-0 flex flex-col bg-[#111113] text-zinc-100">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-7 py-4.5 border-b border-white/[0.07] shrink-0 max-[600px]:px-5 max-[600px]:py-3.5">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          WENS FORCE
        </span>
        <ProgressBar current={stepIndex} total={allSteps.length} />
      </header>

      {/* ── Steps area ── */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <div className="w-full relative flex items-center justify-center min-h-100">
          {allSteps.map((step, i) => {
            const isActive = i === stepIndex;
            const direction = i < stepIndex ? 'above' : 'below';

            return (
              <StepLayout
                key={step.key}
                tag={step.tag}
                question={step.question}
                hint={step.hint}
                isActive={isActive}
                direction={direction}
              >
                <StarRating
                  value={ratings[step.key] || 0}
                  onChange={onRate}
                  labels={step.labels}
                />

                {step.isFinal && (
                  <CommentBox
                    value={comment}
                    onChange={(val) => {
                      setComment(val);
                      setCommentError(false);
                    }}
                    isRequired={commentRequired}
                    error={commentError}
                  />
                )}
              </StepLayout>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-between px-7 py-4 border-t border-white/[0.07] shrink-0 max-[600px]:px-5 max-[600px]:py-3.5">
        {/* Back */}
        <button
          onClick={onBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-2 px-4 py-3 text-[0.88rem] text-zinc-500 bg-transparent border-none rounded-[10px]
            hover:text-zinc-100 transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        {/* Next / Submit */}
        <button
          onClick={onNext}
          disabled={!canProceed || submitting}
          className={`
            relative flex items-center gap-2 px-6 py-3 rounded-[10px] text-[0.88rem] font-medium
            transition-all duration-300 cursor-pointer border-none
            ${
              canProceed && !submitting
                ? 'bg-zinc-100 text-zinc-900 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,255,255,0.08)]'
                : 'bg-zinc-800 text-zinc-600 pointer-events-none opacity-40'
            }
          `}
        >
          <span className={submitting ? 'opacity-0' : ''}>
            {isLast ? 'Submit Feedback' : 'Next'}
          </span>
          {!isLast && !submitting && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
          {submitting && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4.5 h-4.5 border-2 border-transparent border-t-zinc-900 rounded-full animate-spin" />
            </span>
          )}
        </button>
      </footer>
    </div>
  );
}
