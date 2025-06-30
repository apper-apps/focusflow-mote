import React from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const motivationalMessages = [
  "Amazing work! You're building great habits! 🎉",
  "Look at you go! Another task conquered! ⭐",
  "You're on fire! Keep this momentum going! 🔥",
  "Fantastic! Your future self will thank you! 💫",
  "Way to go! You're making real progress! 🚀",
  "Excellent! Every small step counts! 🌟",
  "Brilliant! You're developing your focus superpower! ⚡",
  "Outstanding! Your consistency is paying off! 💪",
  "Incredible! You're turning goals into achievements! 🏆",
  "Perfect! You're showing what focus looks like! 🎯"
];

const streakMessages = [
  "3-day streak! You're building momentum! 🔥",
  "7-day streak! You're on a roll! 🌟",
  "2-week streak! Consistency champion! 🏆",
  "1-month streak! Habit master! 👑"
];

const levelUpMessages = [
  "Level up! Your focus skills are growing! 📈",
  "New level unlocked! You're getting stronger! 💪",
  "Achievement unlocked! Focus master in training! 🎓"
];

const MotivationalToast = {
  taskCompleted: (points = 5) => {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Check" className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{message}</p>
          <p className="text-sm text-green-100">+{points} points earned!</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  },

  pomodoroCompleted: () => {
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Timer" className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">Pomodoro complete! 🍅</p>
          <p className="text-sm text-primary-100">Great focus session!</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  },

  streakAchievement: (days) => {
    const message = days >= 30 ? streakMessages[3] :
                   days >= 14 ? streakMessages[2] :
                   days >= 7 ? streakMessages[1] :
                   streakMessages[0];
    
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Flame" className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div>
          <p className="font-medium text-white">{message}</p>
          <p className="text-sm text-orange-100">{days} days in a row!</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  },

  levelUp: (newLevel) => {
    const message = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Star" className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{message}</p>
          <p className="text-sm text-yellow-100">Welcome to Level {newLevel}!</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  },

  encouragement: () => {
    const encouragements = [
      "You've got this! Every step forward counts! 💪",
      "Take a deep breath and tackle one thing at a time! 🌸",
      "Progress, not perfection! You're doing great! ⭐",
      "Your ADHD brain is creative and capable! 🧠✨",
      "Small wins lead to big victories! Keep going! 🏆"
    ];
    
    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    toast.info(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Heart" className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{message}</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }
};

export default MotivationalToast;