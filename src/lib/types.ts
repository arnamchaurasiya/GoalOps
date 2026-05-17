// Core TypeScript types for GoalOps

export type UserRole = 'employee' | 'manager' | 'admin';
export type GoalSheetStatus = 'draft' | 'submitted' | 'returned' | 'approved' | 'locked';
export type GoalStatus = 'draft' | 'approved' | 'locked';
export type UomType = 'number' | 'percentage' | 'binary' | 'currency';
export type ScoreDirection = 'higher_better' | 'lower_better' | 'binary' | 'timeline';
export type ProgressStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';
export type CycleStatus = 'planning' | 'goal_setting' | 'active' | 'closed';
export type PeriodType = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'annual';

export interface Department {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  manager_id: string | null;
  department_id: string | null;
  avatar_url: string | null;
  created_at: string;
  department?: Department;
  manager?: User;
}

export interface Cycle {
  id: string;
  name: string;
  fiscal_year: string;
  status: CycleStatus;
  goal_open_date: string | null;
  goal_close_date: string | null;
  created_at: string;
}

export interface Period {
  id: string;
  cycle_id: string;
  name: string;
  window_open: string | null;
  window_close: string | null;
  type: PeriodType;
  created_at: string;
}

export interface ThrustArea {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface SharedGoalGroup {
  id: string;
  title: string;
  target_value: number | null;
  target_date: string | null;
  primary_owner_goal_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface GoalSheet {
  id: string;
  employee_id: string;
  cycle_id: string;
  status: GoalSheetStatus;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  employee?: User;
  cycle?: Cycle;
  goals?: Goal[];
}

export interface Goal {
  id: string;
  sheet_id: string;
  thrust_area_id: string | null;
  title: string;
  description: string | null;
  uom_type: UomType;
  score_direction: ScoreDirection;
  target_value: number | null;
  target_date: string | null;
  weightage: number;
  status: GoalStatus;
  locked_at: string | null;
  shared_group_id: string | null;
  created_at: string;
  updated_at: string;
  thrust_area?: ThrustArea;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  goal_id: string;
  period_id: string;
  actual_value: number | null;
  actual_date: string | null;
  progress_status: ProgressStatus | null;
  computed_score: number | null;
  comments: string | null;
  submitted_by: string | null;
  submitted_at: string;
  period?: Period;
}

export interface Checkin {
  id: string;
  employee_id: string;
  manager_id: string;
  period_id: string;
  comment: string;
  completed_at: string;
  employee?: User;
  period?: Period;
}

export interface Approval {
  id: string;
  sheet_id: string;
  manager_id: string;
  decision: 'approved' | 'returned';
  comment: string | null;
  created_at: string;
  manager?: User;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_value_json: Record<string, unknown> | null;
  new_value_json: Record<string, unknown> | null;
  actor_id: string | null;
  created_at: string;
  actor?: User;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  channel: 'in_app' | 'email' | 'teams';
  status: 'unread' | 'read' | 'sent';
  payload_json: Record<string, unknown> | null;
  created_at: string;
}

// Form types
export interface GoalFormData {
  thrust_area_id: string;
  title: string;
  description: string;
  uom_type: UomType;
  score_direction: ScoreDirection;
  target_value: string;
  target_date: string;
  weightage: string;
}

// AI types
export interface GoalCoachResponse {
  improvedTitle: string;
  improvedDescription: string;
  suggestedUom: UomType;
  suggestedTarget: number;
  scoreDirection: ScoreDirection;
  risks: string[];
  coachingQuestions: string[];
}

export interface CheckinAssistantResponse {
  summary: string;
  coachingQuestions: string[];
  overallProgress: 'excellent' | 'on_track' | 'needs_attention' | 'at_risk';
}

// Dashboard types
export interface AdminDashboardStats {
  totalEmployees: number;
  sheetsSubmitted: number;
  sheetsApproved: number;
  sheetsDraft: number;
  completionRate: number;
  overdueCheckins: number;
  departmentStats: DepartmentStat[];
}

export interface DepartmentStat {
  department: string;
  total: number;
  approved: number;
  submitted: number;
  draft: number;
  completionRate: number;
}

// Demo users for role switcher
export const DEMO_USERS = {
  employee: {
    id: 'user-alice-000-0000-000000000001',
    name: 'Alice Sharma',
    email: 'alice@goalops.demo',
    role: 'employee' as UserRole,
    department_id: 'dept-eng-0000-0000-000000000001',
    manager_id: 'user-bob-00000-0000-000000000002',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  manager: {
    id: 'user-bob-00000-0000-000000000002',
    name: 'Bob Mehta',
    email: 'bob@goalops.demo',
    role: 'manager' as UserRole,
    department_id: 'dept-eng-0000-0000-000000000001',
    manager_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  admin: {
    id: 'user-carol-000-0000-000000000003',
    name: 'Carol D\'souza',
    email: 'carol@goalops.demo',
    role: 'admin' as UserRole,
    department_id: 'dept-hr-0000-0000-000000000003',
    manager_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
} satisfies Record<string, User>;
