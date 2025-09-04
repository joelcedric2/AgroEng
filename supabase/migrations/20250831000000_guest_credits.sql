-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_guest boolean not null default true,
  plan text not null default 'free',         -- 'free'|'premium'|'pro'
  scan_credits int not null default 5,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "profiles_me_read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_me_update" on public.profiles
for update using (auth.uid() = id);

-- Trigger to auto-create profiles on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, is_guest, plan, scan_credits)
  values (new.id, coalesce((new.raw_user_meta_data->>'is_guest')::boolean, true), 'free', 5)
  on conflict (id) do nothing;
  return new;
end; $$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Scans table
create table if not exists public.scans (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  crop text,
  diagnosis text,
  created_at timestamptz default now()
);

alter table public.scans enable row level security;

create policy "scans_me" on public.scans
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RPC to safely decrement credits
create or replace function public.decrement_scan_credit()
returns table(remaining int)
language plpgsql security definer as $$
begin
  update public.profiles
     set scan_credits = scan_credits - 1
   where id = auth.uid()
     and scan_credits > 0
  returning scan_credits into remaining;

  if not found then
    remaining := -1;
  end if;
  return;
end; $$;

revoke all on function public.decrement_scan_credit() from public;
grant execute on function public.decrement_scan_credit() to authenticated;

-- Entitlements view
create or replace view public.entitlements as
select
  p.id as user_id,
  p.plan,
  p.is_guest,
  p.scan_credits,
  true  as tips_unlimited,
  (p.plan in ('premium','pro')) as advanced_ai,
  (p.plan in ('premium','pro')) as treatment_plans,
  (p.plan in ('premium','pro')) as offline_full
from public.profiles p;

alter table public.entitlements enable row level security;
create policy "ents_me" on public.entitlements
for select using (auth.uid() = user_id);

-- Bonus scans on first real login
create or replace function public.apply_login_bonus()
returns void language sql security definer as $$
  update public.profiles
     set scan_credits = scan_credits + 2
   where id = auth.uid()
     and is_guest = false
     and not exists (
       select 1 from public.scans
       where user_id = auth.uid() and diagnosis = '__bonus_applied__'
     );
  insert into public.scans(user_id, diagnosis) values (auth.uid(), '__bonus_applied__');
$$;

grant execute on function public.apply_login_bonus() to authenticated;
