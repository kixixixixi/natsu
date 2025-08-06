"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import * as Tone from "tone"

interface Note {
  note: string
  time: number
}

const Piano: React.FC = () => {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState<Note[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const recordingStartTime = useRef<number>(0)

  useEffect(() => {
    const setupAudio = async () => {
      // Create reverb for spacious wind chime effect
      reverbRef.current = new Tone.Reverb({
        decay: 4,
        preDelay: 0.01,
        wet: 0.6,
      })

      // Create a synth with wind chime-like properties
      synthRef.current = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 2.5,
        modulationIndex: 12,
        oscillator: {
          type: "sine",
        },
        envelope: {
          attack: 0.01,
          decay: 2,
          sustain: 0.1,
          release: 3,
        },
        modulation: {
          type: "triangle",
        },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.5,
          sustain: 0.2,
          release: 2,
        },
      })
      const reverb = new Tone.Reverb({
        decay: 5,
        preDelay: 0.01,
      }).toDestination()
      synthRef.current.connect(reverb)

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

  const playNote = useCallback(
    async (note: string) => {
      if (!synthRef.current) return

      await Tone.start()
      // Longer duration for wind chime effect
      synthRef.current.triggerAttackRelease(note, "2n")

      if (isRecording) {
        const currentTime = Date.now() - recordingStartTime.current
        setRecordedNotes((prev) => [...prev, { note, time: currentTime }])
      }
    },
    [isRecording]
  )

  const startRecording = useCallback(() => {
    setIsRecording(true)
    setRecordedNotes([])
    recordingStartTime.current = Date.now()
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
  }, [])

  const playRecording = useCallback(async () => {
    if (recordedNotes.length === 0 || !synthRef.current) return

    setIsPlaying(true)
    await Tone.start()

    recordedNotes.forEach(({ note, time }) => {
      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.triggerAttackRelease(note, "2n")
        }
      }, time)
    })

    const maxTime = Math.max(...recordedNotes.map((n) => n.time))
    setTimeout(() => {
      setIsPlaying(false)
    }, maxTime + 1000)
  }, [recordedNotes])

  const clearRecording = useCallback(() => {
    setRecordedNotes([])
  }, [])

  const whiteKeys = [
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
  ]
  const blackKeys = [
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
  ]

  return (
    <div className="piano-container">
      <h1>風鈴メロディメーカー</h1>

      <div className="controls">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-btn ${isRecording ? "recording" : ""}`}
        >
          {isRecording ? "🔴 録音停止" : "⚪ 録音開始"}
        </button>

        <button
          onClick={playRecording}
          disabled={recordedNotes.length === 0 || isPlaying}
          className="play-btn"
        >
          {isPlaying ? "▶️ 再生中..." : "▶️ 再生"}
        </button>

        <button
          onClick={clearRecording}
          disabled={recordedNotes.length === 0}
          className="clear-btn"
        >
          🗑️ クリア
        </button>
      </div>

      <div className="piano">
        <div className="white-keys">
          {whiteKeys.map((note) => (
            <button
              key={note}
              className="white-key"
              onMouseDown={() => playNote(note)}
              onTouchStart={() => playNote(note)}
            >
              {note}
            </button>
          ))}
        </div>

        <div className="black-keys">
          {blackKeys.map(({ note, position }) => (
            <button
              key={note}
              className="black-key"
              style={{
                left: `${(position - 0.5) * (100 / whiteKeys.length)}%`,
              }}
              onMouseDown={() => playNote(note)}
              onTouchStart={() => playNote(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {recordedNotes.length > 0 && (
        <div className="recorded-notes">
          <h3>録音されたメロディ ({recordedNotes.length} 音符)</h3>
          <div className="notes-display">
            {recordedNotes.map((note, index) => (
              <span key={index} className="note-badge">
                {note.note}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .piano-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        h1 {
          color: white;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .controls {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .controls button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .record-btn {
          background: #ff4757;
          color: white;
        }

        .record-btn.recording {
          background: #ff3838;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .play-btn {
          background: #2ed573;
          color: white;
        }

        .play-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .clear-btn {
          background: #ffa502;
          color: white;
        }

        .clear-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .controls button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .piano {
          position: relative;
          background: #333;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        .white-keys {
          display: flex;
          gap: 2px;
        }

        .white-key {
          width: 60px;
          height: 200px;
          background: white;
          border: 2px solid #ccc;
          border-radius: 0 0 8px 8px;
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 20px;
          font-size: 12px;
          font-weight: bold;
          color: #666;
        }

        .white-key:hover {
          background: #f0f0f0;
        }

        .white-key:active {
          background: #e0e0e0;
          transform: translateY(2px);
        }

        .black-keys {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 120px;
        }

        .black-key {
          position: absolute;
          width: 35px;
          height: 120px;
          background: #333;
          border: none;
          border-radius: 0 0 4px 4px;
          cursor: pointer;
          transition: all 0.1s ease;
          color: white;
          font-size: 10px;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 10px;
          z-index: 1;
        }

        .black-key:hover {
          background: #555;
        }

        .black-key:active {
          background: #222;
          transform: translateY(2px);
        }

        .recorded-notes {
          margin-top: 30px;
          background: rgba(255,255,255,0.9);
          padding: 20px;
          border-radius: 10px;
          min-width: 300px;
        }

        .recorded-notes h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .notes-display {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .note-badge {
          background: #667eea;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

export default Piano
