import React from "react"
import { KEYBOARD_NOTES } from "../constants/audio"

interface KeyboardProps {
  onPlayNote: (note: string) => void
}

export const Keyboard: React.FC<KeyboardProps> = ({ onPlayNote }) => {
  const { WHITE_KEYS, BLACK_KEYS } = KEYBOARD_NOTES

  return (
    <div className="piano">
      <div className="white-keys">
        {WHITE_KEYS.map((note) => (
          <button
            key={note}
            className="white-key"
            onMouseDown={() => onPlayNote(note)}
            onTouchStart={() => onPlayNote(note)}
          >
            {note}
          </button>
        ))}
      </div>

      <div className="black-keys">
        {BLACK_KEYS.map(({ note, position }) => (
          <button
            key={note}
            className="black-key"
            style={{
              left: `${(position - 0.5) * (100 / WHITE_KEYS.length)}%`,
            }}
            onMouseDown={() => onPlayNote(note)}
            onTouchStart={() => onPlayNote(note)}
          >
            {note}
          </button>
        ))}
      </div>

      <style>{`
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
      `}</style>
    </div>
  )
}
