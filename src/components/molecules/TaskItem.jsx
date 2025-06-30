import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const TaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onEdit,
  isDragging = false,
  dragHandleProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing && editTitle.trim()) {
      onEdit(task.Id, { title: editTitle.trim() });
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    high: 'border-l-accent-500',
    medium: 'border-l-secondary-500',
    low: 'border-l-success',
  };

  const priorityIcons = {
    high: 'AlertTriangle',
    medium: 'Clock',
    low: 'CheckCircle2',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        bg-white rounded-lg border-l-4 shadow-soft hover:shadow-medium
        transition-all duration-200 group
        ${priorityColors[task.priority]}
        ${isDragging ? 'task-dragging' : ''}
        ${task.completed ? 'opacity-75' : ''}
      `}
    >
      <div className="p-4 flex items-center space-x-3">
        {/* Drag Handle */}
        <div 
          {...dragHandleProps}
          className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
        </div>

        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.Id)}
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200
            ${task.completed 
              ? 'bg-gradient-to-br from-success to-green-600 border-success' 
              : 'border-gray-300 hover:border-primary-500'
            }
          `}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="checkbox-checked"
            >
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleEdit}
              className="w-full bg-transparent border-none focus:outline-none font-medium text-gray-900"
              autoFocus
            />
          ) : (
            <div className="space-y-1">
              <h3 className={`
                font-medium transition-all duration-200
                ${task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900'
                }
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-2">
                <Badge variant={task.priority} size="xs">
                  <ApperIcon name={priorityIcons[task.priority]} className="w-3 h-3 mr-1" />
                  {task.priority}
                </Badge>
                
                {task.dueDate && (
                  <Badge variant="default" size="xs">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Badge>
                )}
                
                <Badge variant="primary" size="xs">
                  +{task.points} pts
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-primary-500 rounded"
          >
            <ApperIcon name={isEditing ? "Check" : "Edit2"} className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.Id)}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;