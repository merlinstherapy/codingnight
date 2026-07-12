/** Physio exercise library — the search-first path for building a routine.
 *  Cues written to be read aloud by the player narration. */

export type LibraryExercise = {
  id: string;
  name: string;
  area: string;
  tags: string;              // extra search terms
  type: "reps" | "hold";
  defaultReps: number;
  defaultHold: number;       // seconds
  defaultSets: number;
  defaultRest: number;       // seconds
  cue: string;
  phase: "warmup" | "activate" | "stabilize" | "cooldown";
  popular?: boolean;
};

export const EXERCISE_LIBRARY: LibraryExercise[] = [
  { id: "cat-cow", name: "Cat–Cow", area: "Spine mobility", tags: "back spine stretch", type: "reps", defaultReps: 10, defaultHold: 0, defaultSets: 1, defaultRest: 15, cue: "Move slowly with your breath — round and arch one vertebra at a time.", phase: "warmup", popular: true },
  { id: "pelvic-tilt", name: "Pelvic Tilt", area: "Core · lumbar", tags: "back core", type: "reps", defaultReps: 12, defaultHold: 0, defaultSets: 2, defaultRest: 20, cue: "Flatten your lower back gently into the floor. Small, controlled motion.", phase: "warmup" },
  { id: "glute-bridge", name: "Glute Bridge", area: "Glutes", tags: "hip lying bridge", type: "reps", defaultReps: 12, defaultHold: 0, defaultSets: 3, defaultRest: 45, cue: "Squeeze your glutes at the top and keep ribs down — don't arch your lower back.", phase: "activate", popular: true },
  { id: "sl-glute-bridge", name: "Single-leg Glute Bridge", area: "Glutes", tags: "progression bridge", type: "reps", defaultReps: 8, defaultHold: 0, defaultSets: 2, defaultRest: 45, cue: "Keep your hips level as you press up through one heel.", phase: "activate" },
  { id: "band-glute-bridge", name: "Glute Bridge with band", area: "Glutes", tags: "band bridge", type: "reps", defaultReps: 12, defaultHold: 0, defaultSets: 3, defaultRest: 45, cue: "Press your knees gently out into the band as you bridge up.", phase: "activate" },
  { id: "bird-dog", name: "Bird Dog", area: "Core stability", tags: "back core balance", type: "reps", defaultReps: 10, defaultHold: 0, defaultSets: 3, defaultRest: 40, cue: "Reach opposite arm and leg long. Keep hips level — no rotation.", phase: "stabilize", popular: true },
  { id: "mcgill-curlup", name: "McGill Curl-up", area: "Deep core", tags: "core abs", type: "reps", defaultReps: 8, defaultHold: 0, defaultSets: 2, defaultRest: 30, cue: "Hands under your lower back. Lift head and shoulders just slightly.", phase: "stabilize" },
  { id: "dead-bug", name: "Dead Bug", area: "Deep core", tags: "core abs lying", type: "reps", defaultReps: 8, defaultHold: 0, defaultSets: 2, defaultRest: 30, cue: "Lower opposite arm and leg while keeping your back flat on the floor.", phase: "stabilize" },
  { id: "side-plank", name: "Side Plank", area: "Core · obliques", tags: "plank core hold", type: "hold", defaultReps: 0, defaultHold: 20, defaultSets: 2, defaultRest: 30, cue: "Stack your shoulders and hips in one straight line. Breathe.", phase: "stabilize" },
  { id: "heel-slide", name: "Heel Slide", area: "Knee mobility", tags: "knee leg", type: "reps", defaultReps: 10, defaultHold: 0, defaultSets: 2, defaultRest: 20, cue: "Slide your heel toward you slowly, then back out with control.", phase: "warmup" },
  { id: "hamstring-curl", name: "Hamstring Curl", area: "Hamstrings", tags: "leg knee standing", type: "reps", defaultReps: 10, defaultHold: 0, defaultSets: 2, defaultRest: 30, cue: "Bend your knee to bring your heel toward your glutes, slow on the way down.", phase: "activate" },
  { id: "clamshell", name: "Clamshell", area: "Hips · glutes", tags: "hip side lying", type: "reps", defaultReps: 12, defaultHold: 0, defaultSets: 2, defaultRest: 30, cue: "Keep feet together and open your top knee like a clam. Don't roll back.", phase: "activate" },
  { id: "childs-pose", name: "Child's Pose", area: "Cool-down", tags: "back stretch rest", type: "hold", defaultReps: 0, defaultHold: 40, defaultSets: 2, defaultRest: 15, cue: "Sink your hips back and breathe into your lower back. Let tension go.", phase: "cooldown", popular: true },
  { id: "knee-to-chest", name: "Knee to Chest", area: "Cool-down", tags: "back stretch lying", type: "hold", defaultReps: 0, defaultHold: 30, defaultSets: 2, defaultRest: 15, cue: "Hug one knee gently toward your chest and hold, breathing slowly.", phase: "cooldown" },
  { id: "neck-rotation", name: "Neck Rotation", area: "Neck mobility", tags: "neck stretch", type: "reps", defaultReps: 8, defaultHold: 0, defaultSets: 1, defaultRest: 15, cue: "Turn your head slowly to each side, staying within a comfortable range.", phase: "warmup" },
  { id: "wall-slide", name: "Wall Slide", area: "Shoulders", tags: "shoulder posture", type: "reps", defaultReps: 10, defaultHold: 0, defaultSets: 2, defaultRest: 30, cue: "Keep forearms on the wall as you slide your arms up and down.", phase: "activate" },
];

export function searchExercises(query: string): LibraryExercise[] {
  const q = query.trim().toLowerCase();
  if (!q) return EXERCISE_LIBRARY.filter((e) => e.popular);
  return EXERCISE_LIBRARY
    .filter((e) => e.name.toLowerCase().includes(q) || e.area.toLowerCase().includes(q) || e.tags.includes(q))
    .slice(0, 6);
}

const PHASE_ORDER = { warmup: 0, activate: 1, stabilize: 2, cooldown: 3 } as const;

export function sortByPhase<T extends { phase: keyof typeof PHASE_ORDER }>(list: T[]): T[] {
  return [...list].sort((a, b) => PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase]);
}

export const PHASE_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  warmup:    { label: "WARM-UP",   bg: "#e7f1ef", color: "#1f7a6d" },
  activate:  { label: "ACTIVATE",  bg: "#e7f1ef", color: "#155e54" },
  stabilize: { label: "STABILIZE", bg: "#e7f1ef", color: "#155e54" },
  cooldown:  { label: "COOL-DOWN", bg: "#f7ebe2", color: "#c2693f" },
};
