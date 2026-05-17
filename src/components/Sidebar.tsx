'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/role-context';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationsPanel } from './NotificationsPanel';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Users,
  ClipboardList,
  Settings,
  BarChart3,
  FileText,
  Activity,
  Bell,
  Lock,
  TrendingUp,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Employee
  { href: '/dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={18} />, roles: ['employee'] },
  { href: '/goals', label: 'My Goals', icon: <Target size={18} />, roles: ['employee'] },
  { href: '/goals/update', label: 'Update Progress', icon: <TrendingUp size={18} />, roles: ['employee'] },
  // Manager
  { href: '/manager', label: 'Team Dashboard', icon: <LayoutDashboard size={18} />, roles: ['manager'] },
  { href: '/manager/approvals', label: 'Approval Queue', icon: <ClipboardList size={18} />, roles: ['manager'], badge: '3' },
  { href: '/manager/checkins', label: 'Check-ins', icon: <CheckSquare size={18} />, roles: ['manager'] },
  { href: '/manager/team', label: 'My Team', icon: <Users size={18} />, roles: ['manager'] },
  // Admin
  { href: '/admin', label: 'HR Dashboard', icon: <BarChart3 size={18} />, roles: ['admin'] },
  { href: '/admin/cycles', label: 'Cycles', icon: <Settings size={18} />, roles: ['admin'] },
  { href: '/admin/shared-goals', label: 'Shared KPIs', icon: <Activity size={18} />, roles: ['admin'] },
  { href: '/admin/audit', label: 'Audit Logs', icon: <FileText size={18} />, roles: ['admin'] },
  { href: '/admin/export', label: 'Export Center', icon: <FileText size={18} />, roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeRole } = useRole();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(activeRole));

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 flex flex-col z-30"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderRight: '1px solid rgba(51, 65, 85, 0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Role indicator */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold ${
          activeRole === 'employee' ? 'bg-blue-900/30 text-blue-300' :
          activeRole === 'manager' ? 'bg-emerald-900/30 text-emerald-300' :
          'bg-purple-900/30 text-purple-300'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {activeRole === 'employee' ? 'Employee View' :
           activeRole === 'manager' ? 'Manager View' : 'Admin / HR View'}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? activeRole === 'employee'
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                      : activeRole === 'manager'
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/20'
                      : 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: notifications + lock hint */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button onClick={() => setIsNotifOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-150">
          <Bell size={18} className="opacity-60" />
          <span className="text-sm font-medium">Notifications</span>
          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold ml-auto">
            {activeRole === 'employee' ? '2' : activeRole === 'manager' ? '2' : '2'}
          </span>
        </button>
        {activeRole !== 'admin' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
            <Lock size={12} />
            <span>Goals lock after approval</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isNotifOpen && <NotificationsPanel onClose={() => setIsNotifOpen(false)} />}
      </AnimatePresence>
    </aside>
  );
}
