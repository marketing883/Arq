# Forms & post-submit — follow-up TODO

Status as of this branch (`claude/epic-brahmagupta-jLOsJ`). Deferred until
priority work is done. None of these block the site; they finish and harden
the forms/lead-capture flows.

## P1 — finish the forms fix (do these to call forms "done")
- [ ] Run remaining Supabase migrations (SQL editor, all idempotent):
  - [ ] trigger snippet / `supabase-content-schema.sql` (re-runnable now)
  - [ ] `supabase-lead-capture-schema.sql` — newsletter (table never existed) + resource_leads
  - [ ] `supabase-contact-partner-intake-migration.sql` — contact + partner columns
  - [ ] `supabase-careers-applications-repair.sql` — careers columns + FK
- [ ] Redeploy `claude/epic-brahmagupta-jLOsJ` (several fixes landed since last deploy)
- [ ] Confirm env vars in the HOSTING runtime: `SUPABASE_SERVICE_ROLE_KEY`,
      `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY`
- [ ] Verify schema with the check query (see chat) — expect all tables present
- [ ] Smoke-test each form and confirm the row lands:
      contact, demo, partners, careers, newsletter, whitepaper download
      (use a WORK email — free providers are rejected by design on all but careers)

## P1 — still unconfirmed
- [ ] Careers apply: never seen to succeed end-to-end after columns were added.
      After migrate + redeploy, submit one test; if it still saves nothing,
      capture the on-screen error / Network `apply` Response / `[careers/apply]`
      log line (diagnostic logging is already in the route).

## P2 — optional hardening (deferred; not blocking)
Systemic risk: `contact`, `partner-enquiry`, `newsletter`, `resources/download`
swallow DB insert errors and return success → silent data loss on future
schema drift. To do when ready ("do the form hardening"):
- [ ] Log distinctly on DB write failure in each endpoint
- [ ] `resources/download`: fail loudly if the token can't be stored
      (today it returns a token that then 404s on download)
- [ ] Consider surfacing a clear admin signal when a write backend is misconfigured
