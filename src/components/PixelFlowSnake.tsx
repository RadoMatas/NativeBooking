/**
 * PixelFlowSnake
 * ---------------
 * Canvas-based neon pixel snake animation showing the booking flow:
 *   Customer → Your Website → NativeBooking → Confirmed
 *
 * Technique:
 *  - Pixel-art icons drawn as GRID×GRID blocks of coloured squares
 *  - A "snake" of decreasing-opacity pixel squares travels the connecting path
 *  - Neon glow via canvas ctx.shadowBlur / ctx.shadowColor
 *  - Dim dotted track rendered beneath the snake
 *  - Labels drawn below each node
 *  - ResizeObserver keeps canvas sized to its container
 */

import { useEffect, useRef } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID       = 9      // icon grid = GRID × GRID pixels
const CANVAS_H   = 120    // logical canvas height (px)
const SNAKE_LEN  = 24     // number of pixel segments in the tail
const SPEED      = 1.8    // px per animation frame the snake head moves
const ACCENT_R   = 16
const ACCENT_G   = 185
const ACCENT_B   = 129

// Node positions as fraction of canvas width — 3 nodes, evenly spaced
const NODE_PCT  = [0.13, 0.50, 0.87]
const PATH_Y_F  = 0.40    // snake path y as fraction of CANVAS_H

const LABELS    = ['Customer', 'Your Booking System', 'Confirmed']
const SUBLABELS = ['',         'built on NativeBooking', '']

// ─── Pixel art patterns (9×9, 1 = lit pixel) ─────────────────────────────────

const PERSON: number[][] = [
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,0,1,1,0],
  [0,1,1,0,0,0,1,1,0],
  [0,0,0,0,0,0,0,0,0],
]

const GLOBE: number[][] = [
  [0,0,1,1,1,1,1,0,0],
  [0,1,0,1,1,1,0,1,0],
  [1,0,1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1],
  [1,0,0,1,1,1,0,0,1],
  [1,0,1,1,1,1,1,0,1],
  [0,1,0,1,1,1,0,1,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0],
]

const CHECK: number[][] = [
  [0,0,0,0,0,0,1,1,0],
  [0,0,0,0,0,1,1,0,0],
  [0,0,0,0,1,1,0,0,0],
  [1,1,0,1,1,0,0,0,0],
  [1,1,1,1,0,0,0,0,0],
  [0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
]

const ICONS = [PERSON, GLOBE, CHECK]

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

function drawPixelIcon(
  ctx: CanvasRenderingContext2D,
  pattern: number[][],
  cx: number,    // center x
  cy: number,    // center y
  px: number,    // size of one "pixel" square in canvas px
  alpha = 1.0,
) {
  const totalW = GRID * px
  const startX = cx - totalW / 2
  const startY = cy - totalW / 2

  ctx.save()
  ctx.shadowBlur  = 8
  ctx.shadowColor = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.9)

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      if (pattern[row]?.[col] === 1) {
        ctx.fillStyle = rgba(ACCENT_R, ACCENT_G, ACCENT_B, alpha)
        ctx.fillRect(
          Math.round(startX + col * px),
          Math.round(startY + row * px),
          Math.max(1, px - 0.8),
          Math.max(1, px - 0.8),
        )
      }
    }
  }
  ctx.restore()
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PixelFlowSnake() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function setup() {
      const W = Math.min(container!.clientWidth, 680)

      canvas!.width  = W * DPR
      canvas!.height = CANVAS_H * DPR
      canvas!.style.width  = W  + 'px'
      canvas!.style.height = CANVAS_H + 'px'

      const ctx = canvas!.getContext('2d')!
      ctx.scale(DPR, DPR)

      return { ctx, W }
    }

    let { ctx, W } = setup()

    // Node centers in logical px
    let nodeXs = NODE_PCT.map(p => p * W)
    let pathY  = PATH_Y_F * CANVAS_H

    // Pixel size for icons — scales with canvas
    let px = Math.max(2, Math.round(W / 210))

    // Path runs from first to last node center
    let pathStart = nodeXs[0]
    let pathEnd   = nodeXs[nodeXs.length - 1]
    let pathLen   = pathEnd - pathStart

    // Snake state
    let head  = 0
    const trail: { x: number; y: number }[] = []

    // ── Main draw loop ────────────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, W, CANVAS_H)

      // 1. Dim dotted track beneath the snake
      const dotGap = px * 2.2
      for (let x = pathStart; x <= pathEnd; x += dotGap) {
        ctx.fillStyle = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.1)
        ctx.fillRect(Math.round(x), Math.round(pathY), Math.max(1, px - 1), Math.max(1, px - 1))
      }

      // 2. Connector arrows between nodes (small arrowheads)
      ctx.save()
      ctx.strokeStyle = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.18)
      ctx.lineWidth   = 1
      for (let i = 0; i < nodeXs.length - 1; i++) {
        const x1 = nodeXs[i]  + (GRID * px) / 2 + 4
        const x2 = nodeXs[i + 1] - (GRID * px) / 2 - 4
        const y   = pathY + px / 2
        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()
        // Arrowhead
        const ah = 4
        ctx.beginPath()
        ctx.moveTo(x2 - ah, y - ah / 1.5)
        ctx.lineTo(x2,      y)
        ctx.lineTo(x2 - ah, y + ah / 1.5)
        ctx.stroke()
      }
      ctx.restore()

      // 3. Node bounding boxes (very subtle)
      nodeXs.forEach(nx => {
        const hw = (GRID * px) / 2 + 4
        ctx.save()
        ctx.strokeStyle = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.2)
        ctx.lineWidth   = 1
        ctx.shadowBlur  = 12
        ctx.shadowColor = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.15)
        ctx.strokeRect(
          Math.round(nx - hw), Math.round(pathY - hw),
          Math.round(hw * 2),  Math.round(hw * 2),
        )
        ctx.restore()
      })

      // 4. Snake tail — head is index 0, brightest
      trail.forEach((pos, i) => {
        const t = 1 - i / trail.length   // 1 at head → 0 at tip of tail
        const alpha = Math.pow(t, 1.6) * 0.95
        const glow  = t * 18

        ctx.save()
        ctx.shadowBlur  = glow
        ctx.shadowColor = rgba(ACCENT_R, ACCENT_G, ACCENT_B, t)
        ctx.fillStyle   = rgba(ACCENT_R, ACCENT_G, ACCENT_B, alpha)
        const ps = Math.max(1, px - 0.5)
        ctx.fillRect(
          Math.round(pos.x - ps / 2),
          Math.round(pos.y - ps / 2),
          ps, ps,
        )
        ctx.restore()
      })

      // 5. Pixel art icons (drawn last so they sit on top of the snake)
      nodeXs.forEach((nx, i) => {
        drawPixelIcon(ctx, ICONS[i], nx, pathY, px, 0.85)
      })

      // 6. Labels + sublabels
      const fontSize    = Math.max(9, Math.round(px * 2.8))
      const subFontSize = Math.max(7, Math.round(px * 2.0))
      ctx.save()
      ctx.textAlign = 'center'
      nodeXs.forEach((nx, i) => {
        const labelY = pathY + (GRID * px) / 2 + fontSize + 5
        // Main label
        ctx.font        = `600 ${fontSize}px 'Plus Jakarta Sans', monospace`
        ctx.shadowBlur  = 6
        ctx.shadowColor = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.4)
        ctx.fillStyle   = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.55)
        ctx.fillText(LABELS[i], nx, labelY)
        // Sublabel (only for nodes that have one)
        if (SUBLABELS[i]) {
          ctx.font       = `400 ${subFontSize}px 'Plus Jakarta Sans', monospace`
          ctx.shadowBlur = 0
          ctx.fillStyle  = rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.28)
          ctx.fillText(SUBLABELS[i], nx, labelY + subFontSize + 2)
        }
      })
      ctx.restore()

      // 7. Advance snake head
      //    Brief "pause" effect after reaching the last node: we extend
      //    pathLen by 30px before wrapping so the head lingers at the
      //    checkmark node for a moment.
      const totalTravel = pathLen + 30
      head = (head + SPEED) % totalTravel
      const snakeX = pathStart + Math.min(head, pathLen)
      trail.unshift({ x: snakeX, y: pathY + px / 2 })
      if (trail.length > SNAKE_LEN) trail.pop()

      rafRef.current = requestAnimationFrame(draw)
    }

    // ── ResizeObserver ────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current)
      const newState = setup()
      ctx   = newState.ctx
      W     = newState.W
      px    = Math.max(2, Math.round(W / 210))
      nodeXs    = NODE_PCT.map(p => p * W)
      pathY     = PATH_Y_F * CANVAS_H
      pathStart = nodeXs[0]
      pathEnd   = nodeXs[nodeXs.length - 1]
      pathLen   = pathEnd - pathStart
      trail.length = 0
      head = 0
      draw()
    })
    ro.observe(container)

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '12px 24px 44px',
      }}
    >
      {/* Section label */}
      <p style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(16,185,129,0.4)',
        marginBottom: '16px',
        fontFamily: "'Plus Jakarta Sans', monospace",
      }}>
        How it works
      </p>

      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
        }}
        aria-label="Animated flow diagram: Customer connects to NativeBooking and books an appointment"
        role="img"
      />
    </div>
  )
}
