-- Run this in Supabase SQL Editor once to enable persistent live data.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  fullName text not null,
  email text unique not null,
  passwordHash text not null,
  role text not null check (role in ('admin', 'volunteer')),
  phone text,
  location text,
  skills text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.volunteers (
  id uuid primary key,
  name text,
  email text,
  role text default 'volunteer',
  status text default 'approved',
  skills text[] default '{}',
  eventsJoined int default 0,
  hoursWorked int default 0,
  impactScore int default 0,
  location text,
  coordinates jsonb,
  onDuty boolean default false,
  available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text,
  name text,
  description text,
  location text,
  date timestamptz,
  status text default 'planned',
  volunteersRequired int default 0,
  assignedVolunteers uuid[] default '{}',
  resourcesRequired jsonb default '[]'::jsonb,
  coordinates jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  resourceName text,
  name text,
  quantity int default 0,
  status text default 'available',
  location text,
  coordinates jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.volunteer_activity (
  id uuid primary key default gen_random_uuid(),
  volunteerId uuid,
  eventId uuid,
  hoursContributed int default 0,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text default 'open',
  urgency text,
  location text,
  createdBy uuid,
  assignedVolunteers uuid[] default '{}',
  coordinates jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  userId uuid,
  title text,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.disasters (
  id uuid primary key default gen_random_uuid(),
  type text,
  location text,
  severity text,
  status text default 'active',
  coordinates jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text default 'pending',
  assignedVolunteer uuid,
  eventId uuid,
  createdBy uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  senderId uuid,
  senderRole text,
  senderName text,
  title text,
  body text,
  priority text default 'normal',
  recipientScope text default 'all',
  recipientUserId uuid,
  created_at timestamptz default now()
);

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  volunteerId uuid,
  rank int,
  score int default 0,
  hoursWorked int default 0,
  eventsJoined int default 0,
  updated_at timestamptz default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text,
  actorId uuid,
  details text,
  metadata jsonb,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  source text,
  uploadedBy uuid,
  uploadedAt timestamptz default now(),
  metrics jsonb,
  counts jsonb,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.volunteers enable row level security;
alter table public.events enable row level security;
alter table public.resources enable row level security;
alter table public.volunteer_activity enable row level security;
alter table public.help_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.disasters enable row level security;
alter table public.tasks enable row level security;
alter table public.messages enable row level security;
alter table public.leaderboard enable row level security;
alter table public.activity_logs enable row level security;
alter table public.analytics enable row level security;

create policy if not exists users_service_all on public.users for all using (true) with check (true);
create policy if not exists volunteers_service_all on public.volunteers for all using (true) with check (true);
create policy if not exists events_service_all on public.events for all using (true) with check (true);
create policy if not exists resources_service_all on public.resources for all using (true) with check (true);
create policy if not exists volunteer_activity_service_all on public.volunteer_activity for all using (true) with check (true);
create policy if not exists help_requests_service_all on public.help_requests for all using (true) with check (true);
create policy if not exists notifications_service_all on public.notifications for all using (true) with check (true);
create policy if not exists disasters_service_all on public.disasters for all using (true) with check (true);
create policy if not exists tasks_service_all on public.tasks for all using (true) with check (true);
create policy if not exists messages_service_all on public.messages for all using (true) with check (true);
create policy if not exists leaderboard_service_all on public.leaderboard for all using (true) with check (true);
create policy if not exists activity_logs_service_all on public.activity_logs for all using (true) with check (true);
create policy if not exists analytics_service_all on public.analytics for all using (true) with check (true);
