'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/lib/role-context';

export default function Home() {
  const { activeRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (activeRole === 'manager') router.push('/manager');
    else if (activeRole === 'admin') router.push('/admin');
    else router.push('/dashboard');
  }, [activeRole, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-400 text-sm">Loading GoalOps...</p>
      </div>
    </div>
  );
}
