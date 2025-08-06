import { useRef, useEffect, useCallback } from "react"
import * as Tone from "tone"
import { WIND_CHIME_CONFIG } from "../constants/audio"

export const useWindChime = (duration: string = WIND_CHIME_CONFIG.NOTE_DURATION) => {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)

  useEffect(() => {
    const setupAudio = async () => {
      // Create reverb for spacious wind chime effect
      reverbRef.current = new Tone.Reverb(WIND_CHIME_CONFIG.REVERB)

      // Create a synth with wind chime-like properties
      synthRef.current = new Tone.PolySynth(Tone.FMSynth, WIND_CHIME_CONFIG.SYNTH)

      await reverbRef.current.generate()
      synthRef.current.connect(reverbRef.current)
      reverbRef.current.toDestination()
    }

    setupAudio()

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
      }
    }
  }, [])

  const playNote = useCallback(async (note: string) => {
    if (!synthRef.current) return

    await Tone.start()
    synthRef.current.triggerAttackRelease(note, duration)
  }, [duration])

  return { playNote, synthRef }
}