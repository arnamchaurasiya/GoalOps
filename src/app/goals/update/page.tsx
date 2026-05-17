'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { StatusChip } from '@/components/StatusChip';
import { useDemoGoals } from '@/lib/useDemoGoals';

export default function GoalUpdatePage() {
  const { goals: savedGoals, status, isLoaded, saveGoals } = useDemoGoals();
  const [actuals, setActuals] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Load actuals if they exist
  useEffect(() => {
    if (isLoaded) {
      const loadedActuals: Record<string, string> = {};
      savedGoals.forEach(g => {
        if (g.actual_value) loadedActuals[g.id] = g.actual_value;
      });
      if (Object.keys(loadedActuals).length > 0) {
        setActuals(loadedActuals);
      }
    }
  }, [isLoaded, savedGoals]);

  const GOALS = savedGoals.map(g => ({
    id: g.id,
    title: g.data.title,
    weightage: Number(g.data.weightage) || 0,
    target: Number(g.data.target_value) || 0,
    uom: g.data.uom_type === 'percentage' ? '%' : g.data.uom_type === 'number' ? '#' : g.data.uom_type,
    direction: g.data.score_direction,
    locked: status === 'locked'
  }));

  const computeScore = (goal: typeof GOALS[0]) => {
    const actual = Number(actuals[goal.id] || 0);
    if (goal.direction === 'binary') return actual >= goal.target ? 100 : 0;
    if (goal.direction === 'higher_better') return Math.min(100, Math.round((actual / goal.target) * 100));
    if (goal.direction === 'lower_better') return actual === 0 ? 100 : Math.min(100, Math.round((goal.target / actual) * 100));
    return 0;
  };

  const totalScore = GOALS.reduce((sum, g) => sum + (computeScore(g) * g.weightage) / 100, 0);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Q1 Progress Update</h1>
            <p className="text-sm text-slate-400 mt-1">Enter your actual achievements for Q1 2026</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Weighted Score</p>
            <p className={`text-3xl font-bold ${totalScore >= 80 ? 'text-emerald-400' : totalScore >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>{Math.round(totalScore)}%</p>
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="space-y-4">
              {GOALS.map((goal, i) => {
                const score = computeScore(goal);
                const actual = Number(actuals[goal.id] || 0);
                return (
                  <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock size={13} className="text-purple-400 shrink-0" />
                          <p className="text-sm font-semibold text-slate-200">{goal.title}</p>
                        </div>
                        <p className="text-xs text-slate-500">Target: {goal.target}{goal.uom !== 'binary' ? goal.uom : ''} · Weight: {goal.weightage}%</p>
                      </div>
                      <StatusChip status="locked" size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                          Actual Achievement {goal.uom !== 'binary' ? `(${goal.uom})` : ''}
                        </label>
                        {goal.uom === 'binary' ? (
                          <select value={actuals[goal.id]} onChange={(e) => setActuals({ ...actuals, [goal.id]: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                            <option value="1">Yes — Achieved</option>
                            <option value="0">No — Not Achieved</option>
                          </select>
                        ) : (
                          <input type="number" value={actuals[goal.id]} onChange={(e) => setActuals({ ...actuals, [goal.id]: e.target.value })} placeholder={`Target: ${goal.target}`} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Progress Score</p>
                        <div className="flex items-center gap-3 pt-2">
                          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} animate={{ width: `${score}%` }} transition={{ duration: 0.6 }} />
                          </div>
                          <span className={`text-sm font-bold w-12 text-right ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>{score}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Comments / Context</label>
                      <input type="text" value={comments[goal.id] || ''} onChange={(e) => setComments({ ...comments, [goal.id]: e.target.value })} placeholder="Any context, blockers, or notes..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="glass-card rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Overall Weighted Score: <span className={`text-lg font-bold ${totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{Math.round(totalScore)}%</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Weighted average across all goal scores</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => {
                  const updatedGoals = savedGoals.map(g => ({ ...g, actual_value: actuals[g.id] || '' }));
                  saveGoals(updatedGoals, status);
                  setSubmitted(true);
                }} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
              >
                <TrendingUp size={15} /> Submit Q1 Update
              </motion.button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Q1 Update Submitted!</h2>
            <p className="text-slate-400 text-sm">Your weighted score: <span className="text-emerald-400 font-bold">{Math.round(totalScore)}%</span>. Bob Mehta will review and complete the check-in.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
