'use client';

import { useRole } from '@/lib/role-context';
import { UserRole } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, User, Users, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ROLES: { role: UserRole; name: string; email: string; icon: React.ReactNode; color: string }[] = [
  {
    role: 'employee',
    name: 'Alice Sharma',
    email: 'alice@goalops.demo',
    icon: <User size={14} />,
    color: 'text-blue-400',
  },
  {
    role: 'manager',
    name: 'Bob Mehta',
    email: 'bob@goalops.demo',
    icon: <Users size={14} />,
    color: 'text-emerald-400',
  },
  {
    role: 'admin',
    name: 'Carol D\'souza',
    email: 'carol@goalops.demo',
    icon: <Shield size={14} />,
    color: 'text-purple-400',
  },
];

const ROLE_LABELS: Record<UserRole, string> = {
  employee: 'Employee',
  manager: 'Manager L1',
  admin: 'Admin / HR',
};

export function RoleSwitcher() {
  const { activeRole, switchRole, currentUser } = useRole();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const activeConfig = ROLES.find((r) => r.role === activeRole)!;

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    setOpen(false);
    // Navigate to appropriate dashboard
    if (role === 'manager') router.push('/manager');
    else if (role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 transition-all duration-200 group"
      >
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-semibold">DEMO</span>
        </div>
        <div className="w-px h-4 bg-slate-600" />
        <span className={`text-xs font-medium ${activeConfig.color}`}>
          {currentUser.name}
        </span>
        <span className="text-xs text-slate-500">·</span>
        <span className="text-xs text-slate-400">{ROLE_LABELS[activeRole]}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 z-50 rounded-xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(51, 65, 85, 0.7)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="p-3 border-b border-slate-700/60">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Role
                </p>
              </div>
              <div className="p-2">
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleSwitch(r.role)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      activeRole === r.role
                        ? 'bg-slate-700/60 border border-slate-600'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        r.role === 'employee'
                          ? 'bg-blue-900/40 text-blue-400'
                          : r.role === 'manager'
                          ? 'bg-emerald-900/40 text-emerald-400'
                          : 'bg-purple-900/40 text-purple-400'
                      }`}
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${r.color}`}>{r.name}</p>
                      <p className="text-xs text-slate-500">{ROLE_LABELS[r.role]}</p>
                    </div>
                    {activeRole === r.role && (
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
