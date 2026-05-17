'use client';

import { AppShell } from '@/components/AppShell';
import { StatusChip } from '@/components/StatusChip';
import { GoalCoach } from '@/components/GoalCoach';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Target, Plus, Trash2, Sparkles, AlertCircle, CheckCircle2, Lock, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { GoalFormData, UomType, ScoreDirection } from '@/lib/types';
import { validateGoalWeightage } from '@/lib/utils';
import { useDemoGoals, PersistedGoal } from '@/lib/useDemoGoals';

const THRUST_AREAS = [
  { id: 'thrust-growth-0-0000-000000000001', name: 'Revenue Growth', color: 'text-emerald-400' },
  { id: 'thrust-ops-000-0000-000000000002', name: 'Operational Excellence', color: 'text-blue-400' },
  { id: 'thrust-people-0-0000-000000000003', name: 'People Development', color: 'text-purple-400' },
  { id: 'thrust-tech-000-0000-000000000004', name: 'Technology & Innovation', color: 'text-cyan-400' },
  { id: 'thrust-cust-000-0000-000000000005', name: 'Customer Delight', color: 'text-amber-400' },
];



interface GoalCard { id: string; data: GoalFormData; expanded: boolean; }

export default function GoalsPage() {
  const { goals: savedGoals, status: savedStatus, isLoaded, saveGoals } = useDemoGoals();
  const [goals, setGoals] = useState<GoalCard[]>([]);
  const [coachGoalId, setCoachGoalId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [status, setStatus] = useState(savedStatus);
  const [submitted, setSubmitted] = useState(false);

  // Initialize from hook
  useEffect(() => {
    if (isLoaded) {
      setGoals(savedGoals.map(g => ({ ...g, expanded: false })));
      setStatus(savedStatus);
      if (savedStatus === 'submitted' || savedStatus === 'locked') {
        setSubmitted(true);
      }
    }
  }, [isLoaded, savedGoals, savedStatus]);

  const weightages = goals.map((g) => Number(g.data.weightage) || 0);
  const validation = validateGoalWeightage(weightages);
  const allFilled = goals.every((g) => g.data.title && g.data.thrust_area_id);
  const canSubmit = validation.valid && allFilled;

  const addGoal = () => {
    if (goals.length >= 8) return;
    const id = Date.now().toString();
    setGoals([...goals, { id, data: { thrust_area_id: '', title: '', description: '', uom_type: 'number', score_direction: 'higher_better', target_value: '', target_date: '', weightage: '' }, expanded: true }]);
  };

  const removeGoal = (id: string) => setGoals(goals.filter((g) => g.id !== id));
  const updateGoal = (id: string, field: keyof GoalFormData, value: string) =>
    setGoals(goals.map((g) => g.id === id ? { ...g, data: { ...g.data, [field]: value } } : g));
  const toggleExpand = (id: string) =>
    setGoals(goals.map((g) => g.id === id ? { ...g, expanded: !g.expanded } : g));
  const applyCoach = (id: string, improved: Partial<GoalFormData>) => {
    setGoals(goals.map((g) => g.id === id ? { ...g, data: { ...g.data, ...improved } } : g));
    setCoachGoalId(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('submitted');
    saveGoals(goals.map(g => ({ id: g.id, data: g.data })), 'submitted');
    setSubmitted(true);
    setSubmitLoading(false);
  };

  if (submitted) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto text-center py-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Goal Sheet Submitted!</h2>
          <p className="text-slate-400 text-sm">Sent to Bob Mehta for approval. You'll be notified once reviewed.</p>
          <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-left space-y-2">
            {[['Goal sheet sent to manager', 'emerald'], ['Goals lock after approval', 'purple'], ['Q1 window opens April 1', 'blue']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">My Goals</h1>
            <p className="text-sm text-slate-400 mt-1">FY 2026 Annual · Draft</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusChip status="draft" />
            <button onClick={addGoal} disabled={goals.length >= 8} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all disabled:opacity-40">
              <Plus size={15} /> Add Goal
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_260px] gap-6">
          {/* Goals list */}
          <div className="space-y-3">
            <AnimatePresence>
              {goals.map((goal, idx) => {
                const thrust = THRUST_AREAS.find((t) => t.id === goal.data.thrust_area_id);
                return (
                  <motion.div key={goal.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-700/20" onClick={() => toggleExpand(goal.id)}>
                      <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{goal.data.title || 'Untitled Goal'}</p>
                        {thrust && <p className={`text-xs ${thrust.color} mt-0.5`}>{thrust.name}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {goal.data.weightage && <span className="text-sm font-bold text-slate-200">{goal.data.weightage}%</span>}
                        <button onClick={(e) => { e.stopPropagation(); setCoachGoalId(goal.id); }} className="p-1.5 rounded-lg hover:bg-amber-900/30 text-amber-400 transition-colors" title="AI Goal Coach"><Sparkles size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); removeGoal(goal.id); }} className="p-1.5 rounded-lg hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        {goal.expanded ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {goal.expanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-700/60 overflow-hidden">
                          <div className="p-4 space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Thrust Area *</label>
                              <select value={goal.data.thrust_area_id} onChange={(e) => updateGoal(goal.id, 'thrust_area_id', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                <option value="">Select...</option>
                                {THRUST_AREAS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Goal Title *</label>
                              <input type="text" value={goal.data.title} onChange={(e) => updateGoal(goal.id, 'title', e.target.value)} placeholder="e.g., Increase uptime to 99.9%" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                              <textarea value={goal.data.description} onChange={(e) => updateGoal(goal.id, 'description', e.target.value)} rows={2} placeholder="Scope, approach, success criteria..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Unit of Measure</label>
                                <select value={goal.data.uom_type} onChange={(e) => updateGoal(goal.id, 'uom_type', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                  <option value="number">Number (#)</option>
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="binary">Binary (Yes/No)</option>
                                  <option value="currency">Currency (₹)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Target Value</label>
                                <input type="number" value={goal.data.target_value} onChange={(e) => updateGoal(goal.id, 'target_value', e.target.value)} placeholder="e.g., 95" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Score Direction</label>
                                <select value={goal.data.score_direction} onChange={(e) => updateGoal(goal.id, 'score_direction', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                  <option value="higher_better">Higher is Better</option>
                                  <option value="lower_better">Lower is Better</option>
                                  <option value="binary">Binary (Hit/Miss)</option>
                                  <option value="timeline">Timeline</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Weightage (%)</label>
                                <input type="number" value={goal.data.weightage} onChange={(e) => updateGoal(goal.id, 'weightage', e.target.value)} placeholder="Min 10%" min="10" max="100" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Target Date</label>
                              <input type="date" value={goal.data.target_date} onChange={(e) => updateGoal(goal.id, 'target_date', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Validation sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4 sticky top-20">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Validation</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Total Weightage</span>
                  <span className={`font-bold ${validation.total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{validation.total}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div className={`h-full rounded-full ${validation.total === 100 ? 'bg-emerald-500' : validation.total > 100 ? 'bg-red-500' : 'bg-amber-500'}`} animate={{ width: `${Math.min(validation.total, 100)}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: `${goals.length} / 8 goals`, ok: goals.length <= 8 && goals.length > 0 },
                  { label: 'Min 10% per goal', ok: goals.every((g) => Number(g.data.weightage) >= 10) },
                  { label: 'Total = 100%', ok: validation.total === 100 },
                  { label: 'All titles filled', ok: allFilled },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2 text-xs">
                    {rule.ok ? <CheckCircle2 size={13} className="text-emerald-400" /> : <AlertCircle size={13} className="text-amber-400" />}
                    <span className={rule.ok ? 'text-slate-400' : 'text-amber-400'}>{rule.label}</span>
                  </div>
                ))}
              </div>
              {validation.errors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                  {validation.errors.map((err) => (
                    <p key={err} className="text-xs text-red-400 flex items-start gap-1.5"><AlertCircle size={11} className="mt-0.5 shrink-0" />{err}</p>
                  ))}
                </div>
              )}
              <motion.button whileHover={{ scale: canSubmit ? 1.02 : 1 }} whileTap={{ scale: canSubmit ? 0.98 : 1 }} onClick={handleSubmit} disabled={!canSubmit || submitLoading} className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${canSubmit ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                {submitLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={15} /> Submit to Manager</>}
              </motion.button>
              <p className="text-xs text-slate-600 text-center mt-2">Sends to Bob Mehta for approval</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-amber-700/20">
              <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-amber-400" /><p className="text-xs font-semibold text-amber-300">AI Goal Coach</p></div>
              <p className="text-xs text-slate-400">Click ✨ on any goal to get AI-powered SMART suggestions, risk flags, and UoM recommendations.</p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {coachGoalId && (
            <GoalCoach goal={goals.find((g) => g.id === coachGoalId)!.data} onApply={(improved) => applyCoach(coachGoalId, improved)} onClose={() => setCoachGoalId(null)} />
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
