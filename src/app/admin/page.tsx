'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Users, Target, CheckCircle2, AlertTriangle, TrendingUp, Download, Settings } from 'lucide-react';
import Link from 'next/link';

const DEPT_DATA = [
  { dept: 'Engineering', total: 12, approved: 8, submitted: 3, draft: 1 },
  { dept: 'Sales', total: 8, approved: 5, submitted: 2, draft: 1 },
  { dept: 'HR', total: 5, approved: 4, submitted: 1, draft: 0 },
  { dept: 'Finance', total: 6, approved: 3, submitted: 2, draft: 1 },
  { dept: 'Product', total: 7, approved: 6, submitted: 1, draft: 0 },
];

const TREND_DATA = [
  { week: 'Wk 1', submitted: 5, approved: 2 },
  { week: 'Wk 2', submitted: 12, approved: 8 },
  { week: 'Wk 3', submitted: 18, approved: 14 },
  { week: 'Wk 4', submitted: 23, approved: 20 },
];

const PIE_DATA = [
  { name: 'Approved', value: 26, color: '#10b981' },
  { name: 'Submitted', value: 9, color: '#3b82f6' },
  { name: 'Draft', value: 3, color: '#475569' },
];

const STATS = [
  { label: 'Total Employees', value: '38', sub: 'In active cycle', icon: <Users size={20} />, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  { label: 'Goal Sheets Approved', value: '26', sub: '68% completion', icon: <CheckCircle2 size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  { label: 'Pending Review', value: '9', sub: 'Awaiting manager', icon: <Target size={20} />, color: 'text-amber-400', bg: 'bg-amber-900/20' },
  { label: 'At Risk (Not Submitted)', value: '3', sub: 'Deadline in 14 days', icon: <AlertTriangle size={20} />, color: 'text-rose-400', bg: 'bg-rose-900/20' },
];

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#e2e8f0' };

export default function AdminDashboard() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">HR Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">FY 2026 · Real-time governance view</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/export">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all">
                <Download size={15} />Export
              </button>
            </Link>
            <Link href="/admin/cycles">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all">
                <Settings size={15} />Cycles
              </button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Dept completion bar */}
          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Completion</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPT_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="submitted" name="Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="draft" name="Draft" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Overall Status</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /><span className="text-slate-400">{d.name}</span></div>
                  <span className="font-semibold text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submission trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Submission & Approval Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Line type="monotone" dataKey="submitted" name="Submitted" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department heatmap / table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Department Heatmap</h3>
            <Link href="/admin/audit" className="text-xs text-blue-400 hover:text-blue-300">View Audit Log →</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Department</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Total</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Approved</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Submitted</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400">Draft</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Completion</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map((row, i) => {
                const pct = Math.round((row.approved / row.total) * 100);
                return (
                  <tr key={row.dept} className={`border-t border-slate-700/40 ${i % 2 === 0 ? '' : 'bg-slate-800/20'}`}>
                    <td className="px-5 py-3 text-sm font-medium text-slate-200">{row.dept}</td>
                    <td className="px-5 py-3 text-center text-sm text-slate-400">{row.total}</td>
                    <td className="px-5 py-3 text-center text-sm text-emerald-400 font-semibold">{row.approved}</td>
                    <td className="px-5 py-3 text-center text-sm text-blue-400">{row.submitted}</td>
                    <td className="px-5 py-3 text-center text-sm text-slate-500">{row.draft}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        </div>
                        <span className="text-xs font-semibold text-slate-300 w-10">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
