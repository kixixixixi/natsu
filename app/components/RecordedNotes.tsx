import React from "react"
import { Note } from "../hooks/useRecording"

interface RecordedNotesProps {
  notes: Note[]
}

export const RecordedNotes: React.FC<RecordedNotesProps> = ({ notes }) => {
  if (notes.length === 0) return null

  return (
    <div className="recorded-notes">
      <h3>録音されたメロディ ({notes.length} 音符)</h3>
      <div className="notes-display">
        {notes.map((note, index) => (
          <span key={index} className="note-badge">
            {note.note}
          </span>
        ))}
      </div>

      <style>{`
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
