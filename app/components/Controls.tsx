import React from "react"

interface ControlsProps {
  isRecording: boolean
  isPlaying: boolean
  recordedNotesLength: number
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onClearRecording: () => void
  noteDuration: string
  onDurationChange: (duration: string) => void
}

const DURATION_OPTIONS = [
  { value: "8n", label: "短い" },
  { value: "4n", label: "普通" },
  { value: "2n", label: "長い" },
  { value: "1n", label: "とても長い" },
] as const

export const Controls: React.FC<ControlsProps> = ({
  isRecording,
  isPlaying,
  recordedNotesLength,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onClearRecording,
  noteDuration,
  onDurationChange,
}) => {
  return (
    <div className="controls">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`record-btn ${isRecording ? "recording" : ""}`}
      >
        {isRecording ? "🔴 録音中（自動）" : "⚪ 手動録音"}
      </button>

      <button
        onClick={onPlayRecording}
        disabled={recordedNotesLength === 0 || isPlaying}
        className="play-btn"
      >
        {isPlaying ? "▶️ 再生中..." : "▶️ 再生"}
      </button>

      <button
        onClick={onClearRecording}
        disabled={recordedNotesLength === 0}
        className="clear-btn"
      >
        🗑️ クリア
      </button>

      <div className="duration-control">
        <label htmlFor="duration-select">音の持続:</label>
        <select
          id="duration-select"
          value={noteDuration}
          onChange={(e) => onDurationChange(e.target.value)}
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <style>{`
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

        .duration-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .duration-control label {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .duration-control select {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }

        .duration-control select:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
