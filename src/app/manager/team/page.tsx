'use client';

import { AppShell } from '@/components/AppShell';
import { StatusChip } from '@/components/StatusChip';
import { motion } from 'framer-motion';
import { Users, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TEAM = [
  { id: '1', name: 'Alice Sharma', role: 'Senior Engineer', dept: 'Engineering', status: 'submitted', goalCount: 4 },
  { id: '2', name: 'Raj Patel', role: 'Software Engineer', dept: 'Engineering', status: 'draft', goalCount: 0 },
  { id: '3', name: 'Priya Nair', role: 'QA Engineer', dept: 'Engineering', status: 'submitted', goalCount: 3 },
];

export default function ManagerTeamPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Team</h1>
          <p className="text-sm text-slate-400 mt-1">Engineering · {TEAM.length} direct reports</p>
        </div>

        <div className="space-y-3">
          {TEAM.map((member, i) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-emerald-600/30 border border-slate-700 flex items-center justify-center text-slate-200 font-bold shrink-0">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200">{member.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{member.role} · {member.dept}</p>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <Target size={11} />{member.goalCount > 0 ? `${member.goalCount} goals defined` : 'No goals yet'}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusChip status={member.status} size="sm" />
                <Link href="/manager/approvals" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Review <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
