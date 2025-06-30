import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/molecules/StatsCard';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import AnalyticsService from '@/services/api/analyticsService';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await AnalyticsService.getOverview(timeRange);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return <Error message={error} onRetry={loadAnalytics} />;
  }

  if (!analytics) return null;

  const {
    tasksCompleted,
    totalFocusTime,
    averageFocusSession,
    productivityScore,
    dailyStats,
    weeklyTrend,
    priorityBreakdown,
    streakData
  } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Analytics & insights
          </h1>
          <p className="text-gray-600">
            Track your progress and discover your productivity patterns.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tasks Completed"
          value={tasksCompleted}
          icon="CheckCircle2"
          color="success"
          gradient={true}
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Focus Time"
          value={`${Math.floor(totalFocusTime / 60)}h ${totalFocusTime % 60}m`}
          icon="Timer"
          color="primary"
          gradient={true}
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title="Avg Session"
          value={`${averageFocusSession} min`}
          icon="Target"
          color="secondary"
          gradient={true}
          trend="up"
          trendValue="+5%"
        />
        <StatsCard
          title="Productivity Score"
          value={`${productivityScore}%`}
          icon="TrendingUp"
          color="accent"
          gradient={true}
          trend="up"
          trendValue="+15%"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Daily Progress
          </h3>
          
          <div className="space-y-4">
            {dailyStats.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="CheckSquare" className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{day.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{day.focusTime}min</span>
                  </div>
                </div>
                
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${day.completionRate}%` }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Task Priority Breakdown
          </h3>
          
          <div className="space-y-4">
            {priorityBreakdown.map((priority, index) => (
              <motion.div
                key={priority.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    priority.level === 'high' ? 'bg-red-500' :
                    priority.level === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="font-medium text-gray-700 capitalize">
                    {priority.level} Priority
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {priority.completed}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {priority.total}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Streak Information */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Consistency Tracking
          </h3>
          
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Flame" className="w-6 h-6 text-white animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{streakData.current} Days</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">{streakData.longest}</p>
                <p className="text-xs text-gray-600">Longest Streak</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">{streakData.thisMonth}</p>
                <p className="text-xs text-gray-600">This Month</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Weekly Trends
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Most Productive Day</p>
                  <p className="text-sm text-green-700">{weeklyTrend.bestDay}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-900">
                {weeklyTrend.bestDayTasks} tasks
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Peak Focus Time</p>
                  <p className="text-sm text-blue-700">{weeklyTrend.peakHour}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-900">
                {weeklyTrend.peakFocusMinutes}min
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Target" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">Focus Improvement</p>
                  <p className="text-sm text-purple-700">vs last week</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-900">
                +{weeklyTrend.improvement}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Personalized Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ApperIcon name="Lightbulb" className="w-4 h-4 text-yellow-500 mr-2" />
              What's Working Well
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your morning focus sessions are 40% more productive</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>You complete high-priority tasks 85% of the time</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your streak consistency has improved by 23%</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ApperIcon name="Target" className="w-4 h-4 text-blue-500 mr-2" />
              Opportunities to Improve
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Try scheduling more tasks for your peak hours (9-11 AM)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Consider breaking down large tasks into smaller chunks</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Weekend consistency could help maintain momentum</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;