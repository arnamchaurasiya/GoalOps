'use client';

import { motion } from 'framer-motion';
import { X, Bell, CheckCircle2, Target, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { UserRole } from '@/lib/types';

interface NotificationsPanelProps {
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Record<UserRole, any[]> = {
  employee: [
    { id: 1, title: 'Goals Approved', desc: 'Bob Mehta approved your FY2026 Goal Sheet. Your goals are now locked.', time: '2 hours ago', icon: <CheckCircle2 className="text-emerald-400" size={16} />, read: false },
    { id: 2, title: 'Q1 Check-in Opens Soon', desc: 'The Q1 achievement window opens in 3 days. Prepare your actuals.', time: '1 day ago', icon: <Calendar className="text-blue-400" size={16} />, read: false },
    { id: 3, title: 'Shared KPI Assigned', desc: 'HR assigned "Revenue Growth" as a shared departmental KPI.', time: '3 days ago', icon: <Target className="text-purple-400" size={16} />, read: true },
  ],
  manager: [
    { id: 4, title: 'New Goals Submitted', desc: 'Alice Sharma submitted 4 goals for your approval.', time: '1 hour ago', icon: <Target className="text-blue-400" size={16} />, read: false },
    { id: 5, title: 'Check-in Overdue', desc: 'Raj Patel has not completed his Q1 Check-in. Escalation in 2 days.', time: '5 hours ago', icon: <AlertCircle className="text-rose-400" size={16} />, read: false },
  ],
  admin: [
    { id: 6, title: 'Cycle Exception Requested', desc: 'Bob Mehta requested a 2-day extension for his team\'s goal setting.', time: '10 mins ago', icon: <AlertCircle className="text-amber-400" size={16} />, read: false },
    { id: 7, title: 'High Completion Rate', desc: 'Engineering department reached 80% submission rate.', time: '2 hours ago', icon: <TrendingUp className="text-emerald-400" size={16} />, read: false },
  ],
};

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { activeRole } = useRole();
  const notifications = MOCK_NOTIFICATIONS[activeRole] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-start p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:w-[380px] h-full sm:h-[calc(100vh-2rem)] rounded-none sm:rounded-2xl overflow-hidden flex flex-col bg-slate-900 border border-slate-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Bell size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">Notifications</p>
              <p className="text-xs text-slate-400">Recent updates & alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.map((note) => (
            <div key={note.id} className={`p-3 rounded-xl border ${note.read ? 'bg-slate-800/20 border-transparent' : 'bg-slate-800/60 border-slate-700'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {note.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${note.read ? 'text-slate-300' : 'text-slate-100'}`}>
                      {note.title}
                    </p>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5">{note.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {note.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto text-slate-600 mb-3" size={24} />
              <p className="text-sm text-slate-400">You have no new notifications.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
