'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { Users, ClipboardList, CheckSquare, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { StatusChip } from '@/components/StatusChip';

const TEAM = [
  { name: 'Alice Sharma', role: 'Senior Engineer', status: 'submitted', goals: 4, completion: 0 },
  { name: 'Raj Patel', role: 'Software Engineer', status: 'draft', goals: 0, completion: 0 },
  { name: 'Priya Nair', role: 'QA Engineer', status: 'submitted', goals: 3, completion: 0 },
];

export default function ManagerDashboard() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Engineering · FY 2026</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Team Size', value: 3, icon: <Users size={18} />, color: 'text-blue-400', bg: 'bg-blue-900/20' },
            { label: 'Pending Approvals', value: 2, icon: <ClipboardList size={18} />, color: 'text-amber-400', bg: 'bg-amber-900/20' },
            { label: 'Check-ins Due', value: 0, icon: <CheckSquare size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
            { label: 'Not Submitted', value: 1, icon: <AlertTriangle size={18} />, color: 'text-rose-400', bg: 'bg-rose-900/20' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color} mb-2`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick action */}
        <Link href="/manager/approvals">
          <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-xl p-5 border border-amber-700/30 flex items-center gap-4 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-900/30 flex items-center justify-center shrink-0"><ClipboardList size={20} className="text-amber-400" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">2 goal sheets awaiting your approval</p>
              <p className="text-xs text-slate-400 mt-0.5">Alice Sharma and Priya Nair have submitted their FY 2026 goal sheets</p>
            </div>
            <ArrowRight size={18} className="text-amber-400 shrink-0" />
          </motion.div>
        </Link>

        {/* Team list */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">My Team</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-700/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Sheet Status</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Goals</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Q1 Progress</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {TEAM.map((member, i) => (
                  <motion.tr key={member.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="border-t border-slate-700/40 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">{member.name.split(' ').map((n) => n[0]).join('')}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusChip status={member.status} size="sm" /></td>
                    <td className="px-5 py-4 text-center text-sm text-slate-300">{member.goals || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-600 rounded-full" style={{ width: `${member.completion}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{member.completion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link href="/manager/approvals" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-end">
                        Review <ArrowRight size={12} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
