"use client"

import React, { useCallback } from "react"
import { useWindChime } from "../hooks/useWindChime"
import { useRecording } from "../hooks/useRecording"
import { Controls } from "./Controls"
import { MelodyCanvas } from "./MelodyCanvas"
import { RecordedNotes } from "./RecordedNotes"

const Piano: React.FC = () => {
  const [noteDuration, setNoteDuration] = React.useState("2n")
  const { playNote: playWindChimeNote, synthRef } = useWindChime(noteDuration)
  const {
    isRecording,
    recordedNotes,
    isPlaying,
    startRecording,
    stopRecording,
    addNote,
    playRecording,
    clearRecording,
  } = useRecording({ synthRef })

  const handlePlayNote = useCallback(
    async (note: string) => {
      await playWindChimeNote(note)
      addNote(note)
    },
    [playWindChimeNote, addNote]
  )

  const handleStartDrawing = useCallback(() => {
    if (!isRecording) {
      startRecording()
    }
  }, [isRecording, startRecording])

  const handleEndDrawing = useCallback(() => {
    if (isRecording) {
      stopRecording()
    }
  }, [isRecording, stopRecording])

  return (
    <div className="piano-container">
      <h1>風鈴メロディメーカー</h1>

      <Controls
        isRecording={isRecording}
        isPlaying={isPlaying}
        recordedNotesLength={recordedNotes.length}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onPlayRecording={playRecording}
        onClearRecording={clearRecording}
        noteDuration={noteDuration}
        onDurationChange={setNoteDuration}
      />

      <MelodyCanvas 
        onPlayNote={handlePlayNote} 
        isRecording={isRecording}
        onStartDrawing={handleStartDrawing}
        onEndDrawing={handleEndDrawing}
      />

      <RecordedNotes notes={recordedNotes} />

      <style>{`
        .piano-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        h1 {
          color: white;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}

export default Piano
