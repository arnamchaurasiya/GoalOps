'use client';

import { RoleSwitcher } from './RoleSwitcher';
import { Sidebar } from './Sidebar';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4"
        style={{
          background: 'rgba(15, 23, 42, 0.97)',
          borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold gradient-text">GoalOps</span>
            <p className="text-[10px] text-slate-500 -mt-1 hidden sm:block">Goal Operating System</p>
          </div>
        </Link>

        {/* Center: Cycle badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">FY 2026 — Goal Setting Open</span>
        </div>

        {/* Right: Role switcher */}
        <RoleSwitcher />
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-56 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
