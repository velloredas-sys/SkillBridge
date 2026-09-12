create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('student', 'industry', 'college')),
  name text not null,
  headline text not null default '',
  bio text not null default '',
  college_name text not null default '',
  company_name text not null default '',
  location text not null default '',
  year_label text not null default '',
  career_goal text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists student_skills (
  user_id text not null,
  skill_id text not null,
  self_level int not null default 0 check (self_level between 0 and 5),
  assessed_level int check (assessed_level is null or assessed_level between 0 and 5),
  assessed_at timestamptz,
  primary key (user_id, skill_id)
);
create index if not exists student_skills_user_idx on student_skills (user_id);

create table if not exists assessments (
  id serial primary key,
  user_id text not null,
  skill_id text not null,
  score int not null,
  total int not null,
  level int not null,
  created_at timestamptz not null default now()
);
create index if not exists assessments_user_idx on assessments (user_id);

create table if not exists portfolio_items (
  id serial primary key,
  user_id text not null,
  kind text not null check (kind in ('project', 'certification', 'achievement')),
  title text not null,
  description text not null default '',
  url text not null default '',
  skills text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists portfolio_user_idx on portfolio_items (user_id);

create table if not exists lesson_progress (
  user_id text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists opportunities (
  id serial primary key,
  poster_user_id text not null,
  company text not null,
  title text not null,
  kind text not null check (kind in ('internship', 'job')),
  location text not null,
  work_mode text not null check (work_mode in ('remote', 'hybrid', 'onsite')),
  stipend text not null default '',
  duration text not null default '',
  description text not null,
  required_skills jsonb not null default '[]'::jsonb,
  deadline text not null default '',
  open boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists opportunities_open_idx on opportunities (open, created_at desc);

create table if not exists applications (
  id serial primary key,
  user_id text not null,
  opportunity_id int not null references opportunities(id) on delete cascade,
  match_pct int not null,
  cover_note text not null default '',
  status text not null default 'applied' check (status in ('applied', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
create index if not exists applications_opp_idx on applications (opportunity_id);
create index if not exists applications_user_idx on applications (user_id);

create table if not exists ai_plans (
  user_id text primary key,
  career_goal text not null,
  plan_text text not null,
  created_at timestamptz not null default now()
);

insert into opportunities (
  poster_user_id, company, title, kind, location, work_mode, stipend, duration,
  description, required_skills, deadline
) values
(
  'seed', 'Razorpay', 'SDE Intern — Platform', 'internship', 'Bengaluru', 'hybrid',
  '₹80,000 / mo', '12 weeks',
  'Work on payment routing, merchant dashboards, and reliability for India''s largest payment stack. You will ship production TypeScript with senior engineers and own a well-scoped intern project.',
  '[{"id":"javascript","level":4},{"id":"dsa","level":3},{"id":"sql","level":3},{"id":"git","level":3},{"id":"react","level":3}]'::jsonb,
  'Rolling'
),
(
  'seed', 'Zoho', 'Software Engineer Intern', 'internship', 'Chennai', 'onsite',
  '₹35,000 / mo', '6 months',
  'Join Zoho''s product teams building CRM, Mail, or Books. Strong CS fundamentals, Java or C++, and a bias for shipping complete features from UI to datastore.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":3},{"id":"git","level":3}]'::jsonb,
  '30 Oct 2026'
),
(
  'seed', 'Microsoft', 'SWE Intern', 'internship', 'Hyderabad', 'hybrid',
  '₹1,25,000 / mo', '12 weeks',
  'Summer internship on Azure, Office, or India engineering teams. Expect a design doc, code reviews, and a demo. DSA plus one strong language required.',
  '[{"id":"dsa","level":4},{"id":"cpp","level":3},{"id":"java","level":3},{"id":"git","level":3},{"id":"os","level":2}]'::jsonb,
  '15 Nov 2026'
),
(
  'seed', 'Flipkart', 'SDE Intern', 'internship', 'Bengaluru', 'onsite',
  '₹1,00,000 / mo', '8–12 weeks',
  'Build customer-facing flows for India''s largest marketplace. Java/Kotlin services, large-scale SQL, and a taste for product sense.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":3},{"id":"systemdesign","level":2}]'::jsonb,
  '01 Nov 2026'
),
(
  'seed', 'CRED', 'Backend Intern', 'internship', 'Bengaluru', 'hybrid',
  '₹1,00,000 / mo', '6 months',
  'Work on credit, collections, or member rewards. Kotlin/Java services, Postgres, and high-bar code review culture.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":4},{"id":"systemdesign","level":2}]'::jsonb,
  'Rolling'
),
(
  'seed', 'Postman', 'Developer Intern', 'internship', 'Bengaluru', 'hybrid',
  '₹70,000 / mo', '12 weeks',
  'Help shape the API platform millions of developers use. JavaScript/TypeScript, API design, and a love of developer tools.',
  '[{"id":"javascript","level":4},{"id":"react","level":3},{"id":"node","level":3},{"id":"git","level":3}]'::jsonb,
  '20 Oct 2026'
),
(
  'seed', 'Atlassian', 'Software Engineer Intern', 'internship', 'Bengaluru', 'hybrid',
  '₹1,10,000 / mo', '12 weeks',
  'Contribute to Jira, Confluence, or platform. Java, design docs, and collaboration at scale. Interns present to the org at the end of the term.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":3},{"id":"git","level":3}]'::jsonb,
  '12 Nov 2026'
),
(
  'seed', 'PhonePe', 'SDE Intern', 'internship', 'Bengaluru', 'onsite',
  '₹90,000 / mo', '8–12 weeks',
  'Payments, UPI, and merchant acquiring. Java services, distributed systems basics, and a high bar for correctness.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":3},{"id":"os","level":2}]'::jsonb,
  '05 Nov 2026'
),
(
  'seed', 'Groww', 'SDE Intern — Frontend', 'internship', 'Bengaluru', 'hybrid',
  '₹60,000 / mo', '6 months',
  'Ship investor-facing web for stocks, mutual funds, and F&O. React, TypeScript, performance, and accessible UI.',
  '[{"id":"javascript","level":4},{"id":"react","level":4},{"id":"htmlcss","level":3},{"id":"git","level":3}]'::jsonb,
  'Rolling'
),
(
  'seed', 'Freshworks', 'Software Engineer Intern', 'internship', 'Chennai', 'hybrid',
  '₹40,000 / mo', '6 months',
  'SaaS products used by 60k+ companies. Ruby or JavaScript, SQL, and customer empathy. Strong intern-to-full-time conversion.',
  '[{"id":"javascript","level":3},{"id":"sql","level":3},{"id":"dsa","level":3},{"id":"git","level":3}]'::jsonb,
  '18 Oct 2026'
),
(
  'seed', 'Amazon', 'SDE Intern', 'internship', 'Bengaluru / Hyderabad', 'onsite',
  '₹1,20,000 / mo', '12 weeks',
  'Two-month (or more) internship with a new-hire project, code reviews, and a debrief. Data structures, OOP, and one of Java/C++/Python.',
  '[{"id":"dsa","level":5},{"id":"java","level":3},{"id":"cpp","level":3},{"id":"os","level":3}]'::jsonb,
  '01 Dec 2026'
),
(
  'seed', 'Google', 'STEP Intern', 'internship', 'Bengaluru / Hyderabad', 'onsite',
  '₹1,20,000 / mo', '12 weeks',
  'Student Training in Engineering Program for 1st/2nd years. CS fundamentals, pair programming, and a supportive first industry experience.',
  '[{"id":"dsa","level":3},{"id":"python","level":3},{"id":"git","level":2},{"id":"htmlcss","level":2}]'::jsonb,
  '20 Oct 2026'
),
(
  'seed', 'Infosys', 'InStep / SES Intern', 'internship', 'Mysuru / Pune', 'onsite',
  '₹25,000 / mo', '8–16 weeks',
  'Enterprise delivery internships across BFSI and manufacturing accounts. Java, SQL, and communication. Campus-style training plus a project.',
  '[{"id":"java","level":3},{"id":"sql","level":3},{"id":"dsa","level":2},{"id":"git","level":2}]'::jsonb,
  'Rolling'
),
(
  'seed', 'TCS', 'Digital Intern', 'internship', 'Pan India', 'hybrid',
  '₹20,000 / mo', '8 weeks',
  'TCS Digital internship for students targeting NQT Digital. Java or Python, SQL, and a mini-project with a delivery unit.',
  '[{"id":"java","level":3},{"id":"python","level":3},{"id":"sql","level":3},{"id":"dsa","level":2}]'::jsonb,
  'Rolling'
),
(
  'seed', 'Bosch', 'Embedded Software Intern', 'internship', 'Bengaluru', 'onsite',
  '₹30,000 / mo', '6 months',
  'Automotive embedded software in C/C++. RTOS basics, hardware bring-up with mentors, and ISO-minded engineering.',
  '[{"id":"c","level":4},{"id":"cpp","level":3},{"id":"os","level":3},{"id":"git","level":2}]'::jsonb,
  '28 Oct 2026'
),
(
  'seed', 'ISRO', 'Computer Science Intern', 'internship', 'Bengaluru / Ahmedabad', 'onsite',
  'Stipend as per ISRO norms', '4–8 weeks',
  'Project internship with ISRO centres. Scientific computing, C/Python, and documentation discipline. Apply via the centre internship portal.',
  '[{"id":"python","level":3},{"id":"c","level":3},{"id":"dsa","level":3},{"id":"linux","level":2}]'::jsonb,
  'Centre-wise'
),
(
  'seed', 'Ministry of Ayush', 'AYUSH Digital Intern', 'internship', 'New Delhi / Remote', 'hybrid',
  'As per ministry norms', '8–12 weeks',
  'Help build digital public goods for AYUSH — registries, practitioner directories, and knowledge graphs for classical texts. A rare mix of public-interest tech and domain research.',
  '[{"id":"python","level":3},{"id":"sql","level":3},{"id":"javascript","level":2},{"id":"htmlcss","level":2}]'::jsonb,
  'Rolling'
),
(
  'seed', 'Razorpay', 'Backend Engineer', 'job', 'Bengaluru', 'hybrid',
  '₹18–28 LPA', 'Full-time',
  'New-grad / 0–2 YOE role on the payments platform. Ownership of APIs, observability, and on-call with a mentor. Strong DSA and backend fundamentals.',
  '[{"id":"javascript","level":4},{"id":"node","level":4},{"id":"sql","level":4},{"id":"dsa","level":4},{"id":"systemdesign","level":3}]'::jsonb,
  'Open'
),
(
  'seed', 'Zoho', 'Member Technical Staff', 'job', 'Chennai / Tenkasi', 'onsite',
  '₹7–12 LPA', 'Full-time',
  'Classic Zoho MTS hiring. CS core, Java or C++, and a long-form interview. No off-campus drama — show up with fundamentals.',
  '[{"id":"java","level":4},{"id":"dsa","level":4},{"id":"sql","level":3},{"id":"os","level":3}]'::jsonb,
  'Open'
),
(
  'seed', 'Freshworks', 'Software Engineer I', 'job', 'Chennai', 'hybrid',
  '₹10–16 LPA', 'Full-time',
  'Product engineering on CX suites. JavaScript or Java, testing culture, and customer-facing quality.',
  '[{"id":"javascript","level":4},{"id":"sql","level":3},{"id":"dsa","level":3},{"id":"react","level":3}]'::jsonb,
  'Open'
);
