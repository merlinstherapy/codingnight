# Mend — Public Launch Backlog (parked)

Deferred until the prototype is validated with real users. Reload this file when
preparing for public launch. Nothing here blocks personal use or demos.

## Business / legal
- [ ] Lawyer review of Terms of Service + Privacy Policy (currently marked DRAFT;
      placeholder contacts support@/privacy@/hello@mend.app need real addresses)
- [ ] Regulatory review of the adaptation feature (UK MHRA / EU MDR / HK) —
      current mitigation: only-eases-off design + disclaimers
- [ ] Video content licensing or commissioning (see docs/VIDEO_CONTENT_SPEC.md)
- [ ] Company/entity, insurance, and data-protection registration as applicable

## Payments
- [ ] Stripe integration for the Plus paywall (£5.99/mo, 7-day trial) —
      /paywall UI is built, buttons are display-only
- [ ] Restore-purchase flow, billing portal, webhooks → entitlement flags
- [ ] Enforce free-tier limits in code (1 active routine, 7-day history) —
      currently unenforced

## Infrastructure
- [ ] Custom domain (e.g. mend.app) + update Supabase Auth site URL
- [ ] Custom SMTP for magic links (Resend/Postmark) — Supabase built-in email is
      rate-limited (~3–4/hour) and not launch-grade
- [ ] Supabase paid tier (free tier pauses after inactivity — bad for real users)
- [ ] Error monitoring (Sentry) + analytics (PostHog/Plausible)
- [ ] Rotate ALL keys before launch (Supabase secret, Anthropic, GitHub PAT,
      YouTube) — several were shared in chat during development
- [ ] Service worker for full offline PWA (manifest + icons already done)

## Product (post-validation)
- [ ] Real adaptation rules engine, physio-reviewed (check-in currently saves
      data but the "plan adapted" card is illustrative)
- [ ] Enforce consent gate before app use (consent screen exists; not enforced)
- [ ] Reminder notifications (UI says "remind me at 8:00" — no backend)
- [ ] Routine management: rename, delete, switch active routine
- [ ] "Share with your physio" summary → seed of the B2B2C clinic dashboard
- [ ] Physio dashboard (clinic accounts, prescribe-to-patient, adherence view)
- [ ] Premium narration voices (ElevenLabs or similar) behind Plus
- [ ] Exercise video content shipped per VIDEO_CONTENT_SPEC (owned or licensed)
- [ ] Accessibility pass (screen readers, reduced motion, larger text)
