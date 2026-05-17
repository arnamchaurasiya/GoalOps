'use client';

import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Share2, CheckCircle2 } from 'lucide-react';

const SHARED_KPIS = [
  { id: '1', title: 'Achieve 99.5% platform uptime across all services', thrust: 'Technology & Innovation', target: 99.5, uom: '%', departments: ['Engineering', 'DevOps'], goalCount: 8 },
  { id: '2', title: 'Reduce customer support ticket volume by 20%', thrust: 'Customer Delight', target: 20, uom: '%', departments: ['Product', 'Engineering', 'Support'], goalCount: 6 },
];

export default function SharedGoalsPage() {
  const [showNew, setShowNew] = useState(false);
  const [newKpi, setNewKpi] = useState({ title: '', thrust: '', target: '', uom: 'percentage', departments: '' });
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
            <h1 className="text-2xl font-bold text-slate-100">Shared KPIs</h1>
            <p className="text-sm text-slate-400 mt-1">Push organizational KPIs across departments</p>
          </div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/20">
            <Plus size={15} /> Push KPI
          </button>
        </div>

        {created && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/30">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <p className="text-sm text-emerald-300">Shared KPI pushed to selected departments!</p>
          </div>
        )}

        {showNew && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 border border-purple-700/30 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Create Shared KPI</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">KPI Title</label>
              <input type="text" value={newKpi.title} onChange={(e) => setNewKpi({ ...newKpi, title: e.target.value })} placeholder="e.g., Achieve 99.5% uptime across all systems" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Thrust Area</label>
                <select value={newKpi.thrust} onChange={(e) => setNewKpi({ ...newKpi, thrust: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500">
                  <option value="">Select...</option>
                  <option>Revenue Growth</option>
                  <option>Technology & Innovation</option>
                  <option>Customer Delight</option>
                  <option>Operational Excellence</option>
                  <option>People Development</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target</label>
                <input type="number" value={newKpi.target} onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })} placeholder="e.g., 99.5" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Unit</label>
                <select value={newKpi.uom} onChange={(e) => setNewKpi({ ...newKpi, uom: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500">
                  <option value="percentage">Percentage (%)</option>
                  <option value="number">Number (#)</option>
                  <option value="currency">Currency (₹)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target Departments (comma separated)</label>
              <input type="text" value={newKpi.departments} onChange={(e) => setNewKpi({ ...newKpi, departments: e.target.value })} placeholder="e.g., Engineering, Product, DevOps" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700 hover:bg-slate-700">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors">Push to Departments</button>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {SHARED_KPIS.map((kpi, i) => (
            <motion.div key={kpi.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-900/30 flex items-center justify-center shrink-0"><Share2 size={18} className="text-purple-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200">{kpi.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{kpi.thrust} · Target: {kpi.target}{kpi.uom === 'percentage' ? '%' : ''}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {kpi.departments.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-400">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-200">{kpi.goalCount}</p>
                  <p className="text-xs text-slate-500">goals linked</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
