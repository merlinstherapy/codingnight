/** Audio guidance for the exercise player.
 *  - beep():   short countdown tick
 *  - chime():  pleasant "done, move on" cue
 *  - speak():  spoken narration via the browser's built-in speech synthesis
 *  Everything degrades silently if the browser blocks audio. */

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, vol = 0.18) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

/** Short tick — used for 3-2-1 countdowns. */
export function beep() {
  tone(880, 0, 0.12);
}

/** Rising three-note chime — set/exercise complete. */
export function chime() {
  tone(660, 0, 0.16);
  tone(880, 0.16, 0.16);
  tone(1108, 0.32, 0.28, 0.22);
}

/** Deeper double tone — session complete. */
export function fanfare() {
  tone(523, 0, 0.2);
  tone(659, 0.18, 0.2);
  tone(784, 0.36, 0.2);
  tone(1046, 0.54, 0.45, 0.25);
}

/** Speak text aloud. Cancels anything currently being spoken. */
export function speak(text: string, opts?: { rate?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts?.rate ?? 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* narration is best-effort */
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
