import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import MotivationalToast from '@/components/molecules/MotivationalToast';
import SettingsService from '@/services/api/settingsService';

const SettingsPage = () => {
const [settings, setSettings] = useState({
    pomodoro_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    auto_start_breaks: true,
    auto_start_pomodoros: false,
    notifications: true,
    sound_enabled: true,
    daily_goal: 8,
    work_start_time: '09:00',
    work_end_time: '17:00',
    motivational_messages: true,
    streak_reminders: true,
    weekend_mode: false,
    theme: 'light'
  });
  
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

const loadSettings = async () => {
    try {
      const data = await SettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await SettingsService.updateSettings(settings);
      setHasChanges(false);
      MotivationalToast.taskCompleted(5);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const defaultSettings = await SettingsService.resetToDefaults();
      setSettings(defaultSettings);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const testNotification = () => {
    MotivationalToast.encouragement();
  };

  const settingSections = [
    {
      title: 'Pomodoro Timer',
      icon: 'Timer',
      settings: [
{
          key: 'pomodoro_duration',
          label: 'Focus Duration (minutes)',
          type: 'number',
          min: 5,
          max: 60,
          description: 'How long each focus session lasts'
        },
        {
          key: 'short_break_duration',
          label: 'Short Break (minutes)',
          type: 'number',
          min: 1,
          max: 15,
          description: 'Short break between focus sessions'
        },
        {
          key: 'long_break_duration',
          label: 'Long Break (minutes)',
          type: 'number',
          min: 5,
          max: 30,
          description: 'Long break after 4 focus sessions'
        },
        {
          key: 'auto_start_breaks',
          label: 'Auto-start breaks',
          type: 'toggle',
          description: 'Automatically start break timers'
        },
        {
          key: 'auto_start_pomodoros',
          label: 'Auto-start pomodoros',
          type: 'toggle',
          description: 'Automatically start next focus session after break'
        }
      ]
    },
    {
      title: 'Notifications & Sound',
      icon: 'Bell',
      settings: [
{
          key: 'notifications',
          label: 'Enable notifications',
          type: 'toggle',
          description: 'Show notifications for timers and achievements'
        },
        {
          key: 'sound_enabled',
          label: 'Sound effects',
          type: 'toggle',
          description: 'Play sounds for timer alerts'
        },
        {
          key: 'motivational_messages',
          label: 'Motivational messages',
          type: 'toggle',
          description: 'Show encouraging messages after completing tasks'
        },
        {
          key: 'streak_reminders',
          label: 'Streak reminders',
          type: 'toggle',
          description: 'Remind you to maintain your daily streak'
        }
      ]
    },
    {
      title: 'Goals & Schedule',
      icon: 'Target',
      settings: [
{
          key: 'daily_goal',
          label: 'Daily task goal',
          type: 'number',
          min: 1,
          max: 20,
          description: 'Number of tasks you aim to complete daily'
        },
        {
          key: 'work_start_time',
          label: 'Work start time',
          type: 'time',
          description: 'When your productive hours begin'
        },
        {
          key: 'work_end_time',
          label: 'Work end time',
          type: 'time',
          description: 'When your productive hours end'
        },
        {
          key: 'weekend_mode',
          label: 'Relaxed weekend mode',
          type: 'toggle',
          description: 'Reduce goals and reminders on weekends'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: 'Palette',
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' }
          ],
          description: 'Choose your preferred color theme'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Settings & Preferences
          </h1>
          <p className="text-gray-600">
            Customize FocusFlow to work best for your ADHD brain.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={testNotification}
            variant="outline"
            icon="Bell"
          >
            Test Notification
          </Button>
          
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <Button
                onClick={handleReset}
                variant="ghost"
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                icon="Save"
              >
                Save Changes
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name={section.icon} className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (settingIndex * 0.05) }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 pr-6">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => handleSettingChange(setting.key, !settings[setting.key])}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                            ${settings[setting.key] 
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
                              : 'bg-gray-200'
                            }
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                              ${settings[setting.key] ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </button>
                      )}

                      {setting.type === 'number' && (
                        <Input
                          type="number"
                          value={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                          min={setting.min}
                          max={setting.max}
                          className="w-20"
                        />
                      )}

                      {setting.type === 'time' && (
                        <Input
                          type="time"
                          value={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="w-32"
                        />
                      )}

                      {setting.type === 'select' && (
                        <select
                          value={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {setting.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ADHD Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Brain" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-blue-900 mb-2">
                ADHD-Optimized Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Start with shorter 15-20 minute focus sessions and gradually increase</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Enable motivational messages - positive reinforcement helps ADHD brains stay motivated</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Set realistic daily goals (3-5 tasks) to avoid overwhelm and build confidence</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use auto-start features to reduce decision fatigue and maintain momentum</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;