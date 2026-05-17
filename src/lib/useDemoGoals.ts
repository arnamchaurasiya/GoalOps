'use client';

import { useState, useEffect } from 'react';
import { GoalFormData, UomType, ScoreDirection } from './types';

export const DEMO_GOALS_INIT = [
  { id: '1', thrust_area_id: 'thrust-tech-000-0000-000000000004', title: 'Reduce API response time by 40%', description: 'Optimize backend services to achieve sub-200ms P95 response.', uom_type: 'percentage' as UomType, score_direction: 'lower_better' as ScoreDirection, target_value: '40', target_date: '2026-12-31', weightage: '30' },
  { id: '2', thrust_area_id: 'thrust-ops-000-0000-000000000002', title: 'Achieve 95% unit test coverage', description: 'Increase coverage from 72% to 95% across all microservices.', uom_type: 'percentage' as UomType, score_direction: 'higher_better' as ScoreDirection, target_value: '95', target_date: '2026-09-30', weightage: '25' },
  { id: '3', thrust_area_id: 'thrust-people-0-0000-000000000003', title: 'Complete 3 technical certifications', description: 'AWS, Kubernetes, and system design certifications.', uom_type: 'number' as UomType, score_direction: 'higher_better' as ScoreDirection, target_value: '3', target_date: '2026-12-31', weightage: '20' },
  { id: '4', thrust_area_id: 'thrust-cust-000-0000-000000000005', title: 'Zero P0 bugs in production', description: 'Zero critical incidents attributable to the team.', uom_type: 'binary' as UomType, score_direction: 'binary' as ScoreDirection, target_value: '1', target_date: '2026-12-31', weightage: '25' },
];

export interface PersistedGoal {
  id: string;
  data: GoalFormData;
  actual_value?: string;
}

export function useDemoGoals() {
  const [goals, setGoals] = useState<PersistedGoal[]>([]);
  const [status, setStatus] = useState<'draft' | 'submitted' | 'locked'>('draft');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedGoals = localStorage.getItem('goalops_demo_goals');
    const savedStatus = localStorage.getItem('goalops_demo_status');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Initialize with default
      const initial = DEMO_GOALS_INIT.map(g => ({
        id: g.id,
        data: {
          thrust_area_id: g.thrust_area_id,
          title: g.title,
          description: g.description,
          uom_type: g.uom_type,
          score_direction: g.score_direction,
          target_value: g.target_value,
          target_date: g.target_date,
          weightage: g.weightage
        }
      }));
      setGoals(initial);
    }

    if (savedStatus) {
      setStatus(savedStatus as any);
    }
    
    setIsLoaded(true);
  }, []);

  const saveGoals = (newGoals: PersistedGoal[], newStatus?: 'draft' | 'submitted' | 'locked') => {
    setGoals(newGoals);
    localStorage.setItem('goalops_demo_goals', JSON.stringify(newGoals));
    
    if (newStatus) {
      setStatus(newStatus);
      localStorage.setItem('goalops_demo_status', newStatus);
    }
  };

  const clearDemo = () => {
    localStorage.removeItem('goalops_demo_goals');
    localStorage.removeItem('goalops_demo_status');
    window.location.reload();
  };

  return { goals, status, isLoaded, saveGoals, clearDemo };
}
