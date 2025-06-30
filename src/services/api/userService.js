import { toast } from "react-toastify";

class UserService {
  constructor() {
    this.apperClient = null;
    this.isInitializing = false;
    this.initializeClient();
  }

  initializeClient() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      if (typeof window !== 'undefined' && window.ApperSDK) {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.isInitializing = false;
      } else {
        // SDK not loaded yet, try again in a moment
        setTimeout(() => {
          this.isInitializing = false;
          this.initializeClient();
        }, 100);
      }
    } catch (error) {
      console.error('Error initializing ApperClient:', error);
      this.isInitializing = false;
    }
  }

  async waitForSDK(maxWaitTime = 10000) {
    const startTime = Date.now();
    
    while (!this.apperClient && (Date.now() - startTime) < maxWaitTime) {
      if (!this.isInitializing) {
        this.initializeClient();
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.apperClient) {
      throw new Error('ApperClient failed to initialize within the timeout period');
    }
    
    return this.apperClient;
  }

async getStats() {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
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

      // Handle undefined response structure
      if (!response || typeof response === 'undefined' || response === null) {
        console.error('Failed to fetch user stats: Received undefined response from API');
        toast.error('Unable to connect to user stats service');
        return this.getDefaultStats();
      }

      if (!response.success) {
        console.error('Failed to fetch user stats:', response.message);
        toast.error(response.message || 'Failed to load user stats');
        return this.getDefaultStats();
      }

      if (!response.data || response.data.length === 0) {
        // Return default stats if no data exists
        return this.getDefaultStats();
      }

      const stats = response.data[0];
      return {
        Id: stats.Id,
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
      toast.error('Failed to load user stats');
      return this.getDefaultStats();
    }
  }

  getDefaultStats() {
    return {
      Id: null,
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


async updateStats(updates) {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }
      
      // Get current stats first to find the record ID
      const currentStats = await this.getStats();
      
      // If no existing record and no ID, create a new record
      if (!currentStats.Id) {
        return await this.createStats(updates);
      }
      
      const updateData = {
        Id: currentStats.Id
      };

      // Only include updateable fields using exact database field names
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
      
      // Handle undefined response structure  
      if (!response || typeof response === 'undefined' || response === null) {
        console.error('Failed to update user stats: Received undefined response from API');
        toast.error('Unable to connect to user stats service');
        throw new Error('API returned undefined response');
      }
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message || 'Failed to update stats');
        throw new Error(response.message || 'Update failed');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
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

  async createStats(initialData = {}) {
    try {
      // Ensure client is initialized
      if (!this.apperClient) {
        await this.waitForSDK();
      }

      const createData = {
        Name: initialData.Name || 'Default User Stats',
        streak: initialData.streak || 0,
        level: initialData.level || 1,
        total_points: initialData.total_points || 0,
        today_points: initialData.today_points || 0,
        longest_streak: initialData.longest_streak || 0,
        tasks_completed_today: initialData.tasks_completed_today || 0,
        tasks_completed_this_week: initialData.tasks_completed_this_week || 0,
        total_tasks_completed: initialData.total_tasks_completed || 0,
        average_focus_time: initialData.average_focus_time || 0,
        total_focus_time: initialData.total_focus_time || 0,
        pomodoros_completed: initialData.pomodoros_completed || 0
      };

      const params = {
        records: [createData]
      };

      const response = await this.apperClient.createRecord('user_stats', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message || 'Failed to create stats');
        throw new Error(response.message || 'Create failed');
      }

      if (response.results) {
        const successfulCreates = response.results.filter(result => result.success);
        const failedCreates = response.results.filter(result => !result.success);
        
        if (failedCreates.length > 0) {
          console.error(`Failed to create ${failedCreates.length} records:${JSON.stringify(failedCreates)}`);
          
          failedCreates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreates.length > 0) {
          return successfulCreates[0].data;
        }
      }

      throw new Error('Failed to create stats');
    } catch (error) {
      console.error('Error creating user stats:', error);
      toast.error('Failed to create stats');
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