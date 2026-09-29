-- Supabase migration: Create feedback table with Row Level Security (RLS)
-- Description: Stores testimonials and contact submissions for CouchSync Live

create table if not exists public.feedback (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('testimonial', 'contact')),
    rating smallint check (rating between 1 and 5),
    message text not null check (char_length(message) between 10 and 500),
    nickname text check (char_length(nickname) <= 60),
    email text,
    show_publicly boolean not null default false,
    approved boolean not null default false,
    created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.feedback enable row level security;

-- RLS Policy: Allow anonymous users to submit feedback (INSERT)
create policy "Allow anonymous insert feedback"
    on public.feedback
    for insert
    to anon
    with check (true);

-- RLS Policy: Allow anonymous users to read ONLY approved, public testimonials (SELECT)
create policy "Allow anonymous select approved public testimonials"
    on public.feedback
    for select
    to anon
    using (
        approved = true 
        and show_publicly = true 
        and type = 'testimonial'
    );

-- Index to optimize querying approved public testimonials sorted by creation date
create index if not exists idx_feedback_public_testimonials 
    on public.feedback (created_at desc) 
    where approved = true and show_publicly = true and type = 'testimonial';
