'use client';

import { useState, ReactNode } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  children: ReactNode;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export function MultiStepForm({
  steps,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  loading = false,
  currentStep = 0,
  onStepChange
}: MultiStepFormProps) {
  const [step, setStep] = useState(currentStep);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      onStepChange?.(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      onStepChange?.(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      {steps.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{steps[step].title}</h3>
              {steps[step].description && (
                <p className="text-xs text-slate-600 mt-1">{steps[step].description}</p>
              )}
            </div>
            <span className="text-xs font-medium text-slate-500">
              {step + 1} / {steps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              Next
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
