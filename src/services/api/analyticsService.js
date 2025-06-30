import { toast } from 'react-toastify';

class AnalyticsService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getOverview(timeRange = 'week') {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "tasks_completed" } },
          { field: { Name: "total_focus_time" } },
          { field: { Name: "average_focus_session" } },
          { field: { Name: "productivity_score" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('analytics', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return this.getDefaultAnalytics(timeRange);
      }

      const analytics = response.data?.[0] || this.getDefaultAnalytics(timeRange);
      
      // Simulate different data based on time range
      const multiplier = {
        today: 0.2,
        week: 1,
        month: 4.2,
        year: 52
      }[timeRange] || 1;

      return {
        ...analytics,
        tasks_completed: Math.round((analytics.tasks_completed || 18) * multiplier),
        total_focus_time: Math.round((analytics.total_focus_time || 435) * multiplier),
        tasksCompleted: Math.round((analytics.tasks_completed || 18) * multiplier),
        totalFocusTime: Math.round((analytics.total_focus_time || 435) * multiplier),
        averageFocusSession: analytics.average_focus_session || 24,
        productivityScore: analytics.productivity_score || 87,
        dailyStats: this.generateDailyStats(),
        weeklyTrend: this.generateWeeklyTrend(),
        priorityBreakdown: this.generatePriorityBreakdown(),
        streakData: this.generateStreakData()
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      toast.error('Failed to load analytics');
      return this.getDefaultAnalytics(timeRange);
    }
  }

  getDefaultAnalytics(timeRange) {
    const multiplier = {
      today: 0.2,
      week: 1,
      month: 4.2,
      year: 52
    }[timeRange] || 1;

    return {
      Id: 1,
      tasks_completed: Math.round(18 * multiplier),
      total_focus_time: Math.round(435 * multiplier),
      average_focus_session: 24,
      productivity_score: 87,
      tasksCompleted: Math.round(18 * multiplier),
      totalFocusTime: Math.round(435 * multiplier),
      averageFocusSession: 24,
      productivityScore: 87,
      dailyStats: this.generateDailyStats(),
      weeklyTrend: this.generateWeeklyTrend(),
      priorityBreakdown: this.generatePriorityBreakdown(),
      streakData: this.generateStreakData()
    };
  }

  generateDailyStats() {
    return [
      {
        date: "2024-01-08",
        tasksCompleted: 4,
        focusTime: 95,
        completionRate: 80,
        pomodorosCompleted: 4
      },
      {
        date: "2024-01-09",
        tasksCompleted: 3,
        focusTime: 75,
        completionRate: 75,
        pomodorosCompleted: 3
      },
      {
        date: "2024-01-10",
        tasksCompleted: 5,
        focusTime: 120,
        completionRate: 100,
        pomodorosCompleted: 5
      },
      {
        date: "2024-01-11",
        tasksCompleted: 2,
        focusTime: 50,
        completionRate: 66,
        pomodorosCompleted: 2
      },
      {
        date: "2024-01-12",
        tasksCompleted: 4,
        focusTime: 95,
        completionRate: 80,
        pomodorosCompleted: 4
      }
    ];
  }

  generateWeeklyTrend() {
    return {
      bestDay: "Wednesday",
      bestDayTasks: 5,
      peakHour: "10:00 AM",
      peakFocusMinutes: 45,
      improvement: 15
    };
  }

  generatePriorityBreakdown() {
    return [
      {
        level: "high",
        completed: 6,
        total: 8,
        percentage: 75
      },
      {
        level: "medium",
        completed: 8,
        total: 10,
        percentage: 80
      },
      {
        level: "low",
        completed: 4,
        total: 5,
        percentage: 80
      }
    ];
  }

  generateStreakData() {
    return {
      current: 7,
      longest: 14,
      thisMonth: 7,
      averageThisMonth: 5.2
    };
  }

  async getDailyStats(days = 7) {
    try {
      const analytics = await this.getOverview();
      return analytics.dailyStats?.slice(-days) || this.generateDailyStats().slice(-days);
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return this.generateDailyStats().slice(-days);
    }
  }

  async getWeeklyTrends() {
    try {
      const analytics = await this.getOverview();
      return {
        ...analytics.weeklyTrend,
        chartData: this.generateWeeklyChartData()
      };
    } catch (error) {
      console.error('Error getting weekly trends:', error);
      return {
        ...this.generateWeeklyTrend(),
        chartData: this.generateWeeklyChartData()
      };
    }
  }

  async getPriorityBreakdown() {
    try {
      const analytics = await this.getOverview();
      return analytics.priorityBreakdown || this.generatePriorityBreakdown();
    } catch (error) {
      console.error('Error getting priority breakdown:', error);
      return this.generatePriorityBreakdown();
    }
  }

  async getStreakAnalytics() {
    try {
      const analytics = await this.getOverview();
      return {
        ...analytics.streakData,
        streakHistory: this.generateStreakHistory()
      };
    } catch (error) {
      console.error('Error getting streak analytics:', error);
      return {
        ...this.generateStreakData(),
        streakHistory: this.generateStreakHistory()
      };
    }
  }

  async getFocusPatterns() {
    try {
      return {
        bestFocusHours: ["09:00", "10:00", "14:00"],
        averageSessionLength: 24,
        mostProductiveDays: ["Monday", "Wednesday", "Friday"],
        distractionTriggers: ["afternoon", "after lunch"]
      };
    } catch (error) {
      console.error('Error getting focus patterns:', error);
      return {
        bestFocusHours: ["09:00", "10:00", "14:00"],
        averageSessionLength: 24,
        mostProductiveDays: ["Monday", "Wednesday", "Friday"],
        distractionTriggers: ["afternoon", "after lunch"]
      };
    }
  }

  async getProductivityInsights() {
    try {
      const analytics = await this.getOverview();
      
      return {
        score: analytics.productivityScore || 87,
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
    } catch (error) {
      console.error('Error getting productivity insights:', error);
      return {
        score: 87,
        trends: {
          tasksCompletion: '+12%',
          focusTime: '+8%',
          efficiency: '+15%'
        },
        insights: []
      };
    }
  }

  async exportData(format = 'json', timeRange = 'month') {
    try {
      const analytics = await this.getOverview(timeRange);
      
      const exportData = {
        generatedAt: new Date().toISOString(),
        timeRange,
        format,
        data: {
          overview: analytics,
          dailyStats: analytics.dailyStats,
          weeklyTrends: analytics.weeklyTrend,
          priorityBreakdown: analytics.priorityBreakdown
        }
      };
      
      toast.success('Analytics data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      toast.error('Failed to export analytics data');
      throw error;
    }
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