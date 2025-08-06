import { useState, useRef, useCallback } from "react"
import * as Tone from "tone"
import { WIND_CHIME_CONFIG } from "../constants/audio"

export interface Note {
  note: string
  time: number
}

interface UseRecordingProps {
  synthRef: React.MutableRefObject<Tone.PolySynth | null>
}

export const useRecording = ({ synthRef }: UseRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState<Note[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const recordingStartTime = useRef<number>(0)

  const startRecording = useCallback(() => {
    setIsRecording(true)
    setRecordedNotes([])
    recordingStartTime.current = Date.now()
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
  }, [])

  const addNote = useCallback((note: string) => {
    if (!isRecording) return

    const currentTime = Date.now() - recordingStartTime.current
    setRecordedNotes(prev => [...prev, { note, time: currentTime }])
  }, [isRecording])

  const playRecording = useCallback(async () => {
    if (recordedNotes.length === 0 || !synthRef.current) return

    setIsPlaying(true)
    await Tone.start()

    recordedNotes.forEach(({ note, time }) => {
      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.triggerAttackRelease(note, WIND_CHIME_CONFIG.NOTE_DURATION)
        }
      }, time)
    })

    const maxTime = Math.max(...recordedNotes.map(n => n.time))
    setTimeout(() => {
      setIsPlaying(false)
    }, maxTime + 1000)
  }, [recordedNotes, synthRef])

  const clearRecording = useCallback(() => {
    setRecordedNotes([])
  }, [])

  return {
    isRecording,
    recordedNotes,
    isPlaying,
    startRecording,
    stopRecording,
    addNote,
    playRecording,
    clearRecording
  }
}