import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const GamificationPanel = ({ userStats, isMinimalMode = false }) => {
  const { streak, level, totalPoints, todayPoints = 0 } = userStats;
  
  const pointsToNextLevel = (level * 100) - (totalPoints % (level * 100));
  const levelProgress = ((totalPoints % (level * 100)) / (level * 100)) * 100;
  
  const streakIcon = streak >= 7 ? 'Flame' : streak >= 3 ? 'Zap' : 'Target';
  const streakColor = streak >= 7 ? 'text-orange-500' : streak >= 3 ? 'text-yellow-500' : 'text-primary-500';

  if (isMinimalMode) {
    return (
      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-soft border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center ${streak > 0 ? 'streak-flame' : ''}`}>
            <ApperIcon name={streakIcon} className={`w-4 h-4 text-white ${streak > 0 ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{streak} day streak</p>
            <p className="text-xs text-gray-500">Level {level}</p>
          </div>
        </div>
        
        <Badge variant="primary" size="sm">
          {todayPoints} pts today
        </Badge>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-900">Your Progress</h3>
        <Badge variant="primary" size="md">
          Level {level}
        </Badge>
      </div>

      {/* Streak */}
      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center ${streak > 0 ? 'streak-flame' : ''}`}>
          <ApperIcon name={streakIcon} className={`w-5 h-5 text-white ${streak > 0 ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {streak} Day Streak
          </p>
          <p className="text-sm text-gray-600">
            {streak === 0 ? 'Complete a task to start your streak!' : 
             streak === 1 ? 'Great start! Keep it going tomorrow!' :
             streak < 7 ? 'Building momentum! Keep going!' :
             'You\'re on fire! Amazing consistency!'}
          </p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress to Level {level + 1}</span>
          <span className="font-medium text-primary-600">{pointsToNextLevel} pts to go</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          />
        </div>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"
          >
            {todayPoints}
          </motion.p>
          <p className="text-xs text-primary-600 font-medium">Today's Points</p>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold font-display bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent"
          >
            {totalPoints}
          </motion.p>
          <p className="text-xs text-secondary-600 font-medium">Total Points</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Recent Achievements</p>
        <div className="flex flex-wrap gap-2">
          {streak >= 3 && (
            <Badge variant="warning" size="xs">
              <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
              3-Day Streak
            </Badge>
          )}
          {streak >= 7 && (
            <Badge variant="error" size="xs">
              <ApperIcon name="Flame" className="w-3 h-3 mr-1" />
              Week Warrior
            </Badge>
          )}
          {totalPoints >= 100 && (
            <Badge variant="primary" size="xs">
              <ApperIcon name="Star" className="w-3 h-3 mr-1" />
              Century Club
            </Badge>
          )}
          {level >= 5 && (
            <Badge variant="success" size="xs">
              <ApperIcon name="Trophy" className="w-3 h-3 mr-1" />
              Focus Master
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GamificationPanel;