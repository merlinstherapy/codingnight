# Mend — Exercise Demo Animation/Video Content Spec

Use this to evaluate content libraries, stock providers, or animation vendors.
The goal: a plug-in library of exercise demonstrations that plays in the app's
player while Mend's own timer, rep counter and narration run alongside.

## What the content must show
Per exercise, one looping demonstration of a person (or illustrated figure)
performing ONE complete rep cycle (or holding the position, for holds):
- Side-on framing preferred, full body always in frame
- Neutral start position → movement → return to neutral (so the loop is seamless)
- Slow, controlled tempo (~4–6 s per rep cycle) — patients follow along in real time
- No on-screen text, no baked-in countdowns/rep counters, no baked-in audio/music
  (Mend supplies timing, counting and narration itself)
- Plain background; ideally warm/neutral to match brand (sand #f6f5f2), but any
  clean background is acceptable

## Technical requirements
| Requirement | Spec |
|---|---|
| Format | MP4 (H.264) or WebM; Lottie/JSON or GIF acceptable for illustrated style |
| Aspect ratio | 4:3 (the player slot); 16:9 acceptable if croppable |
| Resolution | ≥ 720p for video; vector preferred for animation |
| Duration | 4–12 s seamless loop per exercise |
| Audio | None (or removable) |
| Delivery | Direct file licensing or CDN/API embed we can call per exercise name/ID |
| Size | ≤ ~10 MB per clip preferred (mobile networks) |

## Coverage needed (launch set — 16, growing to ~50)
Cat–Cow · Pelvic Tilt · Glute Bridge · Single-leg Glute Bridge · Glute Bridge
with band · Bird Dog · McGill Curl-up · Dead Bug · Side Plank · Heel Slide ·
Hamstring Curl · Clamshell · Child's Pose · Knee to Chest · Neck Rotation ·
Wall Slide
(Category coverage that matters: lumbar/core rehab, hip/glute, neck/shoulder,
knee rehab — i.e. common physiotherapy home-exercise-programme movements, NOT
gym/bodybuilding content.)

## Licensing requirements (the dealbreakers)
1. **Commercial use in a paid consumer app** (freemium subscription)
2. Sublicensable display to our end users on web/PWA
3. No YouTube-sourced or scraped content — must be the library's own content
4. Perpetual or subscription license both fine; per-clip or bundle pricing both fine
5. Clinical accuracy: content produced or reviewed by physio/health professionals
   strongly preferred (this is a rehab product, not fitness)

## Nice-to-haves
- Both a video style AND an illustrated/animated style (we ship illustration as
  the low-bandwidth fallback)
- Metadata per clip: muscle group, position (lying/standing/kneeling), equipment
- API lookup by exercise name
- Localizable (no spoken language baked in — see audio rule above)

## Questions to ask any vendor
- Can we cache/host clips on our own CDN, or embed-only?
- Price at 16 clips now / ~50 within 6 months / full library?
- Do they license to digital-health apps (any MDR/medical-device restrictions)?
- Attribution requirements in-app?

## Candidates to research (verify licensing before use)
- Physiotec, Wibbi, Physitrack/PhysiApp content licensing (physio HEP incumbents —
  do they license content separately?)
- MedBridge HEP library
- ExerciseDB / similar exercise APIs with animated GIFs (check commercial terms!)
- MuscleWiki (check licensing)
- Stock: Envato Elements / Storyblocks "physiotherapy exercise" clips (check the
  loop + no-text requirements)
- Commissioning: a physio-content studio or animator producing ~16 Lottie/MP4
  loops to this spec (often cheaper than expected and fully owned)
