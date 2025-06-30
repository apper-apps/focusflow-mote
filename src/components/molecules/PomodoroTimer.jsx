import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PomodoroTimer = ({ 
  onComplete, 
  onTick,
  isFloating = false,
  isMinimalMode = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerType, setTimerType] = useState('work'); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const resetTimer = useCallback(() => {
    setTimeLeft(timerDurations[timerType]);
    setIsActive(false);
    setIsPaused(false);
  }, [timerType, timerDurations]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    resetTimer();
  };

  const switchTimerType = (type) => {
    setTimerType(type);
    setTimeLeft(timerDurations[type]);
    setIsActive(false);
    setIsPaused(false);
  };

  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          if (onTick) onTick(newTime);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerType === 'work') {
        setSessionsCompleted(prev => prev + 1);
        if (onComplete) onComplete();
        
        // Auto-switch to break
        const nextType = sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
        setTimeout(() => switchTimerType(nextType), 1000);
      } else {
        // Auto-switch back to work
        setTimeout(() => switchTimerType('work'), 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, timerType, sessionsCompleted, onComplete, onTick]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timerDurations[timerType] - timeLeft) / timerDurations[timerType]) * 100;

  const timerColors = {
    work: 'from-primary-500 to-primary-600',
    shortBreak: 'from-secondary-500 to-secondary-600',
    longBreak: 'from-accent-500 to-accent-600'
  };

  if (isFloating) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="floating-timer p-3 rounded-xl"
      >
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                className={`text-primary-500 timer-circle`}
              />
            </svg>
          </div>
          
          <span className="text-sm font-mono font-medium text-gray-900">
            {formatTime(timeLeft)}
          </span>
          
          <button
            onClick={isActive && !isPaused ? pauseTimer : startTimer}
            className="p-1 text-primary-500 hover:bg-primary-50 rounded"
          >
            <ApperIcon 
              name={isActive && !isPaused ? "Pause" : "Play"} 
              className="w-4 h-4" 
            />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={`
        bg-white rounded-lg shadow-soft
        ${isMinimalMode ? 'p-4' : 'p-6'}
      `}
    >
      {/* Timer Type Selector */}
      {!isMinimalMode && (
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            {Object.keys(timerDurations).map((type) => (
              <button
                key={type}
                onClick={() => switchTimerType(type)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${timerType === type 
                    ? `bg-gradient-to-r ${timerColors[type]} text-white shadow-soft` 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {type === 'work' ? 'Focus' : type === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              className="timer-circle"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - progress / 100) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B4CDB" />
                <stop offset="100%" stopColor="#4D3FBA" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold text-gray-900">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {timerType === 'work' ? 'Focus Time' : 'Break Time'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        <Button
          onClick={isActive && !isPaused ? pauseTimer : startTimer}
          variant="primary"
          size="lg"
          icon={isActive && !isPaused ? "Pause" : "Play"}
        >
          {isActive && !isPaused ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          onClick={stopTimer}
          variant="outline"
          size="lg"
          icon="Square"
        >
          Stop
        </Button>
      </div>

      {/* Session Counter */}
      {!isMinimalMode && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Target" className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-600">
              Sessions completed today: 
              <span className="font-semibold text-primary-600 ml-1">
                {sessionsCompleted}
              </span>
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PomodoroTimer;