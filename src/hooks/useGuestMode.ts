import { useState, useEffect } from 'react'

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState(false)
  
  useEffect(() => {
    const guestSession = localStorage.getItem('guest_session')
    setIsGuest(guestSession === 'true')
  }, [])
  
  const enableGuestMode = () => {
    localStorage.setItem('guest_session', 'true')
    setIsGuest(true)
  }
  
  const disableGuestMode = () => {
    localStorage.removeItem('guest_session')
    setIsGuest(false)
  }
  
  return {
    isGuest,
    enableGuestMode,
    disableGuestMode
  }
}
