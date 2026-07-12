import { NextRequest, NextResponse } from "next/server";

/** POST /api/import
 *  Body: { image: string (base64, no data: prefix), mediaType: "image/jpeg" | "image/png" | "image/webp" }
 *  Returns: { exercises: ExtractedExercise[], prescriber?: string, demo?: boolean }
 *
 *  Reads a photo of a physio exercise handout with Claude vision and extracts a
 *  structured exercise list. With no API key configured it returns a demo routine
 *  so the UI flow can be exercised end-to-end.
 */

export type ExtractedExercise = {
  name: string;
  area: string;
  type: "reps" | "hold";
  reps: number;
  hold_seconds: number;
  sets: number;
  rest_seconds: number;
  cue: string;
  phase: "warmup" | "activate" | "stabilize" | "cooldown";
};

const DEMO_RESPONSE = {
  demo: true,
  prescriber: "Demo — add your ANTHROPIC_API_KEY to read real handouts",
  exercises: [
    { name: "Cat–Cow", area: "Spine mobility", type: "reps", reps: 10, hold_seconds: 0, sets: 1, rest_seconds: 15, cue: "Move slowly with your breath.", phase: "warmup" },
    { name: "Glute Bridge", area: "Glutes", type: "reps", reps: 12, hold_seconds: 0, sets: 3, rest_seconds: 45, cue: "Squeeze your glutes at the top.", phase: "activate" },
    { name: "Bird Dog", area: "Core stability", type: "reps", reps: 10, hold_seconds: 0, sets: 3, rest_seconds: 40, cue: "Keep hips level — no rotation.", phase: "stabilize" },
    { name: "Child's Pose", area: "Cool-down", type: "hold", reps: 0, hold_seconds: 40, sets: 2, rest_seconds: 15, cue: "Sink your hips back and breathe.", phase: "cooldown" },
  ] satisfies ExtractedExercise[],
};

const EXTRACTION_PROMPT = `You are reading a photo of a physiotherapy exercise prescription (a handout, letter, or handwritten note).

Extract every exercise into this exact JSON shape and return ONLY the JSON, no other text:

{
  "prescriber": "name of the prescribing physio/clinic if visible, else null",
  "exercises": [
    {
      "name": "exercise name",
      "area": "body area / purpose, e.g. 'Glutes' or 'Spine mobility'",
      "type": "reps" or "hold",
      "reps": number (0 if type is hold),
      "hold_seconds": number (0 if type is reps),
      "sets": number (default 1 if unspecified),
      "rest_seconds": number (default 30 if unspecified),
      "cue": "one short form cue for doing it safely and well",
      "phase": one of "warmup" | "activate" | "stabilize" | "cooldown"
    }
  ]
}

Rules:
- Only extract exercises actually written on the document. Do not invent exercises.
- If dosage is ambiguous, choose the conservative reading.
- Assign phases so the routine flows warmup → activate → stabilize → cooldown.
- If the image is not an exercise prescription, return {"prescriber": null, "exercises": []}.`;

export async function POST(req: NextRequest) {
  let body: { image?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.includes("REPLACE_ME")) {
    // No key configured yet — return the demo routine so the flow still works.
    return NextResponse.json(DEMO_RESPONSE);
  }

  if (!body.image || !body.mediaType) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(body.mediaType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  // ~10 MB base64 cap to protect the endpoint
  if (body.image.length > 14_000_000) {
    return NextResponse.json({ error: "Image too large — try a smaller photo" }, { status: 413 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: body.mediaType, data: body.image } },
            { type: "text", text: EXTRACTION_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Claude API error:", res.status, detail);
    return NextResponse.json({ error: "Could not read the photo — please try again" }, { status: 502 });
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Couldn't find exercises in this photo — try a clearer shot" }, { status: 422 });
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const exercises = Array.isArray(parsed.exercises) ? parsed.exercises : [];
    return NextResponse.json({ prescriber: parsed.prescriber ?? null, exercises });
  } catch {
    return NextResponse.json({ error: "Couldn't parse the exercises — try a clearer photo" }, { status: 422 });
  }
}
