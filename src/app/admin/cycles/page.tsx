'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { StatusChip } from '@/components/StatusChip';

const CYCLES = [
  { id: 'cycle-2026', name: 'FY 2026 Annual', fiscal_year: '2026', status: 'goal_setting' as const, goal_open_date: '2026-01-01', goal_close_date: '2026-03-31', periods: ['Q1', 'Q2', 'Q3', 'Q4'] },
  { id: 'cycle-2025', name: 'FY 2025 Annual', fiscal_year: '2025', status: 'closed' as const, goal_open_date: '2025-01-01', goal_close_date: '2025-03-31', periods: ['Q1', 'Q2', 'Q3', 'Q4'] },
];

export default function CyclesPage() {
  const [showNew, setShowNew] = useState(false);
  const [newCycle, setNewCycle] = useState({ name: '', fiscal_year: '', goal_open_date: '', goal_close_date: '' });
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    setCreated(true);
    setShowNew(false);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Cycle Management</h1>
            <p className="text-sm text-slate-400 mt-1">Create and manage performance cycles and quarterly windows</p>
          </div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/20">
            <Plus size={15} /> New Cycle
          </button>
        </div>

        {created && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/30">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <p className="text-sm text-emerald-300">New cycle created successfully!</p>
          </div>
        )}

        {showNew && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 border border-purple-700/30 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Create New Cycle</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Cycle Name</label>
                <input type="text" value={newCycle.name} onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })} placeholder="e.g., FY 2027 Annual" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Fiscal Year</label>
                <input type="text" value={newCycle.fiscal_year} onChange={(e) => setNewCycle({ ...newCycle, fiscal_year: e.target.value })} placeholder="e.g., 2027" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Goal Setting Opens</label>
                <input type="date" value={newCycle.goal_open_date} onChange={(e) => setNewCycle({ ...newCycle, goal_open_date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Goal Setting Closes</label>
                <input type="date" value={newCycle.goal_close_date} onChange={(e) => setNewCycle({ ...newCycle, goal_close_date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700 hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors">Create Cycle</button>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {CYCLES.map((cycle, i) => (
            <motion.div key={cycle.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/30 flex items-center justify-center"><Calendar size={18} className="text-purple-400" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{cycle.name}</p>
                    <p className="text-xs text-slate-500">FY {cycle.fiscal_year} · Goal window: {cycle.goal_open_date} → {cycle.goal_close_date}</p>
                  </div>
                </div>
                <StatusChip status={cycle.status === 'goal_setting' ? 'submitted' : 'closed'} size="sm" />
              </div>
              <div className="mt-4 flex gap-2">
                {cycle.periods.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-400 border border-slate-700">{p}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
