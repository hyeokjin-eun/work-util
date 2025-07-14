import { useState, useEffect } from 'react';

const INTRO_STORAGE_KEY = 'work-util-intro-completed';

export const useIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen the intro before
    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const completeIntro = () => {
    localStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setShowIntro(false);
  };

  const resetIntro = () => {
    localStorage.removeItem(INTRO_STORAGE_KEY);
    setShowIntro(true);
  };

  const forceShowIntro = () => {
    setShowIntro(true);
  };

  return {
    showIntro,
    isLoading,
    completeIntro,
    resetIntro,
    forceShowIntro
  };
};