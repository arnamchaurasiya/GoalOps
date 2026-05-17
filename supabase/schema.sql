-- GoalOps Database Schema
-- Run this in Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- DEPARTMENTS
-- =====================
create table if not exists departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  parent_id uuid references departments(id),
  created_at timestamptz default now()
);

-- =====================
-- USERS
-- =====================
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('employee', 'manager', 'admin')),
  manager_id uuid references users(id),
  department_id uuid references departments(id),
  avatar_url text,
  created_at timestamptz default now()
);

-- =====================
-- CYCLES
-- =====================
create table if not exists cycles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  fiscal_year text not null,
  status text not null default 'planning' check (status in ('planning', 'goal_setting', 'active', 'closed')),
  goal_open_date date,
  goal_close_date date,
  created_at timestamptz default now()
);

-- =====================
-- PERIODS (quarterly windows)
-- =====================
create table if not exists periods (
  id uuid primary key default uuid_generate_v4(),
  cycle_id uuid not null references cycles(id) on delete cascade,
  name text not null,
  window_open date,
  window_close date,
  type text not null check (type in ('Q1', 'Q2', 'Q3', 'Q4', 'annual')),
  created_at timestamptz default now()
);

-- =====================
-- THRUST AREAS (strategic pillars)
-- =====================
create table if not exists thrust_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- SHARED GOAL GROUPS
-- =====================
create table if not exists shared_goal_groups (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  target_value numeric,
  target_date date,
  primary_owner_goal_id uuid,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

-- =====================
-- GOAL SHEETS
-- =====================
create table if not exists goal_sheets (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid not null references users(id),
  cycle_id uuid not null references cycles(id),
  status text not null default 'draft' check (status in ('draft', 'submitted', 'returned', 'approved', 'locked')),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references users(id),
  created_at timestamptz default now()
);

-- =====================
-- GOALS
-- =====================
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  sheet_id uuid not null references goal_sheets(id) on delete cascade,
  thrust_area_id uuid references thrust_areas(id),
  title text not null,
  description text,
  uom_type text not null check (uom_type in ('number', 'percentage', 'binary', 'currency')),
  score_direction text not null default 'higher_better' check (score_direction in ('higher_better', 'lower_better', 'binary', 'timeline')),
  target_value numeric,
  target_date date,
  weightage numeric not null check (weightage >= 10 and weightage <= 100),
  status text not null default 'draft' check (status in ('draft', 'approved', 'locked')),
  locked_at timestamptz,
  shared_group_id uuid references shared_goal_groups(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- ACHIEVEMENTS (quarterly actuals)
-- =====================
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid not null references goals(id) on delete cascade,
  period_id uuid not null references periods(id),
  actual_value numeric,
  actual_date date,
  progress_status text check (progress_status in ('on_track', 'at_risk', 'delayed', 'completed')),
  computed_score numeric,
  comments text,
  submitted_by uuid references users(id),
  submitted_at timestamptz default now()
);

-- =====================
-- CHECK-INS
-- =====================
create table if not exists checkins (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid not null references users(id),
  manager_id uuid not null references users(id),
  period_id uuid not null references periods(id),
  comment text not null,
  completed_at timestamptz default now()
);

-- =====================
-- APPROVALS
-- =====================
create table if not exists approvals (
  id uuid primary key default uuid_generate_v4(),
  sheet_id uuid not null references goal_sheets(id),
  manager_id uuid not null references users(id),
  decision text not null check (decision in ('approved', 'returned')),
  comment text,
  created_at timestamptz default now()
);

-- =====================
-- AUDIT LOGS (append-only)
-- =====================
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value_json jsonb,
  new_value_json jsonb,
  actor_id uuid references users(id),
  created_at timestamptz default now()
);

-- =====================
-- NOTIFICATIONS
-- =====================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  recipient_id uuid not null references users(id),
  type text not null,
  channel text not null check (channel in ('in_app', 'email', 'teams')),
  status text not null default 'unread' check (status in ('unread', 'read', 'sent')),
  payload_json jsonb,
  created_at timestamptz default now()
);

-- =====================
-- ESCALATIONS
-- =====================
create table if not exists escalations (
  id uuid primary key default uuid_generate_v4(),
  rule_type text not null,
  user_id uuid references users(id),
  manager_id uuid references users(id),
  level integer default 1,
  status text not null default 'open' check (status in ('open', 'resolved', 'escalated')),
  triggered_at timestamptz default now()
);

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_goals_sheet_id on goals(sheet_id);
create index if not exists idx_goal_sheets_employee on goal_sheets(employee_id);
create index if not exists idx_goal_sheets_cycle on goal_sheets(cycle_id);
create index if not exists idx_achievements_goal on achievements(goal_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_notifications_recipient on notifications(recipient_id);
