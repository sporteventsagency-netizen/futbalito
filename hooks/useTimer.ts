

import { useState, useRef, useCallback } from 'react';

const useTimer = (initialState = 0) => {
  const [time, setTime] = useState(initialState);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  // FIX: Changed NodeJS.Timeout to number for browser compatibility.
  // The return type of `setInterval` in the browser is a number.
  const countRef = useRef<number | null>(null);

  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    countRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, []);

  const handlePause = useCallback(() => {
    if (countRef.current) {
      clearInterval(countRef.current);
    }
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    countRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, []);

  const handleReset = useCallback(() => {
    if (countRef.current) {
      clearInterval(countRef.current);
    }
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
  }, []);

  return { time, isActive, isPaused, handleStart, handlePause, handleResume, handleReset };
};

export default useTimer;
