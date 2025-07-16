import { useState, useEffect } from 'react'

const INTRO_SEEN_KEY = 'hasSeenIntro'

export const useIntro = () => {
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    setHasSeenIntro(false)
  }, [])

  const markIntroAsSeen = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true')
    setHasSeenIntro(true)
  }

  return { hasSeenIntro, markIntroAsSeen }
}