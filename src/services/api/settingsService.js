import { toast } from 'react-toastify';

class SettingsService {
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

  async getSettings() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "pomodoro_duration" } },
          { field: { Name: "short_break_duration" } },
          { field: { Name: "long_break_duration" } },
          { field: { Name: "auto_start_breaks" } },
          { field: { Name: "auto_start_pomodoros" } },
          { field: { Name: "notifications" } },
          { field: { Name: "sound_enabled" } },
          { field: { Name: "daily_goal" } },
          { field: { Name: "work_start_time" } },
          { field: { Name: "work_end_time" } },
          { field: { Name: "motivational_messages" } },
          { field: { Name: "streak_reminders" } },
          { field: { Name: "weekend_mode" } },
          { field: { Name: "theme" } },
          { field: { Name: "language" } },
          { field: { Name: "timezone" } },
          { field: { Name: "email_notifications" } },
          { field: { Name: "weekly_reports" } },
          { field: { Name: "data_retention" } },
          { field: { Name: "privacy_mode" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('settings', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return this.getDefaultSettings();
      }

      // Return first record or default values
      return response.data?.[0] || this.getDefaultSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      Id: 1,
      pomodoro_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      auto_start_breaks: true,
      auto_start_pomodoros: false,
      notifications: true,
      sound_enabled: true,
      daily_goal: 8,
      work_start_time: "09:00",
      work_end_time: "17:00",
      motivational_messages: true,
      streak_reminders: true,
      weekend_mode: false,
      theme: "light",
      language: "en",
      timezone: "America/New_York",
      email_notifications: false,
      weekly_reports: true,
      data_retention: 365,
      privacy_mode: false
    };
  }

  async updateSettings(updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Get current settings first to find the record ID
      const currentSettings = await this.getSettings();
      
      const updateData = {
        Id: currentSettings.Id || 1
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.pomodoro_duration !== undefined) updateData.pomodoro_duration = updates.pomodoro_duration;
      if (updates.short_break_duration !== undefined) updateData.short_break_duration = updates.short_break_duration;
      if (updates.long_break_duration !== undefined) updateData.long_break_duration = updates.long_break_duration;
      if (updates.auto_start_breaks !== undefined) updateData.auto_start_breaks = updates.auto_start_breaks;
      if (updates.auto_start_pomodoros !== undefined) updateData.auto_start_pomodoros = updates.auto_start_pomodoros;
      if (updates.notifications !== undefined) updateData.notifications = updates.notifications;
      if (updates.sound_enabled !== undefined) updateData.sound_enabled = updates.sound_enabled;
      if (updates.daily_goal !== undefined) updateData.daily_goal = updates.daily_goal;
      if (updates.work_start_time !== undefined) updateData.work_start_time = updates.work_start_time;
      if (updates.work_end_time !== undefined) updateData.work_end_time = updates.work_end_time;
      if (updates.motivational_messages !== undefined) updateData.motivational_messages = updates.motivational_messages;
      if (updates.streak_reminders !== undefined) updateData.streak_reminders = updates.streak_reminders;
      if (updates.weekend_mode !== undefined) updateData.weekend_mode = updates.weekend_mode;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.language !== undefined) updateData.language = updates.language;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.email_notifications !== undefined) updateData.email_notifications = updates.email_notifications;
      if (updates.weekly_reports !== undefined) updateData.weekly_reports = updates.weekly_reports;
      if (updates.data_retention !== undefined) updateData.data_retention = updates.data_retention;
      if (updates.privacy_mode !== undefined) updateData.privacy_mode = updates.privacy_mode;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('settings', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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
          toast.success('Settings updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update settings');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  }

  async resetToDefaults() {
    try {
      const defaults = this.getDefaultSettings();
      return await this.updateSettings(defaults);
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      toast.error('Failed to reset settings');
      throw error;
    }
  }

  async getSetting(key) {
    try {
      const settings = await this.getSettings();
      return settings[key];
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return null;
    }
  }

  async updateSetting(key, value) {
    try {
      const updates = { [key]: value };
      await this.updateSettings(updates);
      return { [key]: value };
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  }

  async getTimerSettings() {
    try {
      const settings = await this.getSettings();
      
      return {
        pomodoro_duration: settings.pomodoro_duration,
        short_break_duration: settings.short_break_duration,
        long_break_duration: settings.long_break_duration,
        auto_start_breaks: settings.auto_start_breaks,
        auto_start_pomodoros: settings.auto_start_pomodoros
      };
    } catch (error) {
      console.error('Error getting timer settings:', error);
      toast.error('Failed to load timer settings');
      return {
        pomodoro_duration: 25,
        short_break_duration: 5,
        long_break_duration: 15,
        auto_start_breaks: true,
        auto_start_pomodoros: false
      };
    }
  }

  async getNotificationSettings() {
    try {
      const settings = await this.getSettings();
      
      return {
        notifications: settings.notifications,
        sound_enabled: settings.sound_enabled,
        motivational_messages: settings.motivational_messages,
        streak_reminders: settings.streak_reminders,
        email_notifications: settings.email_notifications
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      toast.error('Failed to load notification settings');
      return {
        notifications: true,
        sound_enabled: true,
        motivational_messages: true,
        streak_reminders: true,
        email_notifications: false
      };
    }
  }

  async getThemeSettings() {
    try {
      const settings = await this.getSettings();
      
      return {
        theme: settings.theme,
        language: settings.language
      };
    } catch (error) {
      console.error('Error getting theme settings:', error);
      return {
        theme: "light",
        language: "en"
      };
    }
  }

  async exportSettings() {
    try {
      const settings = await this.getSettings();
      
      return {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        settings: settings
      };
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Failed to export settings');
      throw error;
    }
  }

  async importSettings(settingsData) {
    try {
      const defaults = this.getDefaultSettings();
      const validKeys = Object.keys(defaults);
      const filteredSettings = {};
      
      Object.keys(settingsData).forEach(key => {
        if (validKeys.includes(key) && key !== 'Id') {
          filteredSettings[key] = settingsData[key];
        }
      });
      
      const updatedSettings = await this.updateSettings(filteredSettings);
      toast.success('Settings imported successfully');
      return updatedSettings;
    } catch (error) {
      console.error('Error importing settings:', error);
      toast.error('Failed to import settings');
      throw error;
    }
  }
}

export default new SettingsService();