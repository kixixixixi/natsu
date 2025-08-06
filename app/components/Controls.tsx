import React from "react"

interface ControlsProps {
  isRecording: boolean
  isPlaying: boolean
  recordedNotesLength: number
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onClearRecording: () => void
}

export const Controls: React.FC<ControlsProps> = ({
  isRecording,
  isPlaying,
  recordedNotesLength,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onClearRecording,
}) => {
  return (
    <div className="controls">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`record-btn ${isRecording ? "recording" : ""}`}
      >
        {isRecording ? "🔴 録音停止" : "⚪ 録音開始"}
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
      `}</style>
    </div>
  )
}
