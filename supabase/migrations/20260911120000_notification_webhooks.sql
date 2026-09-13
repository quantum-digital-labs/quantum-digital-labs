-- Enables pg_net (used to call the Edge Function from a trigger) and wires
-- up DB-level triggers that call the "send-notification" Edge Function on:
--   - INSERT into job_applications, internship_applications, inquiries
--   - UPDATE (status change) on job_applications, internship_applications
--
-- Auth: the trigger sends a shared secret as the x-webhook-secret header
-- (checked in supabase/functions/send-notification/index.ts against the
-- WEBHOOK_SECRET function secret). The secret itself is stored in Supabase
-- Vault (vault.decrypted_secrets, name = 'webhook_secret') and looked up at
-- call time — it is NOT hardcoded here, so this migration is safe to commit.
-- The vault entry is created once, out-of-band, via the Supabase CLI/psql.

create extension if not exists pg_net;
create extension if not exists supabase_vault;

create or replace function public.notify_application_email()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  shared_secret text;
begin
  select decrypted_secret into shared_secret
  from vault.decrypted_secrets
  where name = 'webhook_secret'
  limit 1;

  if shared_secret is null then
    -- Vault secret not configured yet; skip the notification instead of
    -- failing the write that triggered this.
    return new;
  end if;

  perform net.http_post(
    url := 'https://bvzpsfryekjtggfxbogd.supabase.co/functions/v1/send-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', shared_secret
    ),
    body := jsonb_build_object(
      'type', tg_op,
      'table', tg_table_name,
      'schema', tg_table_schema,
      'record', to_jsonb(new),
      'old_record', case when tg_op = 'UPDATE' then to_jsonb(old) else null end
    )
  );
  return new;
end;
$$;

revoke all on function public.notify_application_email() from public, anon, authenticated;

drop trigger if exists trg_job_applications_notify on job_applications;
create trigger trg_job_applications_notify
after insert or update on job_applications
for each row execute function public.notify_application_email();

drop trigger if exists trg_internship_applications_notify on internship_applications;
create trigger trg_internship_applications_notify
after insert or update on internship_applications
for each row execute function public.notify_application_email();

drop trigger if exists trg_inquiries_notify on inquiries;
create trigger trg_inquiries_notify
after insert on inquiries
for each row execute function public.notify_application_email();
