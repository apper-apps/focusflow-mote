import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import PomodoroTimer from '@/components/molecules/PomodoroTimer';
import GamificationPanel from '@/components/molecules/GamificationPanel';
import StatsCard from '@/components/molecules/StatsCard';
import ApperIcon from '@/components/ApperIcon';
import MotivationalToast from '@/components/molecules/MotivationalToast';
import userService from '@/services/api/userService';

const TasksPage = () => {
const outletContext = useOutletContext();
  const isMinimalMode = outletContext?.isMinimalMode || false;
const [userStats, setUserStats] = useState({
    streak: 0,
    level: 1,
    total_points: 0,
    today_points: 0
  });
  const [showFloatingTimer, setShowFloatingTimer] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    loadUserStats();
  }, []);

const loadUserStats = async () => {
    try {
      const stats = await userService.getStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

  const handleTaskComplete = async (task) => {
// Update user stats
    const newTodayPoints = userStats.today_points + task.points;
    const newTotalPoints = userStats.total_points + task.points;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    
    // Check for level up
    if (newLevel > userStats.level) {
      MotivationalToast.levelUp(newLevel);
    }
    
    // Update streak (simplified - in real app would check daily completion)
    const newStreak = userStats.streak + 1;
    if (newStreak % 3 === 0) {
      MotivationalToast.streakAchievement(newStreak);
    }

    setUserStats(prev => ({
      ...prev,
      today_points: newTodayPoints,
      total_points: newTotalPoints,
      level: newLevel,
      streak: newStreak
    }));

    // Save updated stats
    try {
      await userService.updateStats({
        today_points: newTodayPoints,
        total_points: newTotalPoints,
        level: newLevel,
        streak: newStreak
      });
    } catch (err) {
      console.error('Failed to update user stats:', err);
    }
  };

  const handlePomodoroComplete = () => {
    MotivationalToast.pomodoroCompleted();
    
// Award bonus points for completed pomodoro
    const bonusPoints = 15;
    const newTodayPoints = userStats.today_points + bonusPoints;
    const newTotalPoints = userStats.total_points + bonusPoints;
    
    setUserStats(prev => ({
      ...prev,
      today_points: newTodayPoints,
      total_points: newTotalPoints
    }));
  };

  const priorityOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'high', label: 'High Priority', icon: 'AlertTriangle' },
    { value: 'medium', label: 'Medium Priority', icon: 'Clock' },
    { value: 'low', label: 'Low Priority', icon: 'CheckCircle2' },
  ];

  if (isMinimalMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Floating Timer */}
        {showFloatingTimer && (
          <PomodoroTimer 
            isFloating={true}
            onComplete={handlePomodoroComplete}
          />
        )}

        {/* Minimal Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            What's your focus today?
          </h1>
          <p className="text-gray-600">
            Choose your most important task and let's make it happen.
          </p>
        </div>

        {/* Gamification Panel - Compact */}
        <GamificationPanel userStats={userStats} isMinimalMode={true} />

        {/* Main Task Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-2">
            <TaskList 
              onTaskComplete={handleTaskComplete}
              isMinimalMode={true}
              filterPriority={selectedPriority}
            />
          </div>

          {/* Timer */}
          <div className="lg:col-span-1">
            <PomodoroTimer 
              onComplete={handlePomodoroComplete}
              isMinimalMode={true}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowFloatingTimer(!showFloatingTimer)}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                {showFloatingTimer ? 'Hide' : 'Show'} Floating Timer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Tasks & Focus
          </h1>
          <p className="text-gray-600">
            Manage your tasks and stay focused with the Pomodoro technique.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<StatsCard
          title="Today's Points"
          value={userStats.today_points}
          icon="Star"
          color="primary"
          gradient={true}
        />
        <StatsCard
          title="Current Streak"
          value={`${userStats.streak} days`}
          icon="Flame"
          color="accent"
          gradient={true}
        />
        <StatsCard
          title="Current Level"
          value={userStats.level}
          icon="Trophy"
          color="secondary"
          gradient={true}
        />
        <StatsCard
          title="Total Points"
          value={userStats.total_points}
          icon="Award"
          color="success"
          gradient={true}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <TaskList 
            onTaskComplete={handleTaskComplete}
            filterPriority={selectedPriority}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timer */}
          <PomodoroTimer onComplete={handlePomodoroComplete} />
          
          {/* Gamification Panel */}
          <GamificationPanel userStats={userStats} />

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Lightbulb" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">ADHD Focus Tip</h3>
                <p className="text-sm text-blue-800">
                  Break large tasks into smaller, specific actions. Your brain loves clear, achievable steps!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;