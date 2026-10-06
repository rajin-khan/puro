-- Run only against the new Puro project before creating the two real users.
-- All fixtures and changes are rolled back. No passwords, email, or tokens.
begin;
do $$begin
 if exists(select 1 from auth.users where email in ('rajin.khan2001@gmail.com','labbaiquahtabassum2001@gmail.com')) then raise exception 'Real accounts already exist; do not run the fixture test.'; end if;
end $$;
insert into auth.users(id,aud,role,email,email_confirmed_at) values
 ('00000000-0000-4000-8000-000000000001','authenticated','authenticated','rajin.khan2001@gmail.com',now()),
 ('00000000-0000-4000-8000-000000000002','authenticated','authenticated','labbaiquahtabassum2001@gmail.com',now()),
 ('00000000-0000-4000-8000-000000000003','authenticated','authenticated','puro-test-outsider@example.invalid',now());
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$declare b jsonb; d jsonb; r jsonb; begin
 b:=public.puro_bootstrap();
 assert b->>'slot'='rajin' and b->>'revision'='0','Rajin bootstrap failed';
 d:=b->'data';
 d:=jsonb_set(d,'{journal}','{"a1-hello":"PRIVATE_SENTINEL_RAJIN"}'::jsonb);
 d:=jsonb_set(d,'{completed}',jsonb_build_object('a1-hello',jsonb_build_object('score',100,'date',now())));
 begin perform public.puro_save(jsonb_build_object('owner','00000000-0000-4000-8000-000000000002','data',d),0); raise exception 'Wrong-account save accepted'; exception when insufficient_privilege then null; end;
 r:=public.puro_save(jsonb_build_object('owner',auth.uid(),'data',d),0); assert r->>'revision'='1','Save failed';
 begin perform public.puro_save(jsonb_build_object('owner',auth.uid(),'data',d),0); raise exception 'Stale save accepted'; exception when sqlstate 'PT409' then null; end;
 begin perform public.puro_save(jsonb_build_object('owner',auth.uid(),'data','{"name":"bad"}'::jsonb),1); raise exception 'Invalid save accepted'; exception when sqlstate '22023' then null; end;
 assert (select count(*) from public.puro_progress)=1,'Owner read failed';
 begin update public.puro_progress set revision=revision+1; raise exception 'Direct write accepted'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$declare b jsonb; s jsonb; begin
 assert (select count(*) from public.puro_progress)=0,'Partner full progress leaked';
 b:=public.puro_bootstrap(); assert b->>'slot'='labbaiqua','Labbaiqua bootstrap failed';
 assert (select count(*) from public.puro_progress)=1,'Partner sees more than own row';
 s:=public.puro_pair_summary();
 assert jsonb_array_length(s)=2,'Pair summary missing learner';
 assert s::text not like '%PRIVATE_SENTINEL%' and s::text not like '%journal%' and s::text not like '%email%','Private content leaked';
 assert exists(select 1 from jsonb_array_elements(s) x where x->>'id'='rajin' and x->>'lessons'='1'),'Partner stats failed';
 perform public.puro_save(jsonb_build_object('owner',auth.uid(),'data',b->'data'),0);
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated"}',true);
do $$begin
 assert (select count(*) from public.puro_progress)=0,'Outsider full progress leaked';
 begin perform public.puro_bootstrap(); raise exception 'Outsider admitted'; exception when insufficient_privilege then null; end;
 begin perform public.puro_pair_summary(); raise exception 'Outsider summary accepted'; exception when insufficient_privilege then null; end;
 begin perform public.puro_save('{}'::jsonb,0); raise exception 'Outsider write accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
do $$begin
 begin perform public.puro_bootstrap(); raise exception 'Anonymous bootstrap accepted'; exception when insufficient_privilege then null; end;
 begin perform public.puro_pair_summary(); raise exception 'Anonymous summary accepted'; exception when insufficient_privilege then null; end;
 begin perform 1 from public.puro_progress; raise exception 'Anonymous read accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Passed: owner saves, private journals, partner summaries, denied outsider/anonymous access, stale revision protection, validation; all fixtures rolled back' as result,
 (select count(*) from auth.users) as remaining_auth_users,
 (select count(*) from public.puro_progress) as remaining_progress_rows;
