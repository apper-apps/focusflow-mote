import userStatsData from '@/services/mockData/userStats.json';

class UserService {
  constructor() {
    this.userStats = { ...userStatsData };
  }

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...this.userStats };
  }

  async updateStats(updates) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    this.userStats = {
      ...this.userStats,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.userStats };
  }

  async incrementStreak() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.userStats.streak += 1;
    if (this.userStats.streak > this.userStats.longestStreak) {
      this.userStats.longestStreak = this.userStats.streak;
    }
    
    return { ...this.userStats };
  }

  async resetStreak() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.userStats.streak = 0;
    return { ...this.userStats };
  }

  async addPoints(points) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.userStats.totalPoints += points;
    this.userStats.todayPoints += points;
    
    // Calculate new level
    const newLevel = Math.floor(this.userStats.totalPoints / 100) + 1;
    const leveledUp = newLevel > this.userStats.level;
    this.userStats.level = newLevel;
    
    return {
      stats: { ...this.userStats },
      leveledUp
    };
  }

  async getAchievements() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.userStats.achievements];
  }

  async unlockAchievement(achievementId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const achievement = this.userStats.achievements.find(a => a.Id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
    }
    
    return { ...achievement };
  }

  async updatePreferences(preferences) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.userStats.preferences = {
      ...this.userStats.preferences,
      ...preferences
    };
    
    return { ...this.userStats.preferences };
  }

  async getDailyProgress() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      tasksCompleted: this.userStats.tasksCompletedToday,
      dailyGoal: 8, // This would come from user preferences
      completionRate: (this.userStats.tasksCompletedToday / 8) * 100,
      pointsEarned: this.userStats.todayPoints,
      focusTime: 120, // minutes
      streak: this.userStats.streak
    };
  }
}

export default new UserService();