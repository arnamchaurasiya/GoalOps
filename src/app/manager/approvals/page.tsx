'use client';

import { AppShell } from '@/components/AppShell';
import { StatusChip } from '@/components/StatusChip';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Edit2, Lock, Users, ClipboardList, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useDemoGoals } from '@/lib/useDemoGoals';

const THRUST_AREAS = [
  { id: 'thrust-growth-0-0000-000000000001', name: 'Revenue Growth', color: 'text-emerald-400' },
  { id: 'thrust-ops-000-0000-000000000002', name: 'Operational Excellence', color: 'text-blue-400' },
  { id: 'thrust-people-0-0000-000000000003', name: 'People Development', color: 'text-purple-400' },
  { id: 'thrust-tech-000-0000-000000000004', name: 'Technology & Innovation', color: 'text-cyan-400' },
  { id: 'thrust-cust-000-0000-000000000005', name: 'Customer Delight', color: 'text-amber-400' },
];

const DEMO_TEAM = [
  {
    id: 'user-alice-000-0000-000000000001',
    name: 'Alice Sharma',
    role: 'Senior Engineer',
    department: 'Engineering',
    sheetStatus: 'submitted' as const,
    goals: [
      { id: '1', title: 'Reduce API response time by 40%', weightage: 30, thrust: 'Tech & Innovation', target: 40, uom: '%' },
      { id: '2', title: 'Achieve 95% unit test coverage', weightage: 25, thrust: 'Operational Excellence', target: 95, uom: '%' },
      { id: '3', title: 'Complete 3 technical certifications', weightage: 20, thrust: 'People Development', target: 3, uom: '#' },
      { id: '4', title: 'Zero P0 bugs in production', weightage: 25, thrust: 'Customer Delight', target: 1, uom: 'binary' },
    ],
  },
  {
    id: 'user-raj-000-0000-000000000004',
    name: 'Raj Patel',
    role: 'Software Engineer',
    department: 'Engineering',
    sheetStatus: 'draft' as const,
    goals: [],
  },
  {
    id: 'user-priya-000-0000-000000000005',
    name: 'Priya Nair',
    role: 'QA Engineer',
    department: 'Engineering',
    sheetStatus: 'submitted' as const,
    goals: [
      { id: '5', title: 'Automate 80% of regression suite', weightage: 40, thrust: 'Operational Excellence', target: 80, uom: '%' },
      { id: '6', title: 'Reduce test cycle time by 30%', weightage: 35, thrust: 'Operational Excellence', target: 30, uom: '%' },
      { id: '7', title: 'Zero escaped defects to production', weightage: 25, thrust: 'Customer Delight', target: 1, uom: 'binary' },
    ],
  },
];

type ApprovalState = Record<string, { decision: 'approved' | 'returned' | null; comment: string; expanded: boolean; editMode: boolean; editedWeightages: Record<string, number> }>;

export default function ManagerApprovalsPage() {
  const { goals: aliceGoals, status: aliceStatus, isLoaded, saveGoals } = useDemoGoals();
  const [states, setStates] = useState<ApprovalState>({});
  const [lockedSheets, setLockedSheets] = useState<string[]>([]);
  const [team, setTeam] = useState(DEMO_TEAM);

  useEffect(() => {
    if (isLoaded) {
      const updatedTeam = DEMO_TEAM.map(m => {
        if (m.id === 'user-alice-000-0000-000000000001') {
          return {
            ...m,
            sheetStatus: (aliceStatus === 'submitted' || aliceStatus === 'locked') ? 'submitted' : 'draft',
            goals: aliceGoals.map(g => ({
              id: g.id,
              title: g.data.title,
              weightage: Number(g.data.weightage) || 0,
              thrust: THRUST_AREAS.find(t => t.id === g.data.thrust_area_id)?.name || 'Misc',
              target: g.data.target_value,
              uom: g.data.uom_type === 'percentage' ? '%' : g.data.uom_type === 'number' ? '#' : g.data.uom_type
            }))
          };
        }
        return m;
      });
      setTeam(updatedTeam as any);

      // Initialize states for submitted sheets
      const initialStates = Object.fromEntries(
        updatedTeam.filter((m) => m.sheetStatus === 'submitted').map((m) => [
          m.id,
          { decision: null, comment: '', expanded: true, editMode: false, editedWeightages: Object.fromEntries(m.goals.map((g) => [g.id, g.weightage])) },
        ])
      );
      setStates(initialStates);

      if (aliceStatus === 'locked') {
        setLockedSheets(prev => [...prev, 'user-alice-000-0000-000000000001']);
      }
    }
  }, [isLoaded, aliceGoals, aliceStatus]);

  const pending = team.filter((m) => m.sheetStatus === 'submitted' && !lockedSheets.includes(m.id));
  const approved = lockedSheets.length;

  const setState = (id: string, updates: Partial<ApprovalState[string]>) => {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleDecision = (memberId: string, decision: 'approved' | 'returned') => {
    setState(memberId, { decision });
    if (decision === 'approved') {
      if (memberId === 'user-alice-000-0000-000000000001') {
        // save the edited weightages back to Alice's storage!
        const updatedAliceGoals = aliceGoals.map(g => ({
          ...g,
          data: { ...g.data, weightage: states[memberId].editedWeightages[g.id].toString() }
        }));
        saveGoals(updatedAliceGoals, 'locked');
      }
      setTimeout(() => setLockedSheets((prev) => [...prev, memberId]), 800);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Approval Queue</h1>
          <p className="text-sm text-slate-400 mt-1">FY 2026 · Review and approve team goal sheets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending Review', value: pending.length, icon: <ClipboardList size={18} />, color: 'text-amber-400', bg: 'bg-amber-900/20' },
            { label: 'Approved & Locked', value: approved, icon: <Lock size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
            { label: 'Not Submitted', value: team.filter((m) => m.sheetStatus === 'draft').length, icon: <AlertTriangle size={18} />, color: 'text-slate-400', bg: 'bg-slate-800/60' },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color} mb-2`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending approvals */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Pending Approval</h2>
          <AnimatePresence>
            {pending.map((member) => {
              const s = states[member.id];
              const totalW = Object.values(s?.editedWeightages ?? {}).reduce((a, b) => a + b, 0);
              return (
                <motion.div key={member.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-xl overflow-hidden">
                  {/* Member header */}
                  <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-700/20" onClick={() => setState(member.id, { expanded: !s.expanded })}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-emerald-600/30 flex items-center justify-center text-slate-200 font-bold text-sm border border-slate-700 shrink-0">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role} · {member.department}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusChip status={member.sheetStatus} size="sm" />
                      <span className="text-xs text-slate-500">{member.goals.length} goals</span>
                      {s.expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {s.expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-700/60 overflow-hidden">
                        <div className="p-5 space-y-4">
                          {/* Goals table */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goals</p>
                              <button onClick={() => setState(member.id, { editMode: !s.editMode })} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors ${s.editMode ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                                <Edit2 size={12} />
                                {s.editMode ? 'Editing' : 'Edit Targets'}
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-slate-800/60">
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400">Goal</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400">Thrust Area</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-400">Target</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-400">Weight</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {member.goals.map((goal) => (
                                    <tr key={goal.id} className="border-t border-slate-700/40 hover:bg-slate-800/30">
                                      <td className="px-4 py-3 text-slate-300 text-sm max-w-xs truncate">{goal.title}</td>
                                      <td className="px-4 py-3 text-slate-500 text-xs">{goal.thrust}</td>
                                      <td className="px-4 py-3 text-center text-slate-300 text-sm font-medium">{goal.target}{goal.uom !== 'binary' ? goal.uom : ''}</td>
                                      <td className="px-4 py-3 text-center">
                                        {s.editMode ? (
                                          <input
                                            type="number"
                                            value={s.editedWeightages[goal.id]}
                                            onChange={(e) => setState(member.id, { editedWeightages: { ...s.editedWeightages, [goal.id]: Number(e.target.value) } })}
                                            className="w-16 bg-slate-800 border border-blue-500/50 rounded-lg px-2 py-1 text-sm text-slate-200 text-center focus:outline-none"
                                          />
                                        ) : (
                                          <span className="font-bold text-slate-200">{s.editedWeightages[goal.id]}%</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="border-t border-slate-700">
                                    <td colSpan={3} className="px-4 py-2 text-xs text-slate-500 text-right">Total Weightage</td>
                                    <td className="px-4 py-2 text-center">
                                      <span className={`text-sm font-bold ${totalW === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{totalW}%</span>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>

                          {/* Comment */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                              <MessageSquare size={11} className="inline mr-1" /> Approval Comment
                            </label>
                            <textarea
                              value={s.comment}
                              onChange={(e) => setState(member.id, { comment: e.target.value })}
                              placeholder="Add feedback or notes for the employee..."
                              rows={2}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none transition-colors"
                            />
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDecision(member.id, 'returned')}
                              disabled={!!s.decision}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-900/20 border border-amber-700/40 text-amber-300 text-sm font-semibold hover:bg-amber-900/30 transition-all disabled:opacity-40"
                            >
                              <XCircle size={16} />
                              Return for Rework
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDecision(member.id, 'approved')}
                              disabled={!!s.decision || totalW !== 100}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <CheckCircle2 size={16} />
                              Approve & Lock
                            </motion.button>
                          </div>
                          {totalW !== 100 && <p className="text-xs text-amber-400 text-center">⚠ Total weightage must equal 100% to approve</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {pending.length === 0 && (
            <div className="text-center py-12 glass-card rounded-xl">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">All sheets reviewed!</p>
              <p className="text-slate-500 text-sm mt-1">No pending approvals in this cycle.</p>
            </div>
          )}
        </div>

        {/* Locked section */}
        {lockedSheets.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2"><Lock size={14} className="text-purple-400" />Approved & Locked</h2>
            {team.filter((m) => lockedSheets.includes(m.id)).map((member) => (
              <motion.div key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 border border-purple-700/20">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center"><Lock size={14} className="text-purple-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.goals.length} goals locked · Approved just now</p>
                </div>
                <StatusChip status="locked" size="sm" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Not submitted */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={14} className="text-slate-500" />Not Yet Submitted</h2>
          {team.filter((m) => m.sheetStatus === 'draft').map((member) => (
            <div key={member.id} className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 opacity-60">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">{member.name.split(' ').map((n) => n[0]).join('')}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-300">{member.name}</p>
                <p className="text-xs text-slate-500">{member.role} · Goal sheet not submitted</p>
              </div>
              <StatusChip status="draft" size="sm" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
