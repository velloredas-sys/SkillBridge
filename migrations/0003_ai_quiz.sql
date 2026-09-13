-- AI Beta quiz: tag where an assessment came from, and store generated attempts.

alter table assessments add column if not exists source text not null default 'static';

create table if not exists ai_quiz_attempts (
  id serial primary key,
  user_id text not null,
  skill_id text not null,
  timer_seconds int,
  questions jsonb not null,
  score int,
  total int,
  level int,
  created_at timestamptz not null default now(),
  submitted_at timestamptz
);
create index if not exists ai_quiz_attempts_user_idx on ai_quiz_attempts (user_id);
