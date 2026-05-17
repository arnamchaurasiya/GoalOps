'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, DEMO_USERS } from '@/lib/types';

interface RoleContextType {
  currentUser: User;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('employee');

  useEffect(() => {
    const saved = localStorage.getItem('goalops_demo_role') as UserRole | null;
    if (saved && ['employee', 'manager', 'admin'].includes(saved)) {
      setActiveRole(saved);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('goalops_demo_role', role);
  };

  const currentUser = DEMO_USERS[activeRole];

  return (
    <RoleContext.Provider value={{ currentUser, activeRole, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
