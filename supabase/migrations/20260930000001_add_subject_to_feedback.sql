-- Supabase migration: Add subject column to feedback table
-- Run this in your Supabase SQL Editor if you already applied the initial migration

alter table if exists public.feedback 
add column if not exists subject text check (char_length(subject) <= 100);
