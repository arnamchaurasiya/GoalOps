-- GoalOps Seed Data
-- Run AFTER schema.sql

-- Departments
insert into departments (id, name) values
  ('dept-eng-0000-0000-000000000001', 'Engineering'),
  ('dept-sales-000-0000-000000000002', 'Sales'),
  ('dept-hr-0000-0000-000000000003', 'Human Resources')
on conflict do nothing;

-- Users (demo roles)
insert into users (id, name, email, role, department_id, manager_id) values
  (
    'user-alice-000-0000-000000000001',
    'Alice Sharma',
    'alice@goalops.demo',
    'employee',
    'dept-eng-0000-0000-000000000001',
    'user-bob-00000-0000-000000000002'
  ),
  (
    'user-bob-00000-0000-000000000002',
    'Bob Mehta',
    'bob@goalops.demo',
    'manager',
    'dept-eng-0000-0000-000000000001',
    null
  ),
  (
    'user-carol-000-0000-000000000003',
    'Carol D''souza',
    'carol@goalops.demo',
    'admin',
    'dept-hr-0000-0000-000000000003',
    null
  )
on conflict do nothing;

-- Cycles
insert into cycles (id, name, fiscal_year, status, goal_open_date, goal_close_date) values
  (
    'cycle-2026-000-0000-000000000001',
    'FY 2026 Annual',
    '2026',
    'goal_setting',
    '2026-01-01',
    '2026-03-31'
  )
on conflict do nothing;

-- Periods
insert into periods (id, cycle_id, name, window_open, window_close, type) values
  ('period-q1-000-0000-000000000001', 'cycle-2026-000-0000-000000000001', 'Q1 2026', '2026-04-01', '2026-04-15', 'Q1'),
  ('period-q2-000-0000-000000000002', 'cycle-2026-000-0000-000000000001', 'Q2 2026', '2026-07-01', '2026-07-15', 'Q2'),
  ('period-q3-000-0000-000000000003', 'cycle-2026-000-0000-000000000001', 'Q3 2026', '2026-10-01', '2026-10-15', 'Q3'),
  ('period-q4-000-0000-000000000004', 'cycle-2026-000-0000-000000000001', 'Q4 2026', '2027-01-01', '2027-01-15', 'Q4')
on conflict do nothing;

-- Thrust Areas
insert into thrust_areas (id, name, description) values
  ('thrust-growth-0-0000-000000000001', 'Revenue Growth', 'Drive top-line revenue and market expansion'),
  ('thrust-ops-000-0000-000000000002', 'Operational Excellence', 'Improve efficiency and reduce costs'),
  ('thrust-people-0-0000-000000000003', 'People Development', 'Build skills and leadership pipeline'),
  ('thrust-tech-000-0000-000000000004', 'Technology & Innovation', 'Modernize systems and drive innovation'),
  ('thrust-cust-000-0000-000000000005', 'Customer Delight', 'Improve NPS and customer satisfaction')
on conflict do nothing;

-- Goal Sheet for Alice (draft)
insert into goal_sheets (id, employee_id, cycle_id, status) values
  ('sheet-alice-0-0000-000000000001', 'user-alice-000-0000-000000000001', 'cycle-2026-000-0000-000000000001', 'draft')
on conflict do nothing;

-- Goals for Alice
insert into goals (id, sheet_id, thrust_area_id, title, description, uom_type, score_direction, target_value, target_date, weightage, status) values
  (
    'goal-alice-1-0000-000000000001',
    'sheet-alice-0-0000-000000000001',
    'thrust-tech-000-0000-000000000004',
    'Reduce API response time by 40%',
    'Optimize backend services to achieve sub-200ms P95 API response time across all critical endpoints.',
    'percentage',
    'lower_better',
    40,
    '2026-12-31',
    30,
    'draft'
  ),
  (
    'goal-alice-2-0000-000000000002',
    'sheet-alice-0-0000-000000000001',
    'thrust-ops-000-0000-000000000002',
    'Achieve 95% unit test coverage',
    'Increase automated test coverage from current 72% to 95% across all microservices.',
    'percentage',
    'higher_better',
    95,
    '2026-09-30',
    25,
    'draft'
  ),
  (
    'goal-alice-3-0000-000000000003',
    'sheet-alice-0-0000-000000000001',
    'thrust-people-0-0000-000000000003',
    'Complete 3 technical certifications',
    'Obtain AWS Solutions Architect, Kubernetes, and system design certifications.',
    'number',
    'higher_better',
    3,
    '2026-12-31',
    20,
    'draft'
  ),
  (
    'goal-alice-4-0000-000000000004',
    'sheet-alice-0-0000-000000000001',
    'thrust-cust-000-0000-000000000005',
    'Zero P0 bugs in production',
    'Maintain zero critical production incidents attributable to the team for entire FY26.',
    'binary',
    'binary',
    1,
    '2026-12-31',
    25,
    'draft'
  )
on conflict do nothing;

-- Audit log for sheet creation
insert into audit_logs (entity_type, entity_id, action, new_value_json, actor_id) values
  ('goal_sheet', 'sheet-alice-0-0000-000000000001', 'created', '{"status":"draft"}', 'user-alice-000-0000-000000000001');
