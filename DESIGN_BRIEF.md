# Mend — Design Brief for v2 Revamp

> Hand this to Claude Design alongside the existing `Mend.dc.html`. The v1 frames (import,
> check-in, smart order, home, player A/B, progress) are approved — v2 adds the screens and
> states below, plus the product changes needed to go to market.

## Product one-liner
Your physio prescription, turned into one guided follow-along flow — timed, counted, narrated,
in the right order.

## Positioning & business model (context for design decisions)
- **Wedge:** patients abandon paper exercise handouts; physios have zero visibility into adherence.
- **Phase 1 (B2C validation):** freemium. Free = 1 active routine. Paid (£4–8/mo) = adaptation,
  progress history, unlimited imports, narration voices.
- **Phase 2 (B2B2C, the real business):** clinics subscribe (£30–100/mo) for an adherence
  dashboard; physios prescribe Mend directly. Design should leave room for a "shared with your
  physio" concept.
- **Regulatory guardrail:** adaptation only ever *reduces* intensity or swaps within the
  prescribed list — never prescribes new exercises. Copy must never imply diagnosis or treatment.

## New screens needed (v2)

### 1. Onboarding & consent (3 frames)
- Welcome / value proposition
- **Explicit health-data consent** — checkbox, links to Terms + Privacy, medical disclaimer.
  This is legally required (GDPR special category data / HK PDPO). Must feel caring, not scary.
- Sign-in via email magic link (exists in code at `/login` — needs design love)

### 2. Import flow — completed states
v1 shows the scanning state only. Need:
- Camera/photo picker entry point
- **Review & correct** state: extracted exercises as editable cards (name, sets, reps, hold)
  — OCR/AI will make mistakes; correction must be one tap
- Error state: "couldn't read this — try a clearer photo"
- Empty state for first-time users (no routines yet)

### 3. Player — audio & video layer
Code now has: spoken narration (exercise name + form cue), countdown beeps for the last 3s of
holds and rests, a chime when a set completes, and a fanfare when the session completes —
designed so users don't need to look at the screen. Design needs:
- **Audio settings affordance** on the player: narration on/off, cues on/off, volume
- **Video slot spec**: 4:3 looping demo video per exercise, with fallback illustration state
  (we will film/own all videos — no third-party content)
- Rest screen state (large countdown, "up next" preview, "skip rest" button)
- Session-complete celebration screen (streak update, pain check prompt: "how did that feel?")

### 4. Progress — real-data states
- Empty state (no sessions yet) and 1-week state (sparse data)
- Post-session "how did that feel?" quick log feeding the pain trend

### 5. Profile & account
- Signed-in vs guest ("demo mode") states — exists in code, needs design
- Manage subscription (paywall screen for freemium gate)
- Data controls: export my data, delete account
- Legal: Terms / Privacy (exist as plain pages)

### 6. Paywall (freemium gate)
- Shown when adding a 2nd routine or accessing history >7 days
- Tone: supportive, not punishing. "Keep your recovery going"

### 7. Marketing landing page (desktop-first — NEW)
The app itself stays mobile-shaped, but the product needs a public website that sells it:
- **Hero**: one-liner + phone mockup showing the player mid-session + "Start free" CTA
- **How it works**: 3 steps — snap your prescription → check in daily → follow along
- **Trust section**: medical disclaimer positioning, "built with physiotherapists", privacy promise
- **Pricing**: free vs. paid tier comparison; later a "For clinics" tier teaser
- **Footer**: Terms, Privacy, contact
- Desktop-first responsive; this is the only desktop-designed surface in the product

### 8. App chrome rules (IMPORTANT — applies to every app screen)
The v1 frames draw a fake phone (bezel, notch, "9:41" status bar, home indicator). That was
mockup chrome — **design v2 app screens edge-to-edge with no fake phone frame**:
- On real phones the app runs full-bleed as a PWA; respect safe-area insets (notch/home bar)
- No hardcoded status bar — the real device provides one
- On desktop, app routes render as a centered ~430px column on the sand background
- The phone bezel may still be used in *marketing* imagery (landing page mockups), never in-app

## Existing technical state (already built in code)
- Next.js + Supabase; magic-link auth at `/login`
- Postgres schema with row-level security: profiles, routines, exercises, checkins, sessions
  (`supabase/schema.sql`)
- Check-ins and completed sessions persist for signed-in users; app degrades gracefully to
  demo mode for guests
- Web-audio narration/beeps/chimes in the player (`src/lib/audio.ts`)
- Security headers, PWA manifest, T&C + Privacy draft pages

## Video content strategy (decision made — design around it)
- **No YouTube-sourced content** (ToS + copyright risk for a commercial health product)
- Launch: owned looping demo videos (~50 exercises, filmed with a physiotherapist) or
  commissioned animations; every exercise also needs a static illustration fallback
- Narration is generated from our own cue text (browser TTS now; ElevenLabs later for
  premium voices)

## Design system notes (keep from v1)
- Fonts: Bricolage Grotesque (display) + Hanken Grotesk (body)
- Palette: ink #21201d, sand #e9e7e1/#f6f5f2, navy #123a4f, teal #1f7a6d/#34d0bb,
  warm accent #d2774e
- Dark "Focus" player + light "Coach" player both stay; Coach is the default

## Pre-launch checklist (non-design, tracked here for completeness)
- [ ] Run `supabase/schema.sql` in Supabase SQL editor
- [ ] Configure Supabase Auth: enable email OTP, set site URL to production domain
- [ ] Rotate the Supabase secret key (it was shared in chat) — Dashboard → Settings → API
- [ ] Replace placeholder contacts in Terms/Privacy; lawyer review before launch
- [ ] App icons (192/512px) for PWA manifest
- [ ] Claude-powered prescription import (photo → structured exercises) — next build phase
- [ ] Regulatory review of adaptation copy (MHRA/CE/HK guidance) before scaling
