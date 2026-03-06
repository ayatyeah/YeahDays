import { useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import logo from '../assets/yeahdays-logo.svg'
import { useAppStore } from '../store/useAppStore'

type AuthMode = 'login' | 'register'

export function AuthScreen() {
  const { login, register, authLoading, syncError } = useAppStore()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setMessage('Enter email and password')
      return
    }

    const result =
      mode === 'login'
        ? await login(email.trim(), password.trim())
        : await register(email.trim(), password.trim())

    setMessage(
      result.success
        ? mode === 'login'
          ? 'Welcome back'
          : 'Account created. Welcome'
        : result.error ?? 'Auth failed',
    )

    if (result.success) {
      setPassword('')
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center px-4 py-6">
      <GlassCard className="w-full space-y-4 px-5 py-5">
        <div className="space-y-2 text-center">
          <img src={logo} alt="YeahDays" className="mx-auto h-10 w-auto" />
          <h1 className="text-xl font-semibold">YeahDays Account</h1>
          <p className="text-xs text-slate-200/80">Your tasks stay tied to your account and sync across devices.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`glass-button !min-h-10 text-xs ${mode === 'login' ? '' : 'glass-button-secondary'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`glass-button !min-h-10 text-xs ${mode === 'register' ? '' : 'glass-button-secondary'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <div className="space-y-2">
          <input
            className="glass-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="glass-input"
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="button" className="glass-button" disabled={authLoading} onClick={() => void handleSubmit()}>
          {authLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        {syncError && <p className="text-xs text-red-200">{syncError}</p>}
        {message && <p className="text-xs text-slate-200/85">{message}</p>}
      </GlassCard>
    </div>
  )
}
