'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';

import { useDemoGoals } from '@/lib/useDemoGoals';

export default function ManagerCheckinsPage() {
  const { goals: savedGoals } = useDemoGoals();
  const [comment, setComment] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiDraft, setAiDraft] = useState<string | null>(null);

  const ALICE_GOALS = savedGoals.map(g => ({
    id: g.id,
    title: g.data.title,
    weightage: Number(g.data.weightage) || 0,
    target: Number(g.data.target_value) || 0,
    actual: Number(g.actual_value) || 0,
    uom: g.data.uom_type === 'percentage' ? '%' : g.data.uom_type === 'number' ? '#' : g.data.uom_type
  }));

  const generateAiDraft = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/checkin-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: 'Alice Sharma',
          period: 'Q1 2026',
          goals: ALICE_GOALS.map((g) => ({ title: g.title, target: g.target, actual: g.actual, weightage: g.weightage })),
        }),
      });
      const data = await res.json();
      const draft = `${data.summary}\n\nCoaching questions:\n${data.coachingQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}`;
      setAiDraft(draft);
      setComment(draft);
    } catch {
      setComment('Alice has shown good progress in Q1, particularly on the test coverage and uptime goals. I would like to discuss the certification timeline in our next 1:1.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Q1 Check-in</h1>
          <p className="text-sm text-slate-400 mt-1">Alice Sharma · January 2026</p>
        </div>

        {!submitted ? (
          <>
            {/* Goals progress */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Goal Progress vs Target</h2>
              {ALICE_GOALS.map((goal) => {
                const progress = goal.uom === 'binary' ? (goal.actual >= goal.target ? 100 : 0) : Math.min(100, Math.round((goal.actual / goal.target) * 100));
                return (
                  <motion.div key={goal.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">{goal.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Weightage: {goal.weightage}%</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-200">
                          {goal.uom === 'binary' ? (goal.actual >= goal.target ? 'Achieved' : 'Not yet') : `${goal.actual}${goal.uom} / ${goal.target}${goal.uom}`}
                        </p>
                        <p className={`text-xs font-semibold ${progress >= 80 ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{progress}%</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Check-in comment */}
            <div className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Manager Check-in Comment</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateAiDraft}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/20 border border-amber-700/30 text-amber-300 text-xs font-semibold hover:bg-amber-900/30 transition-all"
                >
                  {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  AI Draft
                </motion.button>
              </div>
              {aiDraft && (
                <div className="px-3 py-2 rounded-lg bg-amber-900/10 border border-amber-700/20 text-xs text-amber-300">
                  ✨ AI draft applied — review and personalise before submitting
                </div>
              )}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                placeholder="Write your check-in observations, coaching notes, and next steps for Alice..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!comment.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send size={15} />
                Submit Check-in
              </motion.button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Check-in Submitted!</h2>
            <p className="text-slate-400 text-sm">Alice Sharma's Q1 check-in has been recorded and will appear in her profile and HR reports.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
