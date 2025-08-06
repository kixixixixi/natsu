import React, { useRef, useEffect, useCallback, useState } from "react"
import { yToNote, getGridNotes } from "../utils/frequencyUtils"

interface MelodyCanvasProps {
  onPlayNote: (note: string) => void
  isRecording: boolean
  onClearCanvas?: () => void
  onStartDrawing?: () => void
  onEndDrawing?: () => void
}

export const MelodyCanvas: React.FC<MelodyCanvasProps> = ({ onPlayNote, isRecording: _isRecording, onClearCanvas, onStartDrawing: _onStartDrawing, onEndDrawing: _onEndDrawing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentNote, setCurrentNote] = useState<string | null>(null)

  const getCanvasPosition = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }, [])


  const drawGrid = useCallback((highlightNote?: string | null) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Save current state
    ctx.save()
    
    // Reset composite operation to draw on top
    ctx.globalCompositeOperation = 'source-over'
    
    // Get grid notes
    const gridNotes = getGridNotes(canvas.height, 12)
    
    // Draw background highlights and grid lines
    gridNotes.forEach(({ note, y }, index) => {
      // Check if this is the highlighted note
      const isHighlighted = highlightNote === note
      
      // Calculate background band area
      const nextY = index < gridNotes.length - 1 ? gridNotes[index + 1].y : canvas.height
      const bandHeight = nextY - y
      
      // Draw background highlight band
      if (isHighlighted) {
        ctx.fillStyle = 'rgba(255, 200, 200, 0.3)' // Light red background
        ctx.fillRect(50, y, canvas.width - 50, bandHeight)
      }
      
      // Draw grid line
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)'
      ctx.lineWidth = 1
      ctx.globalAlpha = 1
      
      ctx.beginPath()
      ctx.moveTo(50, y) // Start from x=50 to leave space for labels
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
      
      // Draw note label
      if (isHighlighted) {
        ctx.fillStyle = 'rgba(255, 50, 50, 1)' // Bright red for highlighted
        ctx.font = 'bold 14px Arial'
      } else {
        ctx.fillStyle = 'rgba(80, 80, 80, 0.9)'
        ctx.font = 'bold 12px Arial'
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(note, 25, y)
    })
    
    // Draw vertical grid lines (time indicators)
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)'
    ctx.lineWidth = 1
    const timeGridSpacing = canvas.width / 16
    for (let x = 50; x < canvas.width; x += timeGridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    // Restore state
    ctx.restore()
  }, [])

  const redrawCanvas = useCallback((highlightNote?: string | null) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid with highlight
    drawGrid(highlightNote)
  }, [drawGrid])

  const clearCanvas = useCallback(() => {
    setCurrentNote(null)
    redrawCanvas(null)
    onClearCanvas?.()
  }, [redrawCanvas, onClearCanvas])

  const updateHighlight = useCallback((y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const note = yToNote(y, canvas.height)
    if (note !== currentNote) {
      setCurrentNote(note)
      redrawCanvas(note)
    }
  }, [currentNote, redrawCanvas])

  const handleClick = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault()
    const position = getCanvasPosition(event)
    if (!position) return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const note = yToNote(position.y, canvas.height)
    updateHighlight(position.y)
    onPlayNote(note)
    
    // Brief visual feedback
    setTimeout(() => {
      redrawCanvas(null)
    }, 200)
  }, [getCanvasPosition, onPlayNote, updateHighlight, redrawCanvas])

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault()
    const position = getCanvasPosition(event)
    if (!position) return

    const canvas = canvasRef.current
    if (!canvas) return
    
    // Always update highlight for hover effect
    const note = yToNote(position.y, canvas.height)
    setCurrentNote(note)
    redrawCanvas(note)
  }, [getCanvasPosition, redrawCanvas])

  const handleLeave = useCallback(() => {
    // Clear highlight when mouse leaves canvas
    setCurrentNote(null)
    redrawCanvas(null)
  }, [redrawCanvas])

  // Initialize canvas once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set up canvas dimensions
    canvas.width = 1200
    canvas.height = 600
    
    // Initialize canvas with grid
    redrawCanvas(null)

    // Mouse events
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseleave', handleLeave)

    // Touch events
    canvas.addEventListener('touchstart', handleClick, { passive: false })
    canvas.addEventListener('touchmove', handleMove, { passive: false })
    canvas.addEventListener('touchcancel', handleLeave)

    return () => {
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseleave', handleLeave)
      canvas.removeEventListener('touchstart', handleClick)
      canvas.removeEventListener('touchmove', handleMove)
      canvas.removeEventListener('touchcancel', handleLeave)
    }
  }, [handleClick, handleMove, handleLeave, redrawCanvas])

  // Remove automatic clearing - trails should persist

  return (
    <div className="melody-canvas-container">
      <div className="canvas-info">
        <p>グリッド上をクリックして風鈴の音を奏でてください</p>
        <p>マウスを動かすと音階がハイライトされます</p>
      </div>
      
      
      <canvas
        ref={canvasRef}
        className="melody-canvas"
      />

      <style>{`
        .melody-canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .canvas-info {
          text-align: center;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .canvas-info p {
          margin: 5px 0;
          font-size: 14px;
        }

        .melody-canvas {
          background: rgba(255, 255, 255, 0.9);
          border: 3px solid #667eea;
          border-radius: 15px;
          cursor: crosshair;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          touch-action: none;
        }

        .melody-canvas:hover {
          border-color: #5a6fd8;
        }

        .melody-canvas:active {
          border-color: #4c63d2;
        }

      `}</style>
    </div>
  )
}