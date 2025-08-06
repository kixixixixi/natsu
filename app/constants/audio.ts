export const KEYBOARD_NOTES = {
  WHITE_KEYS: [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4",
    "C5", "D5", "E5", "F5", "G5", "A5", "B5"
  ] as const,
  BLACK_KEYS: [
    { note: "C#4", position: 1 },
    { note: "D#4", position: 2 },
    { note: "F#4", position: 4 },
    { note: "G#4", position: 5 },
    { note: "A#4", position: 6 },
    { note: "C#5", position: 8 },
    { note: "D#5", position: 9 },
    { note: "F#5", position: 11 },
    { note: "G#5", position: 12 },
    { note: "A#5", position: 13 },
  ] as const
} as const

export const WIND_CHIME_CONFIG = {
  REVERB: {
    decay: 4,
    preDelay: 0.01,
    wet: 0.6
  },
  SYNTH: {
    harmonicity: 2.5,
    modulationIndex: 12,
    oscillator: {
      type: "sine" as const
    },
    envelope: {
      attack: 0.01,
      decay: 2,
      sustain: 0.1,
      release: 3
    },
    modulation: {
      type: "triangle" as const
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.5,
      sustain: 0.2,
      release: 2
    }
  },
  NOTE_DURATION: "2n" as const
} as const