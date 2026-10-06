-- Puro: additive setup. No existing tables or users are removed.
begin;
create schema if not exists puro_private;
revoke all on schema puro_private from public, anon;
grant usage on schema puro_private to authenticated;

create table if not exists puro_private.members (
  slot text primary key check (slot in ('rajin','labbaiqua')),
  email text not null unique,
  name text not null,
  user_id uuid unique references auth.users(id)
);
alter table puro_private.members enable row level security;
revoke all on puro_private.members from public, anon, authenticated;
insert into puro_private.members(slot,email,name) values
 ('rajin','rajin.khan2001@gmail.com','Rajin'),
 ('labbaiqua','labbaiquahtabassum2001@gmail.com','Labbaiqua')
on conflict (slot) do nothing;

create or replace function puro_private.valid_state(d jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare k text; v jsonb;
begin
 if d is null or jsonb_typeof(d) <> 'object' or octet_length(d::text)>2500000 then return false; end if;
 if exists(select 1 from jsonb_object_keys(d) x where x not in ('name','goal','completed','review','days','journal','assessment','customWords','mistakes','missions','sessions','checkpoints','draft')) then return false; end if;
 if jsonb_typeof(d->'name') is distinct from 'string' or length(trim(d->>'name')) not between 1 and 30 or d->>'goal' not in ('10','15','30','45') then return false; end if;
 foreach k in array array['completed','review','days','journal','assessment','customWords','mistakes','missions','sessions','checkpoints'] loop
  if jsonb_typeof(d->k) is distinct from 'object' then return false; end if;
  if (select count(*) from jsonb_object_keys(d->k))>3000 or exists(select 1 from jsonb_object_keys(d->k) x where x in ('__proto__','constructor','prototype')) then return false; end if;
 end loop;
 for k,v in select * from jsonb_each(d->'days') loop
  if k !~ '^\d{4}-\d{2}-\d{2}$' or jsonb_typeof(v) <> 'number' or v::text::numeric not between 0 and 10000 then return false; end if;
 end loop;
 for k,v in select * from jsonb_each(d->'journal') loop
  if length(k) not between 1 and 100 or jsonb_typeof(v) <> 'string' or length(v #>> '{}')>15000 then return false; end if;
 end loop;
 for k,v in select * from jsonb_each(d->'completed') loop
  if k !~ '^[a-z0-9-]{1,50}$' or jsonb_typeof(v->'score') is distinct from 'number' or (v->>'score')::numeric not between 0 and 100 or jsonb_typeof(v->'date') is distinct from 'string' then return false; end if;
 end loop;
 for k,v in select * from jsonb_each(d->'review') loop
  if length(k) not between 1 and 80 or jsonb_typeof(v->'due') is distinct from 'number' or (v->>'stage') !~ '^[0-6]$' then return false; end if;
 end loop;
 return true;
exception when others then return false;
end $$;

create table if not exists public.puro_progress (
 user_id uuid primary key references auth.users(id),
 data jsonb not null check (puro_private.valid_state(data)),
 revision bigint not null default 0 check (revision>=0),
 updated_at timestamptz not null default now()
);
alter table public.puro_progress enable row level security;
revoke all on public.puro_progress from public, anon, authenticated;
grant select on public.puro_progress to authenticated;
create policy puro_read_own on public.puro_progress for select to authenticated using ((select auth.uid()) = user_id);

create or replace function puro_private.require_member()
returns text language plpgsql security definer set search_path = '' as $$
declare s text;
begin
 select m.slot into s from puro_private.members m join auth.users u on lower(u.email)=m.email
 where u.id=auth.uid() and u.email_confirmed_at is not null and (m.user_id is null or m.user_id=u.id);
 if s is null then raise exception using errcode='42501',message='This account is not one of the two Puro learners, or its email is unconfirmed.'; end if;
 return s;
end $$;

create or replace function puro_private.bootstrap()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s text; n text; p public.puro_progress;
begin
 s:=puro_private.require_member();
 update puro_private.members set user_id=auth.uid() where slot=s and (user_id is null or user_id=auth.uid()) returning name into n;
 if n is null then raise exception using errcode='42501',message='Learner already belongs to a different account.'; end if;
 insert into public.puro_progress(user_id,data) values(auth.uid(),jsonb_build_object('name',n,'goal',30,'completed','{}'::jsonb,'review','{}'::jsonb,'days','{}'::jsonb,'journal','{}'::jsonb,'assessment','{}'::jsonb,'customWords','{}'::jsonb,'mistakes','{}'::jsonb,'missions','{}'::jsonb,'sessions','{}'::jsonb,'checkpoints','{}'::jsonb,'draft',null)) on conflict(user_id) do nothing;
 select * into p from public.puro_progress where user_id=auth.uid();
 return jsonb_build_object('slot',s,'data',p.data,'revision',p.revision,'updatedAt',p.updated_at);
end $$;

create or replace function puro_private.save_progress(progress jsonb, expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r bigint;
begin
 perform puro_private.require_member();
 if progress->>'owner' is distinct from auth.uid()::text then raise exception using errcode='42501',message='The signed-in account changed. Reload before saving.'; end if;
 progress:=progress->'data';
 if not puro_private.valid_state(progress) or expected_revision is null or expected_revision<0 then raise exception using errcode='22023',message='Invalid progress data.'; end if;
 update public.puro_progress set data=progress,revision=revision+1,updated_at=now()
 where user_id=auth.uid() and revision=expected_revision returning revision into r;
 if r is null then raise exception using errcode='PT409',message='Progress changed on another device. Download your work, then load the latest cloud progress.'; end if;
 return jsonb_build_object('revision',r);
end $$;

create or replace function puro_private.pair_summary()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
 perform puro_private.require_member();
 return (select jsonb_agg(jsonb_build_object(
 'id',m.slot,'name',coalesce(p.data->>'name',m.name),'started',p.user_id is not null,
 'lessons',(select count(*) from jsonb_object_keys(coalesce(p.data->'completed','{}'::jsonb))),
 'words',(select count(*) from jsonb_object_keys(coalesce(p.data->'review','{}'::jsonb))),
 'minutes',(select coalesce(sum(value::text::numeric),0) from jsonb_each(coalesce(p.data->'days','{}'::jsonb))),
 'practiceRounds',(select count(*) from jsonb_object_keys(coalesce(p.data->'sessions','{}'::jsonb))),
 'updatedAt',p.updated_at
 ) order by m.slot desc) from puro_private.members m left join public.puro_progress p on p.user_id=m.user_id);
end $$;

-- Only invoker wrappers are exposed through the Data API.
create or replace function public.puro_bootstrap() returns jsonb language sql security invoker set search_path='' as $$select puro_private.bootstrap()$$;
create or replace function public.puro_save(progress jsonb,expected_revision bigint) returns jsonb language sql security invoker set search_path='' as $$select puro_private.save_progress(progress,expected_revision)$$;
create or replace function public.puro_pair_summary() returns jsonb language sql security invoker set search_path='' as $$select puro_private.pair_summary()$$;
revoke all on all functions in schema puro_private from public,anon,authenticated;
grant execute on function puro_private.valid_state(jsonb), puro_private.bootstrap(), puro_private.save_progress(jsonb,bigint), puro_private.pair_summary() to authenticated;
revoke all on function public.puro_bootstrap(),public.puro_save(jsonb,bigint),public.puro_pair_summary() from public,anon;
grant execute on function public.puro_bootstrap(),public.puro_save(jsonb,bigint),public.puro_pair_summary() to authenticated;
notify pgrst,'reload schema';
commit;
select 'Puro setup complete' as result;
