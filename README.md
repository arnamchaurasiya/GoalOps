# GoalOps 🎯

> **Enterprise Goal Setting & Tracking Portal** — Built for the Atomberg Hackathon 2026

GoalOps replaces scattered spreadsheets and appraisal chaos with a secure, audit-ready goal operating system for employees, managers, and HR.

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **Role-Based Portal** | Employee, Manager L1, Admin/HR — each with dedicated screens |
| **Goal Builder** | SMART goal creation with thrust areas, UoM, score direction |
| **Live Validation** | Real-time weightage checker (min 10%, total 100%, max 8 goals) |
| **Approval Workflow** | Manager inline editing, approve/return, automatic goal locking |
| **Quarterly Check-ins** | Achievement actuals with computed weighted scores |
| **AI Goal Coach** | Gemini-powered SMART goal transformation + risk flagging |
| **AI Check-in Assistant** | Generates coaching summary and questions from goal progress |
| **Audit Log** | Append-only event trail with JSON diff viewer |
| **HR Dashboard** | Recharts-powered completion heatmap, trend lines, pie charts |
| **Export Center** | CSV download for goals, achievements, audit logs |
| **Demo Role Switcher** | Switch between Alice/Bob/Carol instantly for judges |

---

## 🎭 Demo Credentials

| Role | Name | Notes |
|---|---|---|
| 👤 Employee | Alice Sharma | Create goals, update Q1 progress |
| 👔 Manager | Bob Mehta | Approve Alice's goals, run check-ins |
| 🛡 Admin/HR | Carol D'souza | Dashboard, audit log, export |

Use the **Demo Role Switcher** in the top-right corner to switch instantly.

---

## 🏗 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives, Framer Motion animations
- **Charts**: Recharts (bar, line, pie)
- **Database**: Supabase Postgres + Row Level Security
- **AI**: Google Gemini 1.5 Flash (structured JSON output)
- **Deploy**: Vercel

---

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone https://github.com/your-org/goalops
cd goalops
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Set up the database
1. Go to your Supabase project → SQL Editor
2. Run `supabase/schema.sql`
3. Run `supabase/seed.sql`

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄 Database Schema

14 tables covering the full goal lifecycle:

```
users → departments → cycles → periods → thrust_areas
goal_sheets → goals → shared_goal_groups
achievements → checkins → approvals
audit_logs → notifications → escalations
```

---

## 🤖 AI Features

### Goal Coach (Gemini)
Click the ✨ sparkle icon on any goal to get:
- SMART-formatted improved title and description
- Suggested unit of measure and target
- Score direction recommendation
- Risk flags on weak/vague goals
- Coaching questions for the employee

**Works without API key** — falls back to a realistic mock response for demo reliability.

### Check-in Assistant (Gemini)
In the manager check-in view, click "AI Draft" to:
- Summarize quarterly progress across all goals
- Generate 3 neutral coaching questions
- Assess overall progress trend

---

## 📊 Business Rules

| Rule | Implementation |
|---|---|
| Max 8 goals per sheet | Validated on add |
| Min 10% weightage per goal | Validated on input |
| Total weightage = 100% | Validated before submit |
| Goals lock after approval | Status → `locked`, edit blocked |
| Post-lock edits → audit trail | Every change recorded |
| Score: higher-better | `actual / target × 100` |
| Score: lower-better | `target / actual × 100` |
| Score: binary | `actual === 1 ? 100 : 0` |

---

## 🗺 Demo Flow for Judges

1. **Open app** → See Employee dashboard (Alice Sharma)
2. Go to **My Goals** → Show 4 goals totaling 100% weightage
3. Click **✨ sparkle** on a goal → See AI Goal Coach transform it
4. **Submit to Manager** → Success confirmation
5. **Switch to Bob Mehta** (Manager) via role switcher
6. Go to **Approval Queue** → See Alice's sheet
7. **Edit a weightage inline** → Approve & Lock
8. **Switch back to Alice** → Goals show as 🔒 Locked
9. Go to **Update Progress** → Enter Q1 actuals → See live scores
10. **Switch to Bob** → Check-ins → Click **AI Draft** → Submit
11. **Switch to Carol** (Admin) → HR Dashboard with charts
12. Go to **Audit Log** → Show JSON diffs of every action
13. Go to **Export** → Download CSV

---

## 🏆 Winning Differentiators

1. **Closed business loop** — not just CRUD
2. **AI that's actually useful** — SMART transformation, not chatbot glitter
3. **Audit trail as a feature** — every diff stored and viewable
4. **Demo-first design** — role switcher, seeded data, reliable fallbacks
5. **Enterprise SaaS aesthetics** — dark mode, glassmorphism, animations

---

## 📁 Project Structure

```
src/
  app/
    dashboard/        ← Employee home
    goals/            ← Goal builder + Q1 update
    manager/          ← Team dashboard, approvals, check-ins
    admin/            ← HR dashboard, cycles, audit, export
    api/
      ai/             ← Goal Coach + Check-in Assistant
  components/
    AppShell.tsx      ← Main layout
    Sidebar.tsx       ← Role-aware navigation
    RoleSwitcher.tsx  ← Demo role switcher
    GoalCoach.tsx     ← AI Coach slide-in panel
    StatusChip.tsx    ← Status indicators
  lib/
    types.ts          ← All TypeScript types
    utils.ts          ← Business logic (score formulas)
    role-context.tsx  ← Demo role state
    supabase.ts       ← DB client
supabase/
  schema.sql          ← Full 14-table schema
  seed.sql            ← Demo data
```

---

## 📄 License

MIT — Built for Atomberg Hackathon 2026
