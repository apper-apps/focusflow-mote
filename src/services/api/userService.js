import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class UserService {
constructor() {
    this.apperClient = null;
    // Don't initialize immediately - use lazy initialization
  }

  initializeClient() {
    // Check if SDK is available
    if (!window.ApperSDK) {
      return false;
    }

    try {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      return true;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return false;
    }
  }

  async waitForSDK(maxWaitTime = 10000) {
    const pollInterval = 100;
    const maxAttempts = maxWaitTime / pollInterval;
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const checkSDK = () => {
        attempts++;
        
        if (this.initializeClient()) {
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error('Apper SDK failed to load within the expected time. Please refresh the page.'));
          return;
        }

        setTimeout(checkSDK, pollInterval);
      };

      checkSDK();
    });
  }

async getStats() {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }

      const params = {
        fields: [
          { field: { Name: "streak" } },
          { field: { Name: "level" } },
          { field: { Name: "total_points" } },
          { field: { Name: "today_points" } },
          { field: { Name: "longest_streak" } },
          { field: { Name: "tasks_completed_today" } },
          { field: { Name: "tasks_completed_this_week" } },
          { field: { Name: "total_tasks_completed" } },
          { field: { Name: "average_focus_time" } },
          { field: { Name: "total_focus_time" } },
          { field: { Name: "pomodoros_completed" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords('user_stats', params);
      
      if (!response.success) {
        console.error('Failed to fetch user stats:', response.message);
        return {
          streak: 0,
          level: 1,
          total_points: 0,
          today_points: 0,
          longest_streak: 0,
          tasks_completed_today: 0,
          tasks_completed_this_week: 0,
          total_tasks_completed: 0,
          average_focus_time: 0,
          total_focus_time: 0,
          pomodoros_completed: 0
        };
      }

      if (!response.data || response.data.length === 0) {
        // Return default stats if no data exists
        return {
          streak: 0,
          level: 1,
          total_points: 0,
          today_points: 0,
          longest_streak: 0,
          tasks_completed_today: 0,
          tasks_completed_this_week: 0,
          total_tasks_completed: 0,
          average_focus_time: 0,
          total_focus_time: 0,
          pomodoros_completed: 0
        };
      }

      const stats = response.data[0];
      return {
        streak: stats.streak || 0,
        level: stats.level || 1,
        total_points: stats.total_points || 0,
        today_points: stats.today_points || 0,
        longest_streak: stats.longest_streak || 0,
        tasks_completed_today: stats.tasks_completed_today || 0,
        tasks_completed_this_week: stats.tasks_completed_this_week || 0,
        total_tasks_completed: stats.total_tasks_completed || 0,
        average_focus_time: stats.average_focus_time || 0,
        total_focus_time: stats.total_focus_time || 0,
        pomodoros_completed: stats.pomodoros_completed || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to load user stats');
      return {
        streak: 0,
        level: 1,
        total_points: 0,
        today_points: 0,
        longest_streak: 0,
        tasks_completed_today: 0,
        tasks_completed_this_week: 0,
        total_tasks_completed: 0,
        average_focus_time: 0,
        total_focus_time: 0,
        pomodoros_completed: 0
      };
    }
  }

  async updateStats(updates) {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }

      // Filter to only include Updateable fields from user_stats table
      const updateableFields = ['streak', 'level', 'total_points', 'today_points', 'longest_streak', 
                               'tasks_completed_today', 'tasks_completed_this_week', 'total_tasks_completed',
                               'average_focus_time', 'total_focus_time', 'pomodoros_completed'];
      
      const filteredUpdates = {};
      Object.keys(updates).forEach(key => {
        if (updateableFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      // Get current user stats to update the existing record
      const currentStats = await this.getStats();
      if (!currentStats) {
        throw new Error('Unable to fetch current user stats for update');
      }

      // Assume we have a record to update (in production, you'd fetch the actual record ID)
      const params = {
        records: [{
          Id: 1, // This should be the actual user stats record ID
          ...filteredUpdates
        }]
      };

      const response = await this.apperClient.updateRecord('user_stats', params);
      
      if (!response.success) {
        console.error('Failed to update user stats:', response.message);
        const { toast } = await import('react-toastify');
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          const { toast } = await import('react-toastify');
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to update user stats');
      return false;
    }
  }

  async updateStats(updates) {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }
      // Get current stats first to find the record ID
      const currentStats = await this.getStats();
      
      const updateData = {
        Id: currentStats.Id || 1
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.streak !== undefined) updateData.streak = updates.streak;
      if (updates.level !== undefined) updateData.level = updates.level;
      if (updates.total_points !== undefined) updateData.total_points = updates.total_points;
      if (updates.today_points !== undefined) updateData.today_points = updates.today_points;
      if (updates.longest_streak !== undefined) updateData.longest_streak = updates.longest_streak;
      if (updates.tasks_completed_today !== undefined) updateData.tasks_completed_today = updates.tasks_completed_today;
      if (updates.tasks_completed_this_week !== undefined) updateData.tasks_completed_this_week = updates.tasks_completed_this_week;
      if (updates.total_tasks_completed !== undefined) updateData.total_tasks_completed = updates.total_tasks_completed;
      if (updates.average_focus_time !== undefined) updateData.average_focus_time = updates.average_focus_time;
      if (updates.total_focus_time !== undefined) updateData.total_focus_time = updates.total_focus_time;
      if (updates.pomodoros_completed !== undefined) updateData.pomodoros_completed = updates.pomodoros_completed;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('user_stats', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records: ${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update stats');
    } catch (error) {
      console.error('Error updating user stats:', error);
      toast.error('Failed to update stats');
      throw error;
    }
  }

  async incrementStreak() {
    try {
      const currentStats = await this.getStats();
      const newStreak = currentStats.streak + 1;
      const newLongestStreak = Math.max(newStreak, currentStats.longest_streak);
      
      return await this.updateStats({
        streak: newStreak,
        longest_streak: newLongestStreak
      });
    } catch (error) {
      console.error('Error incrementing streak:', error);
      toast.error('Failed to update streak');
      throw error;
    }
  }

  async resetStreak() {
    try {
      return await this.updateStats({
        streak: 0
      });
    } catch (error) {
      console.error('Error resetting streak:', error);
      toast.error('Failed to reset streak');
      throw error;
    }
  }

  async addPoints(points) {
    try {
      const currentStats = await this.getStats();
      const newTotalPoints = currentStats.total_points + points;
      const newTodayPoints = currentStats.today_points + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      const leveledUp = newLevel > currentStats.level;
      
      const updatedStats = await this.updateStats({
        total_points: newTotalPoints,
        today_points: newTodayPoints,
        level: newLevel
      });
      
      return {
        stats: updatedStats,
        leveledUp
      };
    } catch (error) {
      console.error('Error adding points:', error);
      toast.error('Failed to add points');
      throw error;
    }
  }

  async getDailyProgress() {
    try {
      const stats = await this.getStats();
      
      return {
        tasksCompleted: stats.tasks_completed_today || 0,
        dailyGoal: 8, // This would come from user preferences
        completionRate: ((stats.tasks_completed_today || 0) / 8) * 100,
        pointsEarned: stats.today_points || 0,
        focusTime: stats.total_focus_time || 0,
        streak: stats.streak || 0
      };
    } catch (error) {
      console.error('Error getting daily progress:', error);
      toast.error('Failed to load daily progress');
      return {
        tasksCompleted: 0,
        dailyGoal: 8,
        completionRate: 0,
        pointsEarned: 0,
        focusTime: 0,
        streak: 0
      };
    }
  }
}

// Export singleton instance
export default new UserService();