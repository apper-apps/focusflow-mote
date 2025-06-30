import settingsData from '@/services/mockData/settings.json';

class SettingsService {
  constructor() {
    this.settings = { ...settingsData };
  }

  async getSettings() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...this.settings };
  }

  async updateSettings(updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.settings };
  }

  async resetToDefaults() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const defaults = {
      Id: 1,
      pomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      notifications: true,
      soundEnabled: true,
      dailyGoal: 8,
      workStartTime: "09:00",
      workEndTime: "17:00",
      motivationalMessages: true,
      streakReminders: true,
      weekendMode: false,
      theme: "light",
      language: "en",
      timezone: "America/New_York",
      emailNotifications: false,
      weeklyReports: true,
      dataRetention: 365,
      privacyMode: false
    };
    
    this.settings = { ...defaults };
    return { ...this.settings };
  }

  async getSetting(key) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.settings[key];
  }

  async updateSetting(key, value) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    this.settings[key] = value;
    this.settings.updatedAt = new Date().toISOString();
    
    return { [key]: value };
  }

  async getTimerSettings() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      pomodoroDuration: this.settings.pomodoroDuration,
      shortBreakDuration: this.settings.shortBreakDuration,
      longBreakDuration: this.settings.longBreakDuration,
      autoStartBreaks: this.settings.autoStartBreaks,
      autoStartPomodoros: this.settings.autoStartPomodoros
    };
  }

  async getNotificationSettings() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      notifications: this.settings.notifications,
      soundEnabled: this.settings.soundEnabled,
      motivationalMessages: this.settings.motivationalMessages,
      streakReminders: this.settings.streakReminders,
      emailNotifications: this.settings.emailNotifications
    };
  }

  async getThemeSettings() {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      theme: this.settings.theme,
      language: this.settings.language
    };
  }

  async exportSettings() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      settings: { ...this.settings }
    };
  }

  async importSettings(settingsData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate and merge settings
    const validKeys = Object.keys(this.settings);
    const filteredSettings = {};
    
    Object.keys(settingsData).forEach(key => {
      if (validKeys.includes(key) && key !== 'Id') {
        filteredSettings[key] = settingsData[key];
      }
    });
    
    this.settings = {
      ...this.settings,
      ...filteredSettings,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.settings };
  }
}

export default new SettingsService();