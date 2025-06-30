import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickAddTask = ({ onAdd, isMinimalMode = false }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        priority,
        completed: false,
        points: priority === 'high' ? 10 : priority === 'medium' ? 5 : 3,
        dueDate: null,
        order: Date.now()
      });
      setTitle('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsExpanded(false);
    }
  };

  if (isMinimalMode && !isExpanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:from-primary-100 hover:to-primary-200 transition-all duration-200"
      >
        <ApperIcon name="Plus" className="w-5 h-5 mx-auto mb-1" />
        <span className="text-sm font-medium">Add Task</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-lg shadow-soft border-2 border-primary-200
        ${isMinimalMode ? 'mb-4' : 'mb-6'}
      `}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded border-2 border-primary-300 bg-primary-50"></div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="What would you like to focus on?"
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500"
            autoFocus={isExpanded}
          />
          
          {!isMinimalMode && (
            <div className="flex items-center space-x-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <Button
                type="submit"
                size="sm"
                disabled={!title.trim()}
                icon="Plus"
              >
                Add
              </Button>
            </div>
          )}
        </div>
        
        {isMinimalMode && (
          <div className="mt-3 flex items-center justify-between">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTitle('');
                  setIsExpanded(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!title.trim()}
                icon="Plus"
              >
                Add Task
              </Button>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAddTask;