import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'

const GAME_LENGTH_MS = 30000

function randomPosition() {
  return {
    x: 10 + Math.random() * 76,
    y: 18 + Math.random() * 62,
  }
}

export function GameScreen() {
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [position, setPosition] = useState(randomPosition())
  const [leftMs, setLeftMs] = useState(GAME_LENGTH_MS)

  useEffect(() => {
    if (!running) {
      return
    }

    const startedAt = Date.now()
    const timerId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextLeft = Math.max(0, GAME_LENGTH_MS - elapsed)
      setLeftMs(nextLeft)
      if (nextLeft === 0) {
        setRunning(false)
        window.clearInterval(timerId)
      }
    }, 150)

    return () => window.clearInterval(timerId)
  }, [running])

  const leftSec = Math.ceil(leftMs / 1000)

  const level = useMemo(() => {
    if (score >= 100) {
      return 'Liquid Master'
    }
    if (score >= 60) {
      return 'Flow Surfer'
    }
    if (score >= 25) {
      return 'Pulse Starter'
    }
    return 'Warm-up'
  }, [score])

  const start = () => {
    setRunning(true)
    setScore(0)
    setCombo(0)
    setLeftMs(GAME_LENGTH_MS)
    setPosition(randomPosition())
  }

  const hitPulse = () => {
    if (!running) {
      return
    }

    const nextCombo = combo + 1
    setCombo(nextCombo)
    setScore((current) => current + Math.min(1 + nextCombo, 8))
    setPosition(randomPosition())
  }

  return (
    <>
      <GlassCard className="space-y-3 px-4 py-4">
        <h2 className="text-lg font-semibold">Pulse Catch</h2>
        <p className="text-xs text-slate-200/80">
          Catch the liquid pulse for 30 seconds. Longer combo gives more score.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="surface-panel py-2">
            <p className="text-slate-300/80">Time</p>
            <p className="text-base font-semibold">{leftSec}s</p>
          </div>
          <div className="surface-panel py-2">
            <p className="text-slate-300/80">Score</p>
            <p className="text-base font-semibold">{score}</p>
          </div>
          <div className="surface-panel py-2">
            <p className="text-slate-300/80">Combo</p>
            <p className="text-base font-semibold">x{Math.max(combo, 1)}</p>
          </div>
        </div>

        <button type="button" className="glass-button" onClick={start}>
          {running ? 'Restart round' : 'Start game'}
        </button>
      </GlassCard>

      <GlassCard className="relative h-74 overflow-hidden px-2 py-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.28),transparent_50%)]" />
        <p className="relative z-10 px-2 text-xs text-slate-100/85">Level: {level}</p>

        {running && (
          <button
            type="button"
            aria-label="Catch pulse"
            className="game-pulse absolute z-20"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={hitPulse}
          />
        )}

        {!running && (
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-sm text-slate-100/85">Press start to launch your round.</p>
          </div>
        )}
      </GlassCard>
    </>
  )
}
