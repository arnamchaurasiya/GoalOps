'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Filter, ChevronDown, ChevronUp, Download } from 'lucide-react';

const AUDIT_LOGS = [
  { id: '1', entity_type: 'goal_sheet', entity_id: 'sheet-alice', action: 'created', actor: 'Alice Sharma', created_at: '2026-01-05T10:23:00Z', old_value: null, new_value: { status: 'draft' } },
  { id: '2', entity_type: 'goal', entity_id: 'goal-1', action: 'created', actor: 'Alice Sharma', created_at: '2026-01-05T10:25:00Z', old_value: null, new_value: { title: 'Reduce API response time by 40%', weightage: 30 } },
  { id: '3', entity_type: 'goal', entity_id: 'goal-2', action: 'created', actor: 'Alice Sharma', created_at: '2026-01-05T10:27:00Z', old_value: null, new_value: { title: 'Achieve 95% unit test coverage', weightage: 25 } },
  { id: '4', entity_type: 'goal_sheet', entity_id: 'sheet-alice', action: 'submitted', actor: 'Alice Sharma', created_at: '2026-01-10T09:00:00Z', old_value: { status: 'draft' }, new_value: { status: 'submitted' } },
  { id: '5', entity_type: 'goal', entity_id: 'goal-1', action: 'weightage_edited', actor: 'Bob Mehta', created_at: '2026-01-12T14:30:00Z', old_value: { weightage: 30 }, new_value: { weightage: 30 } },
  { id: '6', entity_type: 'goal_sheet', entity_id: 'sheet-alice', action: 'approved', actor: 'Bob Mehta', created_at: '2026-01-12T14:45:00Z', old_value: { status: 'submitted' }, new_value: { status: 'approved' } },
  { id: '7', entity_type: 'goal', entity_id: 'goal-1', action: 'locked', actor: 'System', created_at: '2026-01-12T14:45:01Z', old_value: { status: 'draft' }, new_value: { status: 'locked', locked_at: '2026-01-12T14:45:01Z' } },
  { id: '8', entity_type: 'achievement', entity_id: 'ach-1', action: 'created', actor: 'Alice Sharma', created_at: '2026-04-10T11:00:00Z', old_value: null, new_value: { actual_value: 28, period: 'Q1 2026', progress_status: 'on_track' } },
  { id: '9', entity_type: 'checkin', entity_id: 'checkin-1', action: 'created', actor: 'Bob Mehta', created_at: '2026-04-11T15:20:00Z', old_value: null, new_value: { period: 'Q1 2026', comment: 'Good progress on API...' } },
  { id: '10', entity_type: 'goal', entity_id: 'goal-post-lock', action: 'unlock_requested', actor: 'Bob Mehta', created_at: '2026-04-15T09:00:00Z', old_value: { status: 'locked' }, new_value: { status: 'draft', reason: 'Target revised by leadership' } },
];

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-blue-900/40 text-blue-300',
  submitted: 'bg-purple-900/40 text-purple-300',
  approved: 'bg-emerald-900/40 text-emerald-300',
  locked: 'bg-purple-900/60 text-purple-200',
  weightage_edited: 'bg-amber-900/40 text-amber-300',
  unlock_requested: 'bg-red-900/40 text-red-300',
};

export default function AuditLogPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState('all');

  const filtered = filterAction === 'all' ? AUDIT_LOGS : AUDIT_LOGS.filter((l) => l.action === filterAction);

  const formatDate = (iso: string) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const exportCSV = () => {
    const headers = ['ID', 'Entity Type', 'Action', 'Actor', 'Timestamp'];
    const rows = AUDIT_LOGS.map((l) => [l.id, l.entity_type, l.action, l.actor, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goalops_audit_log.csv';
    a.click();
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Audit Log Explorer</h1>
            <p className="text-sm text-slate-400 mt-1">Append-only event trail — every change recorded</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all">
            <Download size={15} />Export CSV
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-slate-500" />
          <p className="text-xs text-slate-400">Filter:</p>
          {['all', 'created', 'submitted', 'approved', 'locked', 'unlock_requested'].map((action) => (
            <button key={action} onClick={() => setFilterAction(action)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filterAction === action ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
              {action === 'all' ? 'All Events' : action.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Log entries */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/60 flex items-center gap-2">
            <FileText size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{filtered.length} Events</span>
          </div>
          <div className="divide-y divide-slate-700/40">
            {filtered.map((log) => (
              <motion.div key={log.id} layout className="group">
                <div
                  className="flex items-start gap-4 px-5 py-4 hover:bg-slate-800/30 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ACTION_COLORS[log.action] ?? 'bg-slate-700 text-slate-400'}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500">{log.entity_type.replace('_', ' ')}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-400">by <strong className="text-slate-300">{log.actor}</strong></span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(log.created_at)}</p>
                  </div>

                  <div className="shrink-0">
                    {expandedId === log.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </div>
                </div>

                {/* Expanded diff */}
                {expandedId === log.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-4 overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 ml-6">
                      {log.old_value && (
                        <div>
                          <p className="text-xs text-red-400 font-semibold mb-1.5 uppercase tracking-wider">Before</p>
                          <pre className="text-xs bg-red-900/10 border border-red-700/20 rounded-lg p-3 text-red-300 overflow-x-auto">
                            {JSON.stringify(log.old_value, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_value && (
                        <div className={log.old_value ? '' : 'col-span-2'}>
                          <p className="text-xs text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider">After</p>
                          <pre className="text-xs bg-emerald-900/10 border border-emerald-700/20 rounded-lg p-3 text-emerald-300 overflow-x-auto">
                            {JSON.stringify(log.new_value, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
