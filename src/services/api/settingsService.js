import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

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
      
if (!response || !response.success) {
        const errorMessage = response?.message || 'Failed to fetch settings';
        console.error(errorMessage);
        return this.getDefaultSettings();
      }
// Convert database field names to camelCase for frontend compatibility
      const rawData = response.data?.[0];
      if (rawData) {
        return {
          Id: rawData.Id,
          Name: rawData.Name,
          pomodoroDuration: rawData.pomodoro_duration || 25,
          shortBreakDuration: rawData.short_break_duration || 5,
          longBreakDuration: rawData.long_break_duration || 15,
          autoStartBreaks: rawData.auto_start_breaks !== undefined ? rawData.auto_start_breaks : true,
          autoStartPomodoros: rawData.auto_start_pomodoros !== undefined ? rawData.auto_start_pomodoros : false,
          notifications: rawData.notifications !== undefined ? rawData.notifications : true,
          soundEnabled: rawData.sound_enabled !== undefined ? rawData.sound_enabled : true,
          dailyGoal: rawData.daily_goal || 8,
          workStartTime: rawData.work_start_time || '09:00',
          workEndTime: rawData.work_end_time || '17:00',
          motivationalMessages: rawData.motivational_messages !== undefined ? rawData.motivational_messages : true,
          streakReminders: rawData.streak_reminders !== undefined ? rawData.streak_reminders : true,
          weekendMode: rawData.weekend_mode !== undefined ? rawData.weekend_mode : false,
          theme: rawData.theme || 'light',
          language: rawData.language || 'en',
          timezone: rawData.timezone || 'UTC',
          emailNotifications: rawData.email_notifications !== undefined ? rawData.email_notifications : false,
          weeklyReports: rawData.weekly_reports !== undefined ? rawData.weekly_reports : false,
          dataRetention: rawData.data_retention || 365,
          privacyMode: rawData.privacy_mode !== undefined ? rawData.privacy_mode : false
        };
      }

      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      return this.getDefaultSettings();
    }
  }


async createDefaultSettings(apperClient, defaultSettings) {
    try {
      const createParams = {
        records: [{
          Name: "Default Settings",
          pomodoro_duration: defaultSettings.pomodoro_duration || 25,
          short_break_duration: defaultSettings.short_break_duration || 5,
          long_break_duration: defaultSettings.long_break_duration || 15,
          auto_start_breaks: defaultSettings.auto_start_breaks || false,
          auto_start_pomodoros: defaultSettings.auto_start_pomodoros || false,
          notifications: defaultSettings.notifications || true,
          sound_enabled: defaultSettings.sound_enabled || true,
          daily_goal: defaultSettings.daily_goal || 8,
          work_start_time: defaultSettings.work_start_time || '09:00',
          work_end_time: defaultSettings.work_end_time || '17:00',
          motivational_messages: defaultSettings.motivational_messages || true,
          streak_reminders: defaultSettings.streak_reminders || true,
          weekend_mode: defaultSettings.weekend_mode || false,
          theme: defaultSettings.theme || 'light',
          language: defaultSettings.language || 'en',
          timezone: defaultSettings.timezone || 'UTC',
          email_notifications: defaultSettings.email_notifications || false,
weekly_reports: defaultSettings.weekly_reports || false,
          data_retention: defaultSettings.data_retention || 30,
          privacy_mode: defaultSettings.privacy_mode || false
        }]
      };

      const response = await apperClient.createRecord("settings", createParams);
      
      if (response.success && response.results && response.results.length > 0) {
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return { success: true, data: successfulRecord.data };
        }
      }

      return { success: false };
    } catch (error) {
      console.error("Error creating default settings:", error);
      return { success: false };
    }
  }

getDefaultSettings() {
    return {
      Id: 1,
      Name: "Default Settings",
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
  }

async updateSettings(updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Get current settings first to find the record ID
      const currentSettings = await this.getSettings();
      
      const updateData = {
        Id: currentSettings.Id || 1
      };

      // Convert camelCase frontend properties to snake_case database fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.pomodoroDuration !== undefined) updateData.pomodoro_duration = updates.pomodoroDuration;
      if (updates.shortBreakDuration !== undefined) updateData.short_break_duration = updates.shortBreakDuration;
      if (updates.longBreakDuration !== undefined) updateData.long_break_duration = updates.longBreakDuration;
      if (updates.autoStartBreaks !== undefined) updateData.auto_start_breaks = updates.autoStartBreaks;
      if (updates.autoStartPomodoros !== undefined) updateData.auto_start_pomodoros = updates.autoStartPomodoros;
      if (updates.notifications !== undefined) updateData.notifications = updates.notifications;
      if (updates.soundEnabled !== undefined) updateData.sound_enabled = updates.soundEnabled;
      if (updates.dailyGoal !== undefined) updateData.daily_goal = updates.dailyGoal;
      if (updates.workStartTime !== undefined) updateData.work_start_time = updates.workStartTime;
      if (updates.workEndTime !== undefined) updateData.work_end_time = updates.workEndTime;
      if (updates.motivationalMessages !== undefined) updateData.motivational_messages = updates.motivationalMessages;
      if (updates.streakReminders !== undefined) updateData.streak_reminders = updates.streakReminders;
      if (updates.weekendMode !== undefined) updateData.weekend_mode = updates.weekendMode;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.language !== undefined) updateData.language = updates.language;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.emailNotifications !== undefined) updateData.email_notifications = updates.emailNotifications;
      if (updates.weeklyReports !== undefined) updateData.weekly_reports = updates.weeklyReports;
      if (updates.dataRetention !== undefined) updateData.data_retention = updates.dataRetention;
      if (updates.privacyMode !== undefined) updateData.privacy_mode = updates.privacyMode;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('settings', params);
      
if (!response.success) {
        console.error(`Failed to update settings: ${response.message}`);
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
      toast.error('Failed to load theme settings');
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