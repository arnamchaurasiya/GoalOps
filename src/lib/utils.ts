import { ScoreDirection } from './types';

/**
 * Compute a progress score (0–100) based on actual vs target
 */
export function computeScore(
  actual: number,
  target: number,
  direction: ScoreDirection,
  actualDate?: Date,
  targetDate?: Date
): number {
  if (target === 0) return 0;

  switch (direction) {
    case 'higher_better':
      return Math.min(100, Math.round((actual / target) * 100));

    case 'lower_better':
      if (actual === 0) return 100;
      return Math.min(100, Math.round((target / actual) * 100));

    case 'binary':
      return actual === 1 ? 100 : 0;

    case 'timeline':
      if (!actualDate || !targetDate) return 0;
      return actualDate <= targetDate ? 100 : Math.max(0, 50);

    default:
      return 0;
  }
}

/**
 * Validate goal sheet weightage rules
 */
export function validateGoalWeightage(weightages: number[]): {
  valid: boolean;
  total: number;
  errors: string[];
} {
  const errors: string[] = [];
  const total = weightages.reduce((sum, w) => sum + w, 0);

  if (weightages.length > 8) {
    errors.push('Maximum 8 goals allowed per cycle.');
  }

  if (weightages.some((w) => w < 10)) {
    errors.push('Each goal must have at least 10% weightage.');
  }

  if (Math.abs(total - 100) > 0.01) {
    errors.push(`Total weightage must equal 100%. Current total: ${total}%.`);
  }

  return { valid: errors.length === 0, total, errors };
}

/**
 * Format a progress status label
 */
export function getProgressLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400' };
  if (score >= 70) return { label: 'On Track', color: 'text-blue-400' };
  if (score >= 50) return { label: 'At Risk', color: 'text-amber-400' };
  return { label: 'Delayed', color: 'text-red-400' };
}

/**
 * Status chip color mapping
 */
export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-700 text-slate-300',
  submitted: 'bg-blue-900/60 text-blue-300',
  returned: 'bg-amber-900/60 text-amber-300',
  approved: 'bg-emerald-900/60 text-emerald-300',
  locked: 'bg-purple-900/60 text-purple-300',
  closed: 'bg-slate-800 text-slate-400',
  on_track: 'bg-emerald-900/60 text-emerald-300',
  at_risk: 'bg-amber-900/60 text-amber-300',
  delayed: 'bg-red-900/60 text-red-300',
  completed: 'bg-blue-900/60 text-blue-300',
};

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  returned: 'Returned',
  approved: 'Approved',
  locked: 'Locked',
  closed: 'Closed',
  on_track: 'On Track',
  at_risk: 'At Risk',
  delayed: 'Delayed',
  completed: 'Completed',
};
