import { useEffect, useRef, useState, useCallback } from 'react'
import { logout } from '../services/auth'

export const useSessionTimeout = (isAdminUser = false, seconds = 60) => {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const timerRef = useRef(null)

  const reset = useCallback(() => setTimeLeft(seconds), [seconds])

  useEffect(() => {
    if (isAdminUser) return

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset))

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          logout()
          window.location.href = '/login'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      clearInterval(timerRef.current)
    }
  }, [isAdminUser, reset])

  return timeLeft
}
