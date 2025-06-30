import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';
import QuickAddTask from '@/components/molecules/QuickAddTask';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import TaskService from '@/services/api/taskService';
import MotivationalToast from '@/components/molecules/MotivationalToast';

const TaskList = ({ onTaskComplete, isMinimalMode = false, filterPriority = 'all' }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await TaskService.getAll();
      setTasks(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

const handleAddTask = async (taskData) => {
    try {
      const newTask = await TaskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      MotivationalToast.encouragement();
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await TaskService.update(taskId, { 
        completed: !task.completed 
      });
      
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      
      if (!task.completed) {
        // Task was just completed
        MotivationalToast.taskCompleted(task.points);
        if (onTaskComplete) {
          onTaskComplete(updatedTask);
        }
      }
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

const handleEditTask = async (taskId, updates) => {
    try {
      const updatedTask = await TaskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await TaskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleReorderTasks = (draggedId, targetId) => {
    const draggedIndex = tasks.findIndex(t => t.Id === draggedId);
    const targetIndex = tasks.findIndex(t => t.Id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    
    // Update order values
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index
    }));
    
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  if (loading) return <Loading />;

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="space-y-4">
      {/* Quick Add */}
      <QuickAddTask onAdd={handleAddTask} isMinimalMode={isMinimalMode} />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks yet"
          description="Add your first task to get started on your focus journey!"
          actionText="Add Task"
          onAction={() => {/* Quick add will handle this */}}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                dragHandleProps={{
                  onDragStart: () => {},
                  onDragEnd: () => {},
                }}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Task Summary */}
      {!isMinimalMode && filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredTasks.filter(t => t.completed).length} of {filteredTasks.length} tasks completed
            </span>
            <span className="font-medium text-primary-600">
              {Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100)}% done
            </span>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;