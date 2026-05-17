'use client';

import { AppShell } from '@/components/AppShell';
import { StatusChip } from '@/components/StatusChip';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Zap,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const DEMO_GOALS = [
  { id: '1', title: 'Reduce API response time by 40%', weightage: 30, status: 'draft', thrust: 'Tech & Innovation', progress: 0 },
  { id: '2', title: 'Achieve 95% unit test coverage', weightage: 25, status: 'draft', thrust: 'Operational Excellence', progress: 0 },
  { id: '3', title: 'Complete 3 technical certifications', weightage: 20, status: 'draft', thrust: 'People Development', progress: 0 },
  { id: '4', title: 'Zero P0 bugs in production', weightage: 25, status: 'draft', thrust: 'Customer Delight', progress: 0 },
];

const TOTAL_WEIGHTAGE = DEMO_GOALS.reduce((s, g) => s + g.weightage, 0);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function EmployeeDashboard() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Good evening, <span className="gradient-text">Alice</span> 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              FY 2026 · Goal Setting is open until March 31
            </p>
          </div>
          <Link href="/goals/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <Target size={16} />
              Add Goal
            </motion.button>
          </Link>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Goals Defined', value: '4 / 8', icon: <Target size={20} />, color: 'text-blue-400', bg: 'bg-blue-900/20' },
            { label: 'Total Weightage', value: `${TOTAL_WEIGHTAGE}%`, icon: <TrendingUp size={20} />, color: TOTAL_WEIGHTAGE === 100 ? 'text-emerald-400' : 'text-amber-400', bg: TOTAL_WEIGHTAGE === 100 ? 'bg-emerald-900/20' : 'bg-amber-900/20' },
            { label: 'Sheet Status', value: 'Draft', icon: <Clock size={20} />, color: 'text-slate-400', bg: 'bg-slate-800/60' },
            { label: 'Cycle Deadline', value: 'Mar 31', icon: <Calendar size={20} />, color: 'text-rose-400', bg: 'bg-rose-900/20' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="glass-card rounded-xl p-4"
            >
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color} mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-slate-100">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weightage warning */}
        {TOTAL_WEIGHTAGE !== 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/40"
          >
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Weightage Incomplete</p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                Your goals total <strong>{TOTAL_WEIGHTAGE}%</strong>. They must add up to exactly <strong>100%</strong> before you can submit.
              </p>
            </div>
          </motion.div>
        )}

        {/* Goals list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">My Goals — FY 2026</h2>
            <Link href="/goals" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {DEMO_GOALS.map((goal, i) => (
              <motion.div
                key={goal.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-slate-600/60 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Target size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{goal.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{goal.thrust}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-200">{goal.weightage}%</p>
                    <p className="text-xs text-slate-500">weight</p>
                  </div>
                  <StatusChip status={goal.status} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-5 border border-blue-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">Next Action: Submit Your Goal Sheet</p>
              <p className="text-xs text-slate-400 mt-1">
                Fix the weightage to reach 100%, then submit to Bob Mehta for approval.
                Goals will be locked once approved.
              </p>
            </div>
            <Link href="/goals">
              <button className="shrink-0 text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                Go to Goals <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
