// Convert Y position to frequency (Hz)
export const yToFrequency = (y: number, canvasHeight: number): number => {
  // Map Y position to frequency range (400Hz to 4000Hz) - one octave higher
  // Top of canvas = high frequency, bottom = low frequency
  const minFreq = 400
  const maxFreq = 4000
  const normalizedY = 1 - (y / canvasHeight) // Invert Y so top is 1, bottom is 0
  return minFreq + (normalizedY * (maxFreq - minFreq))
}

// Convert frequency to nearest MIDI note
export const frequencyToNote = (frequency: number): string => {
  const A4_FREQ = 440
  const A4_MIDI = 69
  
  // Calculate MIDI note number
  const midiNote = Math.round(A4_MIDI + 12 * Math.log2(frequency / A4_FREQ))
  
  // Convert MIDI note to note name
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(midiNote / 12) - 1
  const noteIndex = midiNote % 12
  
  return `${noteNames[noteIndex]}${octave}`
}

// Convert Y position directly to note
export const yToNote = (y: number, canvasHeight: number): string => {
  const frequency = yToFrequency(y, canvasHeight)
  return frequencyToNote(frequency)
}

// Get grid notes for display
export const getGridNotes = (canvasHeight: number, gridCount: number = 12): Array<{note: string, y: number}> => {
  const notes = []
  for (let i = 0; i <= gridCount; i++) {
    const y = (i * canvasHeight) / gridCount
    const note = yToNote(y, canvasHeight)
    notes.push({ note, y })
  }
  return notes
}