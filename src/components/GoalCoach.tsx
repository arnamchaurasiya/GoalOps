'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { GoalFormData, GoalCoachResponse } from '@/lib/types';

interface GoalCoachProps {
  goal: GoalFormData;
  onApply: (improved: Partial<GoalFormData>) => void;
  onClose: () => void;
}

export function GoalCoach({ goal, onApply, onClose }: GoalCoachProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GoalCoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCoach = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/goal-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: goal.title, description: goal.description, uom_type: goal.uom_type }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!response) return;
    onApply({
      title: response.improvedTitle,
      description: response.improvedDescription,
      uom_type: response.suggestedUom,
      score_direction: response.scoreDirection,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:w-[420px] h-[85vh] sm:h-screen rounded-2xl sm:rounded-l-2xl sm:rounded-r-none overflow-hidden flex flex-col"
        style={{ background: '#0f1929', border: '1px solid rgba(59,130,246,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">AI Goal Coach</p>
              <p className="text-xs text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Current goal */}
        <div className="p-5 border-b border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Current Goal</p>
          <p className="text-sm font-medium text-slate-300">{goal.title || '(No title yet)'}</p>
          {goal.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{goal.description}</p>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {!response && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-900/20 border border-amber-700/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-amber-400" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-2">Transform your goal into SMART format</p>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                AI will suggest an improved title, description, unit of measure, score direction, and flag any risks.
              </p>
              <button onClick={runCoach} disabled={!goal.title} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold mx-auto disabled:opacity-40 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                <Sparkles size={15} />
                Analyse & Improve
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="text-amber-400 animate-spin" />
              <p className="text-sm text-slate-400">Gemini is analysing your goal...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-center">
              <AlertTriangle size={20} className="text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-300">{error}</p>
              <button onClick={runCoach} className="mt-3 text-xs text-red-400 underline">Try again</button>
            </div>
          )}

          {response && (
            <div className="space-y-4">
              {/* Improved title */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Improved Title</p>
                <p className="text-sm font-medium text-slate-200">{response.improvedTitle}</p>
              </div>

              {/* Improved description */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Improved Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">{response.improvedDescription}</p>
              </div>

              {/* Suggestions row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-700/30">
                  <p className="text-xs text-blue-400 mb-1 uppercase tracking-wider">Suggested UoM</p>
                  <p className="text-sm font-semibold text-slate-200">{response.suggestedUom}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30">
                  <p className="text-xs text-emerald-400 mb-1 uppercase tracking-wider">Target</p>
                  <p className="text-sm font-semibold text-slate-200">{response.suggestedTarget}</p>
                </div>
              </div>

              {/* Risks */}
              {response.risks.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30">
                  <p className="text-xs text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle size={12} />Risks Flagged</p>
                  <ul className="space-y-1">
                    {response.risks.map((r, i) => (
                      <li key={i} className="text-xs text-amber-300 flex items-start gap-1.5"><span className="mt-1 shrink-0">•</span>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Coaching questions */}
              {response.coachingQuestions.length > 0 && (
                <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-700/30">
                  <p className="text-xs text-purple-400 mb-2 uppercase tracking-wider">Coaching Questions</p>
                  <ul className="space-y-1.5">
                    {response.coachingQuestions.map((q, i) => (
                      <li key={i} className="text-xs text-purple-300 flex items-start gap-1.5"><span className="text-purple-500 shrink-0">{i + 1}.</span>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {response && (
          <div className="p-4 border-t border-slate-800 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
              Dismiss
            </button>
            <button onClick={apply} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
              <CheckCircle2 size={15} />
              Apply Suggestions
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
