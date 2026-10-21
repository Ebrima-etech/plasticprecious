'use client';

// Shared pieces for multi-step forms: a progress header and Back / Continue / Submit buttons.
// The form keeps its own `step` state; its onSubmit advances until the last step, then submits.

import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

interface StepHeaderProps {
  steps: string[];
  current: number; // 0-based
  onJump?: (index: number) => void; // lets people go back to a finished step
}

export function StepHeader({ steps, current, onJump }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <p className="m-0 text-xs font-semibold text-emerald-700 mb-2">
        Step {current + 1} of {steps.length} · <span className="text-slate-900">{steps[current]}</span>
      </p>
      <ol className="flex gap-1.5 list-none p-0 m-0" aria-label="Form progress">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex-1 min-w-0">
              <button
                type="button"
                disabled={!done || !onJump}
                onClick={() => onJump?.(i)}
                aria-current={active ? 'step' : undefined}
                className="w-full text-left disabled:cursor-default group"
              >
                <span className={`block h-1.5 rounded-full transition-colors ${done || active ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <span className={`hidden sm:flex items-center gap-1 mt-1.5 text-[11px] font-semibold truncate ${active ? 'text-slate-900' : done ? 'text-emerald-700 group-hover:underline' : 'text-slate-400'}`}>
                  {done && <FiCheck className="w-3 h-3 flex-shrink-0" />}
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface StepNavProps {
  current: number;
  total: number;
  onBack: () => void;
  submitting?: boolean;
  submitLabel: string;
  submittingLabel?: string;
  tone?: 'emerald' | 'dark';
}

export function StepNav({ current, total, onBack, submitting, submitLabel, submittingLabel = 'Sending…', tone = 'emerald' }: StepNavProps) {
  const last = current === total - 1;
  const primary = tone === 'dark' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-700';
  return (
    <div className="flex items-center gap-3 pt-2">
      {current > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
        >
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <button
        type="submit"
        disabled={submitting}
        className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-white font-black disabled:opacity-60 transition ${primary}`}
      >
        {last ? (submitting ? submittingLabel : submitLabel) : (<>Continue <FiArrowRight className="w-4 h-4" /></>)}
      </button>
    </div>
  );
}
