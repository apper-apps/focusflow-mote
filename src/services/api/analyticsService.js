import analyticsData from '@/services/mockData/analytics.json';

class AnalyticsService {
  constructor() {
    this.analytics = { ...analyticsData };
  }

  async getOverview(timeRange = 'week') {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Simulate different data based on time range
    const multiplier = {
      today: 0.2,
      week: 1,
      month: 4.2,
      year: 52
    }[timeRange] || 1;

    return {
      ...this.analytics,
      tasksCompleted: Math.round(this.analytics.tasksCompleted * multiplier),
      totalFocusTime: Math.round(this.analytics.totalFocusTime * multiplier),
    };
  }

  async getDailyStats(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return this.analytics.dailyStats.slice(-days);
  }

  async getWeeklyTrends() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      ...this.analytics.weeklyTrend,
      chartData: this.generateWeeklyChartData()
    };
  }

  async getPriorityBreakdown() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.analytics.priorityBreakdown;
  }

  async getStreakAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      ...this.analytics.streakData,
      streakHistory: this.generateStreakHistory()
    };
  }

  async getFocusPatterns() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.analytics.focusPatterns;
  }

  async getProductivityInsights() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      score: this.analytics.productivityScore,
      trends: {
        tasksCompletion: '+12%',
        focusTime: '+8%',
        efficiency: '+15%'
      },
      insights: [
        {
          type: 'positive',
          title: 'Morning Productivity',
          description: 'You\'re 40% more productive in morning sessions'
        },
        {
          type: 'improvement',
          title: 'Afternoon Focus',
          description: 'Consider shorter sessions after 2 PM'
        },
        {
          type: 'neutral',
          title: 'Weekend Pattern',
          description: 'Consistent weekend activity helps maintain momentum'
        }
      ]
    };
  }

  async exportData(format = 'json', timeRange = 'month') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      format,
      data: {
        overview: this.analytics,
        dailyStats: this.analytics.dailyStats,
        weeklyTrends: this.analytics.weeklyTrend,
        priorityBreakdown: this.analytics.priorityBreakdown
      }
    };
    
    return exportData;
  }

  generateWeeklyChartData() {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      tasks: Math.floor(Math.random() * 6) + 2,
      focusTime: Math.floor(Math.random() * 60) + 30
    }));
  }

  generateStreakHistory() {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasActivity: Math.random() > 0.2 // 80% chance of activity
    }));
  }
}

export default new AnalyticsService();