'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Download, FileText, Table, CheckCircle2 } from 'lucide-react';

const EXPORTS = [
  { id: 'goals', title: 'Goal Sheets Export', desc: 'All employee goal sheets with status and weightages', rows: 38, format: 'CSV' },
  { id: 'achievements', title: 'Q1 Achievements Report', desc: 'Planned vs actual with computed scores per employee', rows: 31, format: 'CSV' },
  { id: 'audit', title: 'Audit Log Export', desc: 'Full append-only event trail for compliance', rows: 142, format: 'CSV' },
  { id: 'completion', title: 'Completion Dashboard Report', desc: 'Department-wise completion summary for leadership', rows: 5, format: 'CSV' },
];

export default function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  const handleExport = async (id: string, title: string) => {
    setDownloading(id);
    await new Promise((r) => setTimeout(r, 1200));
    const csv = `ID,Title,Status,Weightage\n1,Goal 1,approved,30\n2,Goal 2,approved,25\n3,Goal 3,draft,20`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goalops_${id}.csv`;
    a.click();
    setDownloading(null);
    setDone((prev) => [...prev, id]);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Export Center</h1>
          <p className="text-sm text-slate-400 mt-1">Download reports for appraisal and governance</p>
        </div>

        <div className="space-y-3">
          {EXPORTS.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-900/20 flex items-center justify-center shrink-0">
                {exp.format === 'CSV' ? <Table size={18} className="text-blue-400" /> : <FileText size={18} className="text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200">{exp.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{exp.desc}</p>
                <p className="text-xs text-slate-600 mt-0.5">{exp.rows} rows · {exp.format}</p>
              </div>
              {done.includes(exp.id) ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium shrink-0">
                  <CheckCircle2 size={14} />Downloaded
                </div>
              ) : (
                <button
                  onClick={() => handleExport(exp.id, exp.title)}
                  disabled={downloading === exp.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all disabled:opacity-60 shrink-0"
                >
                  {downloading === exp.id ? <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin" /> : <Download size={14} />}
                  {downloading === exp.id ? 'Preparing...' : 'Download'}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-5 border border-blue-700/20">
          <p className="text-sm font-semibold text-slate-200 mb-1">💡 Excel Export (Coming Soon)</p>
          <p className="text-xs text-slate-400">Full Excel workbook with multiple sheets — goals, achievements, check-ins, and audit trail — will be available in the next release.</p>
        </div>
      </div>
    </AppShell>
  );
}
